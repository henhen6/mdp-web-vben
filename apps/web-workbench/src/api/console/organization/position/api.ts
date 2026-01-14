import type { PositionType } from './model';

import { ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const SERVICE_PREFIX = ServicePrefixEnum.CONSOLE;
const MODULAR = `${SERVICE_PREFIX}/organization/position`;

export namespace PositionApi {
  /**
   * 批量查询
   *
   * @param params 查询参数
   * @returns 所有数据
   */
  export const list = (params: Partial<PositionType.PositionQuery>) =>
    requestClient.post<PositionType.PositionVo[]>(`${MODULAR}/list`, params);

  /**
   * 单体查询
   *
   * @param id id
   * @returns 单个对象
   */
  export const getById = (id: string) =>
    requestClient.get<PositionType.PositionVo>(`${MODULAR}/getById`, {
      params: { id },
    });
}
