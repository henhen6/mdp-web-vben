import type { UploadFile } from 'ant-design-vue';

import { i18n } from '@vben/locales';
import { isString } from '@vben/utils';

import { useDictStore } from '../../store';

export const createApiFunction = (
  type: string | undefined,
  disableInvalid: boolean | undefined,
  api?: (arg?: any) => Promise<any[] | Record<string, any>>,
) => {
  if (type === 'dict') {
    return async (params: any) => {
      const dictStore = useDictStore();
      let dictType = '';
      if (isString(params)) {
        dictType = params;
      } else if (params?.type) {
        dictType = params.type;
      }
      const list = dictStore.getDictItemOptionList(
        dictType,
        (i18n.global.locale as any).value,
        disableInvalid,
      );
      return list;
    };
  }
  return api;
};

/**
 * 处理API返回数据，根据参数过滤和扩展数据
 * @param res API返回的原始数据
 * @param params 处理参数，包含excludes、extend、extendIndex
 * @param valueField 值字段名
 * @returns 处理后的Promise数据
 */
export const handleAfterFetch = (
  res: any[],
  params?: Record<string, any>,
  valueField: string = 'value',
): Promise<any[]> => {
  return new Promise((resolve) => {
    const { excludes, extend, extendIndex } = params || {};

    // 过滤掉excludes中存在的值
    let result = res;
    if (Array.isArray(excludes) && excludes.length > 0) {
      result = res.filter((item) => {
        // 确保item有value属性，且value不在excludes数组中
        return (
          item &&
          item[valueField] !== undefined &&
          !excludes.includes(item[valueField])
        );
      });
    }

    // 根据extendIndex，将extend插入到res指定的位置
    if (extend !== undefined) {
      let insertIndex = result.length; // 默认插入到尾部

      // 如果extendIndex是数字，则根据其值确定插入位置
      if (typeof extendIndex === 'number') {
        insertIndex = Math.min(extendIndex, result.length);
      }

      // 创建一个新数组，避免直接修改原数组
      const newResult = [...result];
      newResult.splice(insertIndex, 0, extend);
      result = newResult;
    }

    resolve(result);
  });
};

/**
 * 默认支持上传的图片文件类型
 */
export const defaultImageAcceptExts = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
];

/**
 * 默认支持上传的文件类型
 */
export const defaultFileAcceptExts = ['.xlsx', '.csv', '.docx', '.pdf'];

/**
 * 文件(非图片)的默认预览逻辑
 * 默认: window.open打开 交给浏览器接管
 * @param file file
 */
export function defaultFilePreview(file: UploadFile) {
  if (file?.url) {
    window.open(file.url);
  }
}
