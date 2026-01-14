export namespace OrgType {
  export interface OrgDto {
    id: string; // ID
    name: string; // 名称
    orgType: string; // 类型
    shortName: string; // 简称
    parentId: string; // 父组织
    treePath: string; // 树路径
    weight: number; // 排序
    state: boolean; // 状态
    remarks: string; // 备注
    createdAt: string; // 创建时间
    createdBy: string; // 创建人
    updatedAt: string; // 修改时间
    updatedBy: string; // 修改人
    deletedBy: string; // 删除人
    deletedAt: string; // 删除标识
  }

  export interface OrgVo {
    id: string; // ID
    name: string; // 名称
    orgType: string; // 类型
    shortName: string; // 简称
    parentId: string; // 父组织
    treePath: string; // 树路径
    weight: number; // 排序
    state: boolean; // 状态
    remarks: string; // 备注
    createdAt: string; // 创建时间
    createdBy: string; // 创建人
    updatedAt: string; // 修改时间
    updatedBy: string; // 修改人
    deletedBy: string; // 删除人
    deletedAt: string; // 删除标识
  }

  export interface OrgQuery {
    id: string; // ID
    name: string; // 名称
    orgType: string; // 类型
    shortName: string; // 简称
    parentId: string; // 父组织
    treePath: string; // 树路径
    weight: number; // 排序
    state: boolean; // 状态
    remarks: string; // 备注
    createdAt: string; // 创建时间
    createdBy: string; // 创建人
    updatedAt: string; // 修改时间
    updatedBy: string; // 修改人
    deletedBy: string; // 删除人
    deletedAt: string; // 删除标识
  }
}
