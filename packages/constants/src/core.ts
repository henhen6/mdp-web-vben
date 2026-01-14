/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/auth/login';
/**
 * 单点登录页
 */
export const SSO_LOGIN_PATH = '/auth/login';
export const REGISTER_PATH = '/auth/register';

/**
 * @zh_CN 默认首页地址
 * @since 2025年01月07日11:41:02 by 最后
 */
export const DEFAULT_HOME_PATH = '/home';
/* 个人中心页面 */
export const PROFILE_PATH = '/profile';

export interface LanguageOption {
  label: string;
  value: 'en-US' | 'zh-CN';
}

/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English',
    value: 'en-US',
  },
];
