import type { NoticeType } from './model';

import type { PageParams, PageResult } from '#/api';

import { ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const SERVICE_PREFIX = ServicePrefixEnum.WORKBENCH;
const MODULAR = `${SERVICE_PREFIX}/notice`;

export namespace NoticeApi {
  /**
   * 分页查询
   *
   * @param params 分页参数
   * @returns 每页数据
   */
  export const page = (params: PageParams<Partial<NoticeType.NoticeQuery>>) =>
    requestClient.post<PageResult<NoticeType.NoticeVo>>(
      `${MODULAR}/page`,
      params,
    );

  /**
   * 单体查询
   *
   * @param id id
   * @returns 单个对象
   */
  export const getById = (id: string) =>
    requestClient.get<NoticeType.NoticeVo>(`${MODULAR}/getById`, {
      params: { id },
    });

  /**
   * 标记为已读
   *
   * @param ids id
   * @returns 是否成功
   */
  export const mark = (ids: string[]) =>
    requestClient.post<boolean>(`${MODULAR}/mark`, ids);

  /**
   * 批量删除
   *
   * @param ids id
   * @returns 是否成功
   */
  export const remove = (ids: string[]) =>
    requestClient.post<boolean>(`${MODULAR}/delete`, ids);
}
