import type { OrgType } from './model';

import { ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const SERVICE_PREFIX = ServicePrefixEnum.CONSOLE;
const MODULAR = `${SERVICE_PREFIX}/organization/org`;

export namespace OrgApi {
  /**
   * 批量查询
   *
   * @param params 查询参数
   * @returns 所有数据
   */
  export const list = (params: Partial<OrgType.OrgQuery>) =>
    requestClient.post<OrgType.OrgVo[]>(`${MODULAR}/list`, params);

  /**
   * 单体查询
   *
   * @param id id
   * @returns 单个对象
   */
  export const getById = (id: string) =>
    requestClient.get<OrgType.OrgVo>(`${MODULAR}/getById`, {
      params: { id },
    });

  /**
   * 批量查询 Tree
   *
   * @param params 查询参数
   * @returns 树结构数据
   */
  export const tree = (params: Partial<OrgType.OrgQuery>) =>
    requestClient.post<OrgType.OrgVo[]>(`${MODULAR}/tree`, params);
}
