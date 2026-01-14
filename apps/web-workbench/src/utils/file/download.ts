import type { AxiosResponse } from '@vben/request';
import type { TargetContext } from '@vben/types';

import { useMessage } from '@vben/components/hooks';

import { openWindow } from '..';
import { dataURLtoBlob, urlToBase64 } from './base64Conver';

const { createMessage } = useMessage();

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(
  url: string,
  filename: string,
  mime?: string,
  bom?: BlobPart,
) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom);
  });
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(
  buf: string,
  filename: string,
  mime?: string,
  bom?: BlobPart,
) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(
  data: BlobPart,
  filename: string,
  mime?: string,
  bom?: BlobPart,
) {
  const blobData = bom === undefined ? [data] : [bom, data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (tempLink.download === undefined) {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.append(tempLink);
  tempLink.click();
  tempLink.remove();
  window.URL.revokeObjectURL(blobURL);
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  fileName?: string;
  target?: TargetContext;
  url: string;
}): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome');
  const isSafari = window.navigator.userAgent.toLowerCase().includes('safari');

  if (/iP/.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!');
    return false;
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a');
    link.href = url;
    link.target = target;

    if (link.download !== undefined) {
      link.download = fileName || url.slice(url.lastIndexOf('/') + 1);
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (!url.includes('?')) {
    url += '?download';
  }

  openWindow(url, { target });
  return true;
}

/**
 * 下载方法
 * @param response
 */
export const downloadByResponse = (response: AxiosResponse<Blob>) => {
  const res = response.data;
  const type = res.type;
  if (type.includes('application/json')) {
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      if (e.target?.readyState === 2) {
        const data = JSON.parse(e.target?.result as string);
        createMessage.warning(data.msg);
      }
    });
    // eslint-disable-next-line unicorn/prefer-blob-reading-methods
    reader.readAsText(res);
  } else {
    const disposition = response?.headers?.['content-disposition'];
    let fileName = '下载文件.zip';
    if (disposition) {
      const respcds = disposition.split(';');
      for (const header of respcds) {
        if (header !== null && header !== '') {
          const headerValue = header.split('=');
          if (
            headerValue !== null &&
            headerValue.length > 0 &&
            headerValue[0].trim().toLowerCase() === 'filename'
          ) {
            fileName = decodeURI(headerValue[1]);
            break;
          }
        }
      }
    }
    // 处理引号
    if (
      (fileName.startsWith("'") || fileName.startsWith('"')) &&
      (fileName.endsWith("'") || fileName.endsWith('"'))
    ) {
      fileName = fileName.slice(1, -1);
    }

    const blob = new Blob([res]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
};

export const blobToObj = (data: any) => {
  return new Promise((resolve) => {
    if (data?.type === 'application/json') {
      const reader = new FileReader();
      reader.readAsText(data, 'utf8');
      reader.addEventListener('load', (e) => {
        try {
          const parseObj = JSON.parse(e.target?.result as string);
          resolve(parseObj);
        } catch {
          resolve({
            code: -1,
            msg: '获取失败',
          });
        }
      });
    }
  });
};

// 格式化文件大小 单位：B、KB、MB、GB
export const formatFileSize = (value: string) => {
  if (value === null || value === '') {
    return '0 M';
  }
  const unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const srcSize = Number.parseFloat(value);
  const index = Math.floor(Math.log(srcSize) / Math.log(1024));
  const size = srcSize / 1024 ** index;
  if (unitArr[index]) {
    return size.toFixed(2) + unitArr[index];
  }
  return '文件太大';
};
