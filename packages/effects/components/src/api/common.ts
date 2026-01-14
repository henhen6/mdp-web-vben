import type { AxiosRequestConfig } from '@vben/request';

import { ContentTypeEnum, ServicePrefixEnum } from '@vben/constants';

import { internalRequestClient } from './request';

/**
 * Axios上传进度事件
 */
export type AxiosProgressEvent = AxiosRequestConfig['onUploadProgress'];

export interface SysDictItemVo {
  id: string;
  dictId: string;
  parentId: string;
  uniqKey: string;
  name: string;
  treePath: string;
  state: boolean;
  remark: string;
  weight: number;
  icon: string;
  cssStyle: string;
  cssClass: string;
  propType: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  i18nJson: string;
  dataType: string;
  dictType: string;

  exist: boolean;
  itemType?: string;
}

/**
 * 文件记录 VO类（通常用作Controller出参）
 */
export interface SysFileVo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务id
   */
  objectId?: string;

  /**
   * 对象类型
   */
  objectType?: string;

  /**
   * 文件类型
   */
  fileType?: number;

  /**
   * 文件访问地址
   */
  url?: string;

  /**
   * 文件大小，单位字节
   */
  fileSize?: number;

  /**
   * 文件名称
   */
  filename?: string;

  /**
   * 原始文件名
   */
  originalFilename?: string;

  /**
   * 桶
   */
  bucket?: string;

  /**
   * 基础存储路径
   */
  basePath?: string;

  /**
   * 存储路径
   */
  path?: string;

  /**
   * 文件扩展名
   */
  ext?: string;

  /**
   * MIME类型
   */
  contentType?: string;

  /**
   * 存储平台
   */
  platform?: string;

  /**
   * 缩略图访问路径
   */
  thUrl?: string;

  /**
   * 缩略图名称
   */
  thFilename?: string;

  /**
   * 缩略图大小，单位字节
   */
  thSize?: number;

  /**
   * 缩略图MIME类型
   */
  thContentType?: string;

  /**
   * 文件元数据
   */
  metadata?: string;

  /**
   * 文件用户元数据
   */
  userMetadata?: string;

  /**
   * 缩略图元数据
   */
  thMetadata?: string;

  /**
   * 缩略图用户元数据
   */
  thUserMetadata?: string;

  /**
   * 附加属性
   */
  attr?: string;

  /**
   * 文件ACL
   */
  fileAcl?: string;

  /**
   * 缩略图文件ACL
   */
  thFileAcl?: string;

  /**
   * 哈希信息
   */
  hashInfo?: string;

  /**
   * 上传ID，仅在手动分片上传时使用
   */
  uploadId?: string;

  /**
   * 上传状态，仅在手动分片上传时使用
   * 1：初始化完成，2：上传完成
   */
  uploadStatus?: 1 | 2;

  /**
   * 创建时间
   */
  createdAt?: string; // LocalDateTime在前端通常以ISO字符串形式存在

  /**
   * 创建人
   */
  createdBy?: number;

  /**
   * 最后修改时间
   */
  updatedAt?: string;

  /**
   * 最后修改人
   */
  updatedBy?: number;
}

const ServicePrefix = ServicePrefixEnum.CONSOLE;

/** 根据字典类型编码批量查询字典项 */
export const findDictItemByUniqKey = (params: string[] = []) => {
  return internalRequestClient.post<Record<string, SysDictItemVo[]>>(
    `${ServicePrefix}/anyUser/dict/findDictItemByUniqKey`,
    params,
  );
};

/**
 * 通过单文件上传接口
 * @param file 上传的文件
 * @param options 一些配置项
 * @param options.onUploadProgress 上传进度事件
 * @param options.signal 上传取消信号
 * @param options.otherData 其他请求参数 后端拓展可能会用到
 * @returns 上传结果
 */
export function uploadApi(
  file: Blob | File,
  options?: {
    onUploadProgress?: AxiosProgressEvent;
    otherData?: Record<string, any>;
    signal?: AbortSignal;
  },
) {
  const { onUploadProgress, signal, otherData = {} } = options ?? {};
  return internalRequestClient.upload<SysFileVo>(
    `${ServicePrefix}/anyone/file/upload`,
    { file, ...otherData },
    { onUploadProgress, signal, timeout: 60_000 },
  );
}

export function findUrlByIds(ids: string[]) {
  return internalRequestClient.post<Record<string, SysFileVo>>(
    `${ServicePrefix}/anyone/file/findUrlByIds`,
    ids,
  );
}
/**
 * 根据业务类型和业务id，获取文件的访问路径
 * @param objectType 业务类型
 * @param objectId 业务id
 * @returns 文件的访问路径
 */
export function findUrlByObject(objectType: string, objectId: string) {
  return internalRequestClient.post<Record<string, SysFileVo>>(
    `${ServicePrefix}/anyone/file/findUrlByObject`,
    { objectType, objectId },
    { headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED } },
  );
}

/**
 * 上传api type
 */
export type UploadApi = typeof uploadApi;
