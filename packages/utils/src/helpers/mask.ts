import { isEmpty, isString, trim } from '@vben-core/shared/utils';

/**
 * 手机号脱敏（TS 版，修复 never 类型问题）
 * @param {string | number | null | undefined} phone - 原始手机号
 * @returns {string} 脱敏后的手机号
 */
export const maskPhone = (
  phone: null | number | string | undefined,
): string => {
  // 1. 空值处理，避免类型收窄过度
  if (isEmpty(phone)) return String(phone);

  // 2. 显式标注类型，确保是字符串
  const phoneStr: string = isString(phone) ? trim(phone) : String(phone).trim();

  // 3. 用 replace 替代 replaceAll，兼容+避坑
  const purePhone = phoneStr.replaceAll(/\D/g, '');

  // 4. 正则脱敏
  const phoneReg = /^(\d{3})\d{4}(\d{4})$/;
  return phoneReg.test(purePhone)
    ? purePhone.replace(phoneReg, '$1****$2')
    : phoneStr;
};

/**
 * 邮箱脱敏
 * @param {string} email - 原始邮箱
 * @returns {string} 脱敏后的邮箱（格式错误/空值返回原数据）
 */
export const maskEmail = (email: null | string | undefined) => {
  // 1. Lodash 校验：非字符串/空值直接返回
  if (!isString(email) || isEmpty(trim(email))) return email;

  const emailStr = trim(email);
  // 2. 邮箱正则（简单匹配，满足通用场景）
  const emailReg = /^(\w)[\w.-]*@([\w-]+\.[\w.-]+)$/;

  // 3. 匹配成功则脱敏，失败返回原邮箱
  return emailReg.test(emailStr)
    ? emailStr.replace(emailReg, '$1****@$2')
    : emailStr;
};
