export namespace UserType {
  export interface UserDto {
    id: string; // ID
    username: string; // 用户名
    password: string; // 密码
    sex: string; // 性别
    salt: string; // 盐值
    phone: string; // 电话号码
    avatar: string; // 头像
    name: string; // 姓名
    email: string; // 邮箱地址
    state: boolean; // 状态
    lastDeptId: string; // 上次登录的部门
    lastCompanyId: string; // 上次登录的单位
    lastTopCompanyId: string; // 上次登录的顶级单位
    pwErrorLastTime: string; // 输错密码时间
    pwErrorNum: number; // 密码错误次数
    pwExpireTime: string; // 密码过期时间
    lastLoginTime: string; // 最后登录时间
    wxOpenid: string; // 微信登录openId
    ddOpenid: string; // 钉钉openId
    userType: number; // 人员类型
    positionId: string; // 所属岗位
    userSource: string; // 用户来源
    createdBy: string; // 创建人
    createdAt: string; // 创建时间
    updatedBy: string; // 修改人
    updatedAt: string; // 最后修改时间
    deletedBy: string; // 删除人
    deletedAt: string; // 删除标志
  }

  export interface UserVo {
    id: string; // ID
    username: string; // 用户名
    password: string; // 密码
    sex: string; // 性别
    salt: string; // 盐值
    phone: string; // 电话号码
    avatar: string | undefined; // 头像
    name: string; // 姓名
    email: string; // 邮箱地址
    state: boolean; // 状态
    lastDeptId: string; // 上次登录的部门
    lastCompanyId: string; // 上次登录的单位
    lastTopCompanyId: string; // 上次登录的顶级单位
    pwErrorLastTime: string; // 输错密码时间
    pwErrorNum: number; // 密码错误次数
    pwExpireTime: string; // 密码过期时间
    lastLoginTime: string; // 最后登录时间
    wxOpenid: string; // 微信登录openId
    ddOpenid: string; // 钉钉openId
    userType: number; // 人员类型
    positionId: string; // 所属岗位
    userSource: string; // 用户来源
    createdBy: string; // 创建人
    createdAt: string; // 创建时间
    updatedBy: string; // 修改人
    updatedAt: string; // 最后修改时间
    deletedBy: string; // 删除人
    deletedAt: string; // 删除标志
    avatarObjectId: string | undefined; // 新增和修改页面临时头像
  }

  export interface UserQuery {
    id: string; // ID
    username: string; // 用户名
    password: string; // 密码
    sex: string; // 性别
    salt: string; // 盐值
    phone: string; // 电话号码
    avatar: string; // 头像
    name: string; // 姓名
    email: string; // 邮箱地址
    state: boolean; // 状态
    lastDeptId: string; // 上次登录的部门
    lastCompanyId: string; // 上次登录的单位
    lastTopCompanyId: string; // 上次登录的顶级单位
    pwErrorLastTime: string; // 输错密码时间
    pwErrorNum: number; // 密码错误次数
    pwExpireTime: string; // 密码过期时间
    lastLoginTime: string; // 最后登录时间
    wxOpenid: string; // 微信登录openId
    ddOpenid: string; // 钉钉openId
    userType: number; // 人员类型
    positionId: string; // 所属岗位
    userSource: string; // 用户来源
    createdBy: string; // 创建人
    createdAt: string; // 创建时间
    updatedBy: string; // 修改人
    updatedAt: string; // 最后修改时间
    deletedBy: string; // 删除人
    deletedAt: string; // 删除标志

    roleId: string;
    hasUser: boolean;
  }

  export interface UserResetPasswordDto {
    id: string;
    defPassword: boolean;
    password?: string;
  }
}
