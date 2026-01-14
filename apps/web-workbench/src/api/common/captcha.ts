import type { CaptchaModel } from './model/captcha';

import { ServicePrefixEnum } from '@vben/constants';

import { requestClient } from '#/api/request';

const ServicePrefix = ServicePrefixEnum.WORKBENCH;
const MODULAR = `${ServicePrefix}/anyUser/captcha`;
export namespace CaptchaApi {
  /** @desc 获取行为验证码 */
  export function getBehaviorCaptcha(req: any) {
    return requestClient.get<CaptchaModel.BehaviorCaptchaResp>(
      `${MODULAR}/get/behavior`,
      req,
    );
  }

  /** @desc 校验行为验证码 */
  export function checkBehaviorCaptcha(req: any) {
    return requestClient.post<CaptchaModel.CheckBehaviorCaptchaResp>(
      `${MODULAR}/check/behavior`,
      req,
    );
  }

  /**
   * 图片验证码
   * @returns resp
   */
  export function getCaptchaImg() {
    return requestClient.get<CaptchaModel.CaptchaVo>(
      `${ServicePrefix}/anyUser/captcha/get/img`,
    );
  }

  /**
   * 发送短信验证码
   */
  export async function sendPhoneCode(
    phone: string,
    templateCode: string,
    captchaReq: CaptchaModel.BehaviorCaptchaReq,
  ) {
    return requestClient.get(
      `${MODULAR}/send/phone?captchaVerification=${encodeURIComponent(captchaReq?.captchaVerification || '')}`,
      {
        params: {
          phone,
          templateCode,
        },
      },
    );
  }

  /**
   * 发送邮件验证码
   */
  export async function sendEmailCode(
    email: string,
    templateCode: string,
    captchaReq?: CaptchaModel.BehaviorCaptchaReq,
  ) {
    return requestClient.get(
      `${MODULAR}/send/email?captchaVerification=${encodeURIComponent(captchaReq?.captchaVerification || '')}`,
      {
        params: {
          email,
          templateCode,
        },
      },
    );
  }
}
