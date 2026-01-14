interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  /**
   * 头像（关联资源ID）
   */
  avatar?: string;

  /**
   * 邮箱地址
   */
  email?: string;

  /**
   * ID
   */
  id?: string;

  /**
   * 上次登录的单位ID
   */
  lastCompanyId?: string;

  /**
   * 上次登录的部门ID
   */
  lastDeptId?: string;

  /**
   * 最后登录时间
   * 格式：ISO 8601（如：2025-11-11T12:00:00）
   */
  lastLoginTime?: string;

  /**
   * 上次登录的顶级单位ID
   */
  lastTopCompanyId?: string;

  /**
   * 姓名
   */
  name?: string;

  /**
   * 电话号码
   */
  phone?: string;

  /**
   * 输错密码时间
   * 格式：ISO 8601（如：2025-11-11T12:00:00）
   */
  pwErrorLastTime?: string;

  /**
   * 密码错误次数
   */
  pwErrorNum?: number;

  /**
   * 密码过期时间
   */
  pwExpireTime?: string;

  /**
   * 性别
   * [1-男 2-女]
   */
  sex?: string;

  /**
   * 状态
   * [0-禁用 1-正常]
   * 注：Java中Boolean类型，TS对应boolean（0映射false，1映射true）
   */
  state?: boolean;

  /**
   * 用户名
   */
  username?: string;

  /**
   * 人员类型
   * [1-普通用户 2-管理员 99-运维管理员]
   */
  userType?: number;
}

type ClassType = Array<object | string> | object | string;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
