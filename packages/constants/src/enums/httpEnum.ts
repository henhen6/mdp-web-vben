/**
 * @description: Request result set
 */
export enum ResultEnum {
  // token 已被顶下线
  BE_REPLACED = 11_014,
  /** 提供的 ticket 是无效的 */
  CODE_30004 = 30_004,
  /** 在模式三下，sso-client 调用 sso-server 端 校验ticket接口 时，得到的响应是校验失败 */
  CODE_30005 = 30_005,

  ERROR = -1,
  // 访问资源 被禁止。 资源不可用，服务器理解客户的请求，但拒绝处理它。通常由于服务器上文件或目录的权限设置导致，可以简单的理解为没有权限访问此站。
  FORBIDDEN = 403,

  // token 无效
  INVALID_TOKEN = 11_012,
  // token 已被踢下线
  KICK_OUT = 11_015,
  // 未能读取到有效Token
  NOT_TOKEN = 11_011,
  // 已被冻结
  NOT_VALUE_EXPIRE = 11_016,
  SUCCESS = 0,
  // token 已过期
  TOKEN_TIMEOUT = 11_013,

  TYPE = 'success',

  // 登录 未授权。 客户端在访问请求的资源之前，对自己进行认证。，可以简单的理解为没有登录此站。
  UNAUTHORIZED = 401,
}

/**
 * @description: request method
 */
export enum RequestEnum {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

export const HTTP_TAG_MAP = new Map([
  [RequestEnum.DELETE, 'error'],
  [RequestEnum.GET, 'success'],
  [RequestEnum.POST, 'processing'],
  [RequestEnum.PUT, 'warning'],
]);

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // json
  JSON = 'application/json;charset=UTF-8',
}
