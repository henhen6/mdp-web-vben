import type { AppType } from './model';

import { RequestEnum, ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const SERVICE_PREFIX = ServicePrefixEnum.OPEN;
const MODULAR = `${SERVICE_PREFIX}/admin/app`;

export const AppConfig = {
  Save: {
    url: `${MODULAR}/save`,
    method: RequestEnum.POST,
  },
  Update: {
    url: `${MODULAR}/update`,
    method: RequestEnum.POST,
  },
};

export namespace AppApi {
  /**
   * 查询我可以访问的应用
   *
   * @returns 所有数据
   */
  export const listMyApp = () =>
    requestClient.post<AppType.AppVo[]>(`${MODULAR}/listMyApp`);
}
