import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type ExtendOptions<T = any> = {
  /**
   * 参数序列化方式。预置的有
   * - brackets: ids[]=1&ids[]=2&ids[]=3
   * - comma: ids=1,2,3
   * - indices: ids[0]=1&ids[1]=2&ids[2]=3
   * - repeat: ids=1&ids=2&ids=3
   */
  paramsSerializer?:
    | 'brackets'
    | 'comma'
    | 'indices'
    | 'repeat'
    | AxiosRequestConfig<T>['paramsSerializer'];
  /**
   * 响应数据的返回方式。
   * - raw: 原始的AxiosResponse，包括headers、status等，不做是否成功请求的检查。
   * - body: 返回响应数据的BODY部分（只会根据status检查请求是否成功，忽略对code的判断，这种情况下应由调用方检查请求是否成功）。
   * - data: 解构响应的BODY数据，只返回其中的data节点数据（会检查status和code是否为成功状态）。
   */
  responseReturn?: 'body' | 'data' | 'raw';
};
type RequestClientConfig<T = any> = AxiosRequestConfig<T> & ExtendOptions<T>;

type RequestResponse<T = any> = AxiosResponse<T> & {
  config: RequestClientConfig<T>;
};

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults & ExtendOptions;

/**
 * SSE 请求选项
 */
interface SseRequestOptions extends RequestInit {
  onMessage?: (message: string) => void;
  onEnd?: () => void;
}

interface RequestInterceptorConfig {
  fulfilled?: (
    config: ExtendOptions & InternalAxiosRequestConfig,
  ) =>
    | (ExtendOptions & InternalAxiosRequestConfig<any>)
    | Promise<ExtendOptions & InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (
    response: RequestResponse<T>,
  ) => Promise<RequestResponse> | RequestResponse;
  rejected?: (error: any) => any;
}

type MakeErrorMessageFn = (message: string, error: any) => void;

interface HttpResponse<T = any> {
  /**
   * 0 表示成功 其他表示失败
   * 0 means success, others means fail
   */
  code: number;
  data: T;
  message: string;
}
enum ResultCodeEnum {
  // 未能读取到有效Token
  CODE_11011 = 11_011,
  // token 无效: token 没有绑定用户id
  CODE_11012 = 11_012,
  // token 已过期
  CODE_11013 = 11_013,
  // token 已被顶下线
  CODE_11014 = 11_014,
  // token 已被踢下线
  CODE_11015 = 11_015,
  // 已被冻结
  CODE_11016 = 11_016,
  // 获取 Token-Session 时提供的 token 为空
  CODE_11073 = 11_073,
  // 获取 Token-Session 时提供的 token 为无效 token
  CODE_11074 = 11_074,
  // 访问成功
  SUCCESS = 0,
}

export type {
  HttpResponse,
  MakeErrorMessageFn,
  RequestClientConfig,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
  SseRequestOptions,
};

export { ResultCodeEnum };
