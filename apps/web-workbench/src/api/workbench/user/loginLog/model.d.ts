export namespace LoginLogType {
  export interface LoginLogDto {
    id: string; // 主键
    userId: string; // 登录用户
    name: string; // 姓名
    account: string; // 登录人账号
    eventType: string; // 事件类型
    status: string; // 登录状态
    statusReason: string; // 登录状态原因
    authType: string; // 认证方式
    loginChannel: string; // 登录渠道
    loginDate: string; // 登录时间
    loginIp: string; // 登录IP
    ipLocation: string; // IP 归属地
    ua: string; // 浏览器请求头
    browserName: string; // 浏览器名称
    browserVersion: string; // 浏览器版本
    os: string; // 操作系统
    deviceInfo: string; // 设备信息
    appKey: string; // 应用Key
    appName: string; // 应用名称
    appRedirect: string; // 应用地址
    tokenInfo: string; // 登录令牌
    createdAt: string; // 创建时间
    createdBy: string; // 创建人
  }

  export interface LoginLogVo {
    id: string; // 主键
    userId: string; // 登录用户
    name: string; // 姓名
    account: string; // 登录人账号
    eventType: string; // 事件类型
    status: string; // 登录状态
    statusReason: string; // 登录状态原因
    authType: string; // 认证方式
    loginChannel: string; // 登录渠道
    loginDate: string; // 登录时间
    loginIp: string; // 登录IP
    ipLocation: string; // IP 归属地
    ua: string; // 浏览器请求头
    browserName: string; // 浏览器名称
    browserVersion: string; // 浏览器版本
    os: string; // 操作系统
    deviceInfo: string; // 设备信息
    appKey: string; // 应用Key
    appName: string; // 应用名称
    appRedirect: string; // 应用地址
    tokenInfo: string; // 登录令牌
    createdAt: string; // 创建时间
    createdBy: string; // 创建人
  }

  export interface LoginLogQuery {
    id: string; // 主键
    userId: string; // 登录用户
    name: string; // 姓名
    account: string; // 登录人账号
    eventType: string; // 事件类型
    status: string; // 登录状态
    statusReason: string; // 登录状态原因
    authType: string; // 认证方式
    loginChannel: string; // 登录渠道
    loginDate: string; // 登录时间
    loginIp: string; // 登录IP
    ipLocation: string; // IP 归属地
    ua: string; // 浏览器请求头
    browserName: string; // 浏览器名称
    browserVersion: string; // 浏览器版本
    os: string; // 操作系统
    deviceInfo: string; // 设备信息
    appKey: string; // 应用Key
    appName: string; // 应用名称
    appRedirect: string; // 应用地址
    tokenInfo: string; // 登录令牌
    createdAt: string; // 创建时间
    createdBy: string; // 创建人
  }
}
