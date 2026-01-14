/**
 * 后端服务请求 前缀
 */
export enum ServicePrefixEnum {
  // 控制台
  CONSOLE = '/console',
  // 网关
  GATEWAY = '/gateway',
  // 代码生成器
  GENERATOR = '/generator',
  // 开发者中心
  OPEN = '/open',
  // 工作台
  WORKBENCH = '/workbench',
}

/** 审核状态 */
export enum AuditStatusEmum {
  APPLYING = 1,
  BACK = 99,
  INIT = 0,
  PASS = 2,
}

/**
 * 操作列 类型
 */
export enum ActionEnum {
  // 新增
  ADD = 'add',
  // 复制
  COPY = 'copy',
  // 删除
  DELETE = 'delete',
  // 编辑
  EDIT = 'edit',
  // 搜索
  SEARCH = 'search',
  // 详情
  VIEW = 'view',
}

export const VALIDATE_API = {
  [ActionEnum.ADD]: 'Save',
  [ActionEnum.EDIT]: 'Update',
  [ActionEnum.COPY]: 'Save',
};

export const REQUEST_API: Record<ActionEnum, string> = {
  [ActionEnum.ADD]: 'save',
  [ActionEnum.EDIT]: 'update',
  [ActionEnum.COPY]: 'save',
  [ActionEnum.VIEW]: 'get',
  [ActionEnum.SEARCH]: 'get',
  [ActionEnum.DELETE]: 'delete',
};

/**
 * 文件的 桶 （需要提前跟后端约定，并让后端配置到OSS中）
 */
export enum FileBucketEnum {
  // 需要自行在华为云或minio等第三方对象存储提前创建 公开读写的桶
  public = 'tt-public',
}

/**
 * 路由名称
 */
export enum RouteEnum {}
