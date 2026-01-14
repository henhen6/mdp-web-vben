import type { VbenFormSchema as FormSchema } from '@vben/common-ui';
import type { AxiosRequestConfig } from '@vben/request';

import type {
  ConstraintInfo,
  FieldValidatorDesc,
  FormSchemaExt,
  RuleMatch,
} from '#/api';

import { z as zod } from '@vben/components/adapter';
import { useMessage } from '@vben/components/hooks';
import { ServicePrefixEnum } from '@vben/constants';
import { isEmptyOrUnDef, isNullOrUnDef, split } from '@vben/utils';

import { consola } from 'consola';

import { BACKEND_NUMBER, compareDate2Now, getMessage, RuleType } from '#/api';

import { requestClient } from '../request';

// 全局的规则缓存，页面刷新时重置
const RULE_MAP_CACHE = new Map();

const { createMessage } = useMessage();

// 排序规则
const targetOrder = [
  'NotNull',
  'DecimalMin',
  'Min',
  'DecimalMax',
  'Max',
  'Negative',
  'NegativeOrZero',
  'Positive',
  'PositiveOrZero',
  'AssertTrue',
  'AssertFalse',
  'Future',
  'FutureOrPresent',
  'Past',
  'PastOrPresent',
  'Digits',
  'Range',
  'Null',
  'RegEx',
];

const list: RuleMatch[] = [
  {
    match: (type: string) => {
      return type === 'Null';
    },
    callback: ({ rules, attrs }) => {
      return rules.refine((val: any) => isEmptyOrUnDef(val), {
        message: getMessage(attrs),
      });
    },
  },
  {
    match: (type: string) => {
      return type === 'Range';
    },
    callback: ({ rules, attrs }) => {
      if (attrs.min) {
        rules = rules.min(attrs.min, { message: getMessage(attrs) });
      }
      if (!isNullOrUnDef(attrs.max)) {
        rules = rules.max(attrs.max, { message: getMessage(attrs) });
      }
      return rules;
    },
  },
  {
    match: (type: string) => {
      return type === 'RegEx';
    },
    callback: ({ rules, attrs }) => {
      if (attrs.regexp) {
        // rules = rules.regex(new RegExp(attrs.regexp), {
        //   message: getMessage(attrs),
        // });

        return rules.refine(
          (value: string) => {
            // 空值判断：undefined/null/'' 均跳过校验
            const isEmpty =
              value === undefined || value === null || value === '';
            if (isEmpty) return true;

            // 非空值：执行正则校验
            return new RegExp(`^${attrs.regexp}$`).test(value);
          },
          { message: getMessage(attrs) }, // 校验失败提示
        );
      }
      return rules;
    },
  },
  {
    match: (type: string) => {
      return ['DecimalMax', 'Max'].includes(type);
    },
    callback: ({ rules, attrs }) => {
      rules = rules.max(attrs.value, { message: getMessage(attrs) });
      return rules;
    },
  },
  {
    match: (type: string) => {
      return ['DecimalMin', 'Min'].includes(type);
    },
    callback: ({ rules, attrs }) => {
      rules = rules.min(attrs.value, { message: getMessage(attrs) });
      return rules;
    },
  },
  {
    match: (type: string) => {
      return ['AssertTrue'].includes(type);
    },
    callback: ({ rules, attrs }) => {
      return rules.refine((val: any) => val === 'true' || val === true, {
        message: getMessage(attrs),
      });
    },
  },
  {
    match: (type: string) => {
      return ['AssertFalse'].includes(type);
    },
    callback: ({ rules, attrs }) => {
      return rules.refine((val: any) => val === 'false' || val === false, {
        message: getMessage(attrs),
      });
    },
  },

  // 数字
  {
    match: (type: string) => {
      return ['Digits'].includes(type);
    },
    callback: ({ rules, attrs }) => {
      return rules
        .refine(
          (val: any) => {
            const numVal = Number(val);
            // 小数
            if (/.*\..*/.test(numVal.toString())) {
              const [zsj, xsj] = split(numVal.toString(), '.');
              const integer = zsj && zsj.length <= attrs.integer;
              const fraction = xsj && xsj.length <= attrs.fraction;
              return integer && fraction;
            }
            // 整数
            return numVal.toString().length <= attrs.integer;
          },
          {
            message: getMessage(attrs),
          },
        )
        .nullish();
    },
  },
  {
    match: (type: string) => {
      // 为空或者小于0
      return ['Negative'].includes(type);
    },
    callback: ({ rules, attrs }) => {
      return rules.negative({ message: getMessage(attrs) }).nullish();
    },
  },
  {
    match: (type: string) => {
      // 为空或者小于等于0
      return ['NegativeOrZero'].includes(type);
    },
    callback: ({ rules, attrs }) => {
      return rules.nonpositive({ message: getMessage(attrs) }).nullish();
    },
  },
  {
    match: (type: string) => {
      // 为空或者大于0
      return ['Positive'].includes(type);
    },
    callback: ({ rules, attrs }) => {
      return rules.positive({ message: getMessage(attrs) }).nullish();
    },
  },
  {
    match: (type: string) => {
      // 为空或者大于等于0
      return ['PositiveOrZero'].includes(type);
    },
    callback: ({ rules, attrs }) => {
      return rules.nonnegative({ message: getMessage(attrs) }).nullish();
    },
  },

  // 日期大小比较
  {
    match: (type: string) => {
      return ['Future', 'FutureOrPresent', 'Past', 'PastOrPresent'].includes(
        type,
      );
    },
    callback: ({ rules, attrs, fieldType, type }) => {
      return rules
        .refine((val: any) => compareDate2Now(val, fieldType, type), {
          message: getMessage(attrs),
        })
        .nullish();
    },
  },
];

