export namespace AuthModel {
  type GrantType = 'CAPTCHA' | 'EMAIL' | 'PHONE' | 'USERNAME';

  /** 登录接口参数 */
  export interface LoginDTO {
    username?: string;
    password?: string;
    code?: string;
    key?: string;
    authType: GrantType;
    // 设备信息
    deviceInfo?: string;
    deviceId?: string;
  }

  /**
   * 获取重定向地址参数
   */
  export interface GetRedirectUrlDTO extends LoginDTO {
    client: string; // AppKey
    mode: string; // 模式
    redirect: string; // 重定向地址
  }

  // 以下代码是历史代码
  export interface LoginParams {
    username?: string;
    password?: string;
    code?: string;
    key?: string;
    grantType: GrantType;
    refreshToken?: string;
    mobile?: string;
  }

  export interface LoginVO {
    id: string;
    tokenName: string;
    tokenValue: string;
    refreshToken: string;
    expire: string;
  }

  export interface LogoutParams {
    token: null | string;
  }

  export interface RefreshParams {
    refreshToken: null | string;
  }

  export interface RegisterVO {
    code: string;
    key: string;
    password: string;
    confirmPassword: GrantType;
    nickName?: string;
  }

  export interface RegisterByMobileVO extends RegisterVO {
    mobile: string;
  }

  export interface RegisterByEmailVO extends RegisterVO {
    email: string;
  }
}
