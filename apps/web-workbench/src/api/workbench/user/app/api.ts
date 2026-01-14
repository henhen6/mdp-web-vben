import { ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const ServicePrefix = ServicePrefixEnum.WORKBENCH;
export namespace MyAppApi {
  /**
   * 获取指定应用的重定向地址
   */
  export async function getAutoLoginUrl(
    serverUrl: string,
    ssoAutoLoginUrl: string,
    appKey: string,
  ) {
    return requestClient.get<string>(`${ServicePrefix}/myApp/getAutoLoginUrl`, {
      params: {
        serverUrl,
        ssoAutoLoginUrl,
        appKey,
      },
    });
  }
}
