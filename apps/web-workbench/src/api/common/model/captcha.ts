export namespace CaptchaModel {
  /* 行为验证码类型 */
  export interface BehaviorCaptchaResp {
    originalImageBase64: string;
    point: {
      x: number;
      y: number;
    };
    jigsawImageBase64: string;
    token: string;
    secretKey: string;
    wordList: string[];
  }

  export interface BehaviorCaptchaReq {
    captchaType?: string;
    captchaVerification?: string;
    clientUid?: string;
  }

  export interface CheckBehaviorCaptchaResp {
    repCode: string;
    repMsg: string;
  }

  export interface CaptchaVo {
    enabled: boolean; // 是否启用验证码
    img: string; // 验证码图片
    key: string; // 验证码key
    expireTime: string; // 过期时间
  }
}
