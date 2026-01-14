import type { DetailType } from '@vben-core/form-ui';

import type { VbenFormSchema } from '../adapter';
import type { DescItem } from '../description';

import { $t } from '@vben/locales';
import { isBoolean, isFunction, isNullOrUnDef } from '@vben/utils';

export const omit = (obj: any, keysToOmit: string[]) => {
  // 如果 obj 不是对象或者 keysToOmit 不是数组，则直接返回 obj
  if (typeof obj !== 'object' || !Array.isArray(keysToOmit)) {
    return obj;
  }

  // 创建一个新的对象，避免修改原始对象
  const result = {} as any;

  // 遍历 obj 的所有键值对
  for (const key in obj) {
    // 如果当前键不在要忽略的键列表中，则复制到新对象
    if (!keysToOmit.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};
export const get = (object: any, path: string) => {
  // 如果 object 不是对象或者 path 不是字符串，则直接返回 defaultValue
  if (
    typeof object !== 'object' ||
    object === null ||
    typeof path !== 'string'
  ) {
    return undefined;
  }

  // 将路径字符串转换为数组
  const pathArray = path.split('.').filter(Boolean); // 过滤掉空字符串
  let current = object;

  // 遍历路径数组
  for (const element of pathArray) {
    // 如果当前层级不是对象或没有对应的键，则返回 defaultValue
    if (
      typeof current !== 'object' ||
      current === null ||
      !(element in current)
    ) {
      return undefined;
    }
    // 更新 current 到下一层级
    current = current[element];
  }

  // 返回最终找到的值
  return current;
};

/**
 * 检查表单字段是否应该显示详情
 *
 * 该方法用于判断在详情展示模式下，是否应该显示某个表单字段的详细信息。
 * 判断逻辑遵循以下优先级顺序：
 * 1. 如果schema不存在，默认显示
 * 2. 首先检查schema.detail.enabled配置，如果是函数，则执行函数判断；如果是布尔值，则根据其值判断是否显示
 * 3. 如果detail配置不存在或不完整，则检查schema.dependencies配置，根据其if和show配置判断是否显示
 * 4. 默认显示所有字段
 *
 * @param renderCallbackParams 渲染回调参数对象
 * @param renderCallbackParams.schema 表单字段配置对象，定义了字段的显示规则和依赖关系
 * @param renderCallbackParams.values 表单当前值，用于根据当前表单状态判断是否显示字段
 * @returns boolean 返回true表示应该显示详情，false表示不显示
 */
export const ifDetail = (renderCallbackParams: {
  schema: undefined | VbenFormSchema;
  values: Partial<Record<string, any>>;
}): boolean => {
  const { values, schema } = renderCallbackParams;

  // 1. schema不存在时默认显示
  if (isNullOrUnDef(schema)) {
    return true;
  }

  // 2. 优先检查detail配置
  // 如果detail.enabled是函数，则执行函数判断
  if (isFunction(schema.detail?.enabled)) {
    return schema.detail?.enabled(values, schema);
  }
  // 如果detail.enabled是布尔值，则根据其值判断
  if (!isNullOrUnDef(schema.detail?.enabled)) {
    return schema.detail?.enabled !== false;
  }

  // 3. 检查dependencies配置
  // 如果dependencies不存在，默认显示
  if (isNullOrUnDef(schema.dependencies)) {
    return true;
  }

  const { if: whenIf, show } = schema.dependencies;

  // 处理dependencies.if配置
  if (isFunction(whenIf)) {
    return whenIf(values, {} as any) as boolean;
  } else if (isBoolean(whenIf)) {
    return whenIf !== false;
  }

  // 处理dependencies.show配置
  if (isFunction(show)) {
    return show(values, {} as any) as boolean;
  } else if (isBoolean(show)) {
    return show !== false;
  }

  // 4. 默认显示
  return true;
};

/**
 * 将表单元数据转换为详情表单
 * @param formSchemas 表单配置
 * @param values 表单值
 * @param defDetail 默认的详情配置
 */
export const schemaToDetailForm = (
  formSchemas: VbenFormSchema[],
  values: any,
  defDetail?: DetailType,
): DescItem[] => {
  const group: Array<DescItem> = [];
  if (!Array.isArray(formSchemas)) return group;
  for (let i = 0; i < formSchemas.length; i++) {
    const item = formSchemas[i];
    // 找到分割线
    if (item?.component === 'Divider') {
      group.push({
        field: item.fieldName,
        label: item.label,
        children: [],
      } as unknown as DescItem);
      // 将分割线后面的数据添加到group中
      for (let j = i + 1; j < formSchemas.length; j++) {
        const nextItem = formSchemas[j];
        // 找到下面的分割线
        if (nextItem?.component === 'Divider') {
          // 中断
          i = j - 1;
          break;
        } else {
          if (
            ifDetail({
              schema: nextItem,
              values,
            })
          ) {
            const detail = nextItem?.detail || { enabled: true };
            const label = detail.label || nextItem?.label;
            group[group.length - 1]?.children?.push({
              field: nextItem?.fieldName,
              label,
              span: detail?.span || defDetail?.span || 6,
              copy: detail?.copy || defDetail?.copy,
              render: detail?.render,
              component: nextItem?.component,
              componentProps:
                typeof nextItem?.componentProps === 'function'
                  ? nextItem.componentProps(values, {} as any)
                  : nextItem?.componentProps,
            } as DescItem);
          }
        }
      }
    }
  }
  if (group.length > 0) {
    return group;
  }
  return [
    {
      field: 'baseinfo',
      label: $t('common.column.baseInfo'),
      children: formSchemas
        .filter((item) => {
          return ifDetail({
            schema: item,
            values,
          });
        })
        .map((item) => {
          const detail = item?.detail || { enabled: true };
          const label = detail.label || item?.label;
          return {
            field: item.fieldName,
            label,
            span: detail?.span || defDetail?.span || 6,
            copy: detail?.copy || defDetail?.copy,
            render: detail?.render,
            component: item.component,
            componentProps:
              typeof item?.componentProps === 'function'
                ? item.componentProps(values, {} as any)
                : item.componentProps,
          } as DescItem;
        }),
    } as DescItem,
  ];
};

// 获取子节点id
export const getChildIds = (record: any) => {
  const ids = [record.id];
  record.children?.forEach((item: any) => {
    ids.push(...getChildIds(item));
  });
  return ids;
};

/**
 * 获取所有叶子节点
 * @param treeData
 */
export const getLeafNodeIds = (treeData: any) => {
  const leafNodeIds: any = [];

  function traverse(node: any) {
    // 如果当前节点没有 children 或 children 是空数组，则它是叶子节点
    if (!node.children || node.children.length === 0) {
      leafNodeIds.push(node.id);
    } else {
      // 否则，递归遍历每个子节点
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  // 遍历树的根节点
  for (const root of treeData) {
    traverse(root);
  }
  return leafNodeIds;
};

/**
 * 获取所有节点id
 * @param treeData
 */
export const getAllNodeIds = (treeData: any) => {
  const allNodeIds: any = [];

  function traverse(node: any) {
    // 收集当前节点的 id
    allNodeIds.push(node.id);

    // 如果当前节点有 children，则递归遍历每个子节点
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  // 遍历树的根节点
  for (const root of treeData) {
    traverse(root);
  }

  return allNodeIds;
};

/**
 * -转大驼峰
 * @param str
 */
export const toPascalCase = (str: any) => {
  // 将连字符或下划线替换为空格，以便后续处理
  const words = str.replaceAll(/[-_]/g, ' ').split(' ');

  // 将每个单词的首字母大写，并将其余部分保持原样
  const pascalCaseWords = words.map((word: any) => {
    if (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word;
  });

  // 将处理后的单词拼接成一个新的字符串
  return pascalCaseWords.join('');
};

/**
 * 转-kebab
 */
export const toKebabCase = (str: string) => {
  // 将每个单词的首字母小写，并在单词之间插入连字符
  return str
    .replaceAll(/([A-Z])/g, (match, _p1, offset) => {
      // 如果是第一个字符，直接转为小写
      if (offset === 0) {
        return match.toLowerCase();
      }
      // 否则，在大写字母前加上连字符，并将大写字母转为小写
      return `-${match.toLowerCase()}`;
    })
    .toLowerCase(); // 确保整个字符串都是小写
};

export function getFileNameWithoutExtension(path: string) {
  // 使用正则表达式匹配最后一个 / 后面的所有字符，但不包括最后一个点（.）之后的内容
  const match = path.match(/[^/]+(?=\.[^./]+$|$)/);
  return match ? match[0].replace(/\.[^/.]+$/, '') : null;
}
