import type { Oauth2Model } from './model/oauth2';

import { ContentTypeEnum, ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const ServicePrefix = ServicePrefixEnum.WORKBENCH;
export namespace Oauth2Api {
  /**
   * 获取授权重定向地址
   * @param data 参数
   * @returns
   */
  export async function getRedirectUri(data: Oauth2Model.RedirectUriDto) {
    return requestClient.post<string>(
      `${ServicePrefix}/oauth2/getRedirectUri`,
      data,
      {
        headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        responseReturn: 'raw',
      },
    );
  }

  /**
   * 查询在授权页需要显示的信息
   * @param data 参数
   * @returns
   */
  export async function getConfirmInfo(data: Oauth2Model.GetConfirmInfoDto) {
    return requestClient.post<Oauth2Model.ConfirmInfoVo>(
      `${ServicePrefix}/oauth2/getConfirmInfo`,
      data,
      {
        headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      },
    );
  }

  /**
   * 确认授权
   * @param data 参数
   * @returns
   */
  export async function confirm(data: Oauth2Model.ConfirmDto) {
    return requestClient.post<Oauth2Model.ConfirmVo>(
      `${ServicePrefix}/oauth2/confirm`,
      data,
      {
        headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      },
    );
  }
}