/** 获取非空校验 */
function getNotNull(constraints: ConstraintInfo[]): ConstraintInfo | null {
  for (const constraint of constraints) {
    if (constraint.type === 'NotNull') {
      return constraint;
    }
  }
  return null;
}

/* 转换后端的规则 */
function transformationRules(
  data: FieldValidatorDesc[],
): Partial<FormSchema>[] {
  const schemaRules: Partial<FormSchema>[] = [];

  data.forEach(({ field, fieldType, constraints }) => {
    if (!constraints) {
      return;
    }

    const constraint = getNotNull(constraints);

    let rules: zod.ZodTypeAny;

    if (BACKEND_NUMBER.includes(fieldType)) {
      rules =
        constraint === null
          ? zod.number({
              required_error: '此项必填',
              invalid_type_error: '数据类型错误',
            })
          : zod.number({
              required_error: getMessage(constraint?.attrs),
              invalid_type_error: '数据类型错误',
            });
    } else if (fieldType === 'Boolean') {
      rules =
        constraint === null
          ? zod.boolean({
              required_error: '此项必填',
              invalid_type_error: '数据类型错误',
            })
          : zod.boolean({
              required_error: getMessage(constraint?.attrs),
              invalid_type_error: '数据类型错误',
            });
    } else {
      rules =
        constraint === null
          ? zod.string({ required_error: '此项必填' })
          : zod
              .string({ required_error: getMessage(constraint?.attrs) })
              .nonempty(getMessage(constraint?.attrs));
    }

    // 强制排序
    const sortedConstraints = constraints.toSorted(
      (a, b) => targetOrder.indexOf(a.type) - targetOrder.indexOf(b.type),
    );

    sortedConstraints.forEach(({ type, attrs }) => {
      list.some(({ match, callback }) => {
        if (match(type)) {
          rules = callback({ rules, attrs, fieldType, type });
          return true;
        }
        return false;
      });
    });

    // 可选项
    if (constraint === null) {
      rules = rules.optional().nullable();
    }

    schemaRules.push({ fieldName: field, rules });
  });

  return schemaRules;
}

function mergeRules(
  rules: Partial<FormSchema>[],
  customRules?: FormSchemaExt[],
): Partial<FormSchema>[] {
  if (!customRules) {
    return rules;
  }

  const ruleMap = new Map();
  for (const rule of rules) {
    ruleMap.set(rule.fieldName, rule);
  }

  const customMap = new Map();
  for (const rule of customRules) {
    customMap.set(rule.fieldName, rule);
  }

  rules.forEach((rule) => {
    const customRule = customMap.get(rule.fieldName);
    if (!customRule) {
      return;
    }
    switch (customRule.ruleType) {
      case RuleType.and: {
        rule.rules = rule.rules
          ? zod.intersection(rule.rules as zod.ZodTypeAny, customRule.rules)
          : customRule;
        break;
      }
      case RuleType.or: {
        rule.rules = rule.rules
          ? zod.union([rule.rules as zod.ZodTypeAny, customRule.rules])
          : customRule;
        break;
      }
      default: {
        rule.rules = customRule.rules;
        break;
      }
    }
  });

  // 处理rules中没有，customRules有的情况
  for (const rule of customRules) {
    if (!ruleMap.has(rule.fieldName)) {
      rules.push(rule);
    }
  }

  return rules;
}

/**
 * 从后端获取某个接口基于 Hibernate Validator 注解生成 vben-form 的参数校验规则
 * @param param 参数
 * @param param.Api url和method
 * @param param.customRules 自定义规则
 * @param param.cache 是否缓存校验规则，若你的规则需要使用页面上的其他参数，一定要设置为false
 */
export const getValidateRuleByVben = async (param: {
  Api: AxiosRequestConfig;
  cache?: boolean;
  customRules?: FormSchemaExt[];
}): Promise<FormSchemaExt[]> => {
  const { Api, customRules, cache } = param;
  const formValidateApi = { url: '', method: Api.method?.toLowerCase() };

  for (const [_, value] of Object.entries(ServicePrefixEnum)) {
    if (Api.url?.startsWith(value)) {
      formValidateApi.url = Api.url.replace(value, `${value}/form/validator`);
    }
  }
  try {
    if (!formValidateApi.url) {
      createMessage.error('ServicePrefixEnum枚举类未正确配置！');
      return [];
    }

    const key = formValidateApi.url + formValidateApi.method;
    if (cache && RULE_MAP_CACHE.has(key)) {
      return RULE_MAP_CACHE.get(key);
    }

    const res =
      await requestClient.request2<FieldValidatorDesc[]>(formValidateApi);

    if (res) {
      const formSchemaRules = transformationRules(res);
      const rules = mergeRules(formSchemaRules, customRules);

      RULE_MAP_CACHE.set(key, rules);
      return rules;
    }
    return [];
  } catch (error) {
    consola.error(error);
    createMessage.error('获取表单校验异常');
    return [];
  }
};
