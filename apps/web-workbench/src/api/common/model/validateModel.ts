import type { VbenFormSchema as FormSchema } from '@vben/common-ui';

import { z as zod } from '@vben/components/adapter';
import { dateUtil } from '@vben/utils';

export enum RuleType {
  // and :追加规则
  and,
  // or
  or,
  // 覆盖规则
  cover,
}

export type FormSchemaExt = Partial<FormSchema> & {
  ruleType?: RuleType;
};

export type ValidateRules = {
  field: string;
  rules?: FormSchemaExt[];
};

export type ConstraintInfo = {
  attrs: any;
  type: string;
};

export type FieldValidatorDesc = {
  constraints: ConstraintInfo[];
  field: string;
  fieldType: string;
  name: string;
};

export interface RuleMatch {
  match: (type: string) => boolean;
  callback: (param: any) => zod.ZodTypeAny;
}

/** 替换message 中的占位符 */
export function getMessage(attrs: any) {
  if (!attrs || !attrs.message) {
    return undefined;
  }

  const reg = /\{([a-z0-9]*)\}/gi;
  let result;
  let message = attrs.message;
  // eslint-disable-next-line no-cond-assign
  while ((result = reg.exec(attrs.message)) !== null) {
    const place = result[0];
    const field = result[1] as string;
    const replacement = attrs[field] ?? '';
    message = message.replaceAll(place, replacement);
  }
  return message;
}

/**
 * 时间与当前时间进行比较， 不存在的情况默认都是比较成功 返回true
 *
 * @param dateStr 待比较日期
 * @param timeType 时间类型
 * @param compareType 比较类型
 */
export function compareDate2Now(
  dateStr: string,
  timeType = 'Date',
  compareType = 'Past',
) {
  if (dateStr) {
    let now = dateUtil();
    if (timeType === 'Date') {
      now = now.startOf('day');
    }
    switch (compareType) {
      case 'Future': {
        return now.isBefore(dateUtil(dateStr));
      }
      case 'FutureOrPresent': {
        return now.isSameOrBefore(dateUtil(dateStr));
      }
      case 'Past': {
        return now.isAfter(dateUtil(dateStr));
      }
      case 'PastOrPresent': {
        return now.isSameOrAfter(dateUtil(dateStr));
      }
      // No default
    }
  }
  return true;
}

// 后端的数字类型
export const BACKEND_NUMBER = [
  'BigDecimal',
  'BigInteger',
  'Integer',
  'Long',
  'Float',
  'Double',
  'Short',
];
// 后端类型和前端类型映射
export const ruleTypeMap = new Map();
ruleTypeMap.set('String', 'string');
ruleTypeMap.set('Integer', 'string');
ruleTypeMap.set('Boolean', 'boolean');
ruleTypeMap.set('Float', 'string');
ruleTypeMap.set('Array', 'array');
ruleTypeMap.set('Date', 'date');
ruleTypeMap.set('DateTime', 'date');
ruleTypeMap.set('Time', 'date');
