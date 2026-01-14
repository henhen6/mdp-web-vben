import type { AxiosResponse, RequestClientConfig } from '@vben/request';
import type { Recordable } from '@vben/types';

import type { FileModel } from '#/api';
import type {
  AsyncResult,
  CacheKeyFunc,
  DelayResult,
} from '#/utils/timeDelayReq';

import {
  ContentTypeEnum,
  RequestEnum,
  ServicePrefixEnum,
} from '@vben/constants';

import qs from 'qs';

import { requestClient } from '#/api/request';
import { errImg } from '#/utils/file/base64Conver';
import { TimeDelayReq } from '#/utils/timeDelayReq';

const ServicePrefix = ServicePrefixEnum.CONSOLE;

/**
 * 上传
 *
 * @description: Upload interface
 */
export function uploadFile(
  data: Record<string, any> & { file: Blob | File },
  config?: RequestClientConfig,
) {
  return requestClient.upload(
    `${ServicePrefix}/anyone/file/upload`,
    data,
    config,
  );
}

export const downloadFile = (ids: number[] | string[]) =>
  requestClient.download<AxiosResponse<Blob>>(
    `${ServicePrefix}/anyone/file/download?${qs.stringify({ ids }, { arrayFormat: 'repeat' })}`,
    {
      responseType: 'blob',
      method: RequestEnum.GET,
      responseReturn: 'raw',
    },
  );

/**
 * 根据文件id获取文件url
 *
 * @param params 文件id
 * @returns
 */
export const findUrlById = (params: number[] | string[]) => {
  return requestClient.post<string[]>(
    `${ServicePrefix}/anyone/file/findUrlById`,
    params,
  );
};

/**
 * 根据业务id和业务类型，查询附件
 *
 * @param params 附件参数
 * @returns
 */
export const listByBizId = (params: FileModel.AppendixQuery) => {
  return requestClient.post<FileModel.AppendixResultVO[]>(
    `${ServicePrefix}/anyone/appendix/listByBizId`,
    params,
    {
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED,
      },
    },
  );
};

export const listFileByBizId = (params: FileModel.AppendixQuery) => {
  return requestClient.post<FileModel.FileResultVO[]>(
    `${ServicePrefix}/anyone/appendix/listFileByBizId`,
    params,
    {
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED,
      },
    },
  );
};

function buildResult(
  paramList: Array<any>,
  cacheKey: CacheKeyFunc,
  result: string[],
) {
  const resultMap: Map<string, DelayResult> = new Map<string, DelayResult>();

  paramList.forEach((param) => {
    const key = cacheKey(param);
    const url = result[param];
    resultMap.set(key, {
      key,
      isOk: !!url,
      data: {
        code: 0,
        data: url ?? errImg,
      },
    });
  });
  return resultMap;
}

const findUrlByIdReq = new TimeDelayReq({
  cacheKey: (param: Recordable) => `${param}`,
  // 实现批量请求
  async api(paramList, cacheKey) {
    const result = await findUrlById(paramList);
    return buildResult(paramList, cacheKey, result);
  },
});

/**
 * 异步批量查询文件
 *
 * @param id 文件id
 * @returns 访问路径
 */
export async function asyncFindUrlById(id: string): Promise<AsyncResult> {
  return findUrlByIdReq.loadByParam(id);
}
