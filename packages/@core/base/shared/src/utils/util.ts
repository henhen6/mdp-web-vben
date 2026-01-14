export function bindMethods<T extends object>(instance: T): void {
  const prototype = Object.getPrototypeOf(instance);
  const propertyNames = Object.getOwnPropertyNames(prototype);

  propertyNames.forEach((propertyName) => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
    const propertyValue = instance[propertyName as keyof T];

    if (
      typeof propertyValue === 'function' &&
      propertyName !== 'constructor' &&
      descriptor &&
      !descriptor.get &&
      !descriptor.set
    ) {
      instance[propertyName as keyof T] = propertyValue.bind(instance);
    }
  });
}

/**
 * 获取嵌套对象的字段值
 * @param obj - 要查找的对象
 * @param path - 用于查找字段的路径，使用小数点分隔
 * @returns 字段值，或者未找到时返回 undefined
 */
export function getNestedValue<T>(obj: T, path: string): any {
  if (typeof path !== 'string' || path.length === 0) {
    throw new Error('Path must be a non-empty string');
  }
  // 把路径字符串按 "." 分割成数组
  const keys = path.split('.') as (number | string)[];

  let current: any = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key as keyof typeof current];
  }

  return current;
}

/**
 * 生成随机数
 * @param len - 随机数长度
 * @param radix - 随机数基数
 * @returns 随机数
 */
export function randomNum(len: number, radix?: number) {
  const chars = [
    ...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  ];
  const uuid = [] as string[];
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (let i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)] as string;
    }
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r] as string;
      }
    }
  }
  return uuid.join('') + Date.now();
}

/**
 * 从url中查询到指定参数值
 * @param name 参数名
 * @param defaultValue 默认值
 * @returns 参数值
 */
export const getParam = function (name: string, defaultValue?: any) {
  const query = window.location.search.slice(1);
  const vars = query.split('&');
  for (const var_ of vars) {
    const pair = var_.split('=');
    if (pair[0] === name) {
      return pair[1];
    }
  }
  return defaultValue === undefined ? null : defaultValue;
};
