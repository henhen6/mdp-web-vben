/**
 *  审核状态
 */
export enum AuditStatusEnum {
  APPROVED = 2, // 通过
  INITIALIZED = 0, // 待提交
  PENDING = 1, // 申请中
  REJECTED = 99, // 退回
}

/**
 * 登录类型
 */
export enum AppLoginTypeEnum {
  oauth2 = '20',
  sso = '10',
}

/**
 * 应用类型
 * [10-自建应用 20-第三方应用]
 */
export enum AppTypeEnum {
  SELF_BUILT = '10',
  THIRD_PARTY = '20',
}
