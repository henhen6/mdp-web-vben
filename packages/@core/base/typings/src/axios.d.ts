interface RequestOptions {
  // 格式化请求参数时间
  formatDate?: boolean;
  // 是否返回本地响应头,需要获取响应头时使用此属性
  isReturnNativeResponse?: boolean;
  // 是否处理请求结果
  isTransformResponse?: boolean;
  // 是否添加时间戳
  joinTime?: boolean;
  withoutTenant?: boolean;
  // 是否在标头中发送令牌
  withoutToken?: boolean;
}
interface AxiosRequestConfigExt extends AxiosRequestConfig {
  requestOptions?: RequestOptions;
}

export type { AxiosRequestConfigExt, RequestOptions };
