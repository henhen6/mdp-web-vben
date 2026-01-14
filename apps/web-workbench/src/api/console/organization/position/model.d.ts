export namespace PositionType {
  export interface PositionDto {
    id: string; // ID
    orgId: string; // 所属组织
    name: string; // 名称
    state: boolean; // 状态
    remarks: string; // 备注
    createdAt: string; // 创建时间
    createdBy: string; // 创建人
    updatedAt: string; // 修改时间
    updatedBy: string; // 修改人
  }

  export interface PositionVo {
    id: string; // ID
    orgId: string; // 所属组织
    name: string; // 名称
    state: boolean; // 状态
    remarks: string; // 备注
    createdAt: string; // 创建时间
    createdBy: string; // 创建人
    updatedAt: string; // 修改时间
    updatedBy: string; // 修改人
  }

  export interface PositionQuery {
    id: string; // ID
    orgId: string; // 所属组织
    name: string; // 名称
    state: boolean; // 状态
    remarks: string; // 备注
    createdAt: string; // 创建时间
    createdBy: string; // 创建人
    updatedAt: string; // 修改时间
    updatedBy: string; // 修改人
  }
}
