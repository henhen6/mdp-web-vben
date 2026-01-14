import type { AppType } from '#/api/open/system/app/model';

export namespace Oauth2Model {
  export interface RedirectUriDto {
    client_id: string;
    response_type: string;
    redirect_uri: string;
    state: string;
    nonce: string;
    scope: string;
  }

  export interface GetConfirmInfoDto {
    client_id: string;
    scope: string;
  }

  export interface ConfirmInfoVo {
    appVo: AppType.AppVo;
    scopes: string[];
    scopeList: any[];
    user: any;
  }

  export interface ConfirmDto {
    client_id: string;
    response_type: string;
    redirect_uri: string;
    scope: string;
    build_redirect_uri: boolean;
    state?: string;
    nonce?: string;
  }

  export interface ConfirmVo {
    redirect_uri: string;
  }
}
