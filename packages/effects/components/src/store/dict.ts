import type { SysDictItemVo } from '../api/common';

import { createDictStore } from '@vben/stores';

import { findDictItemByUniqKey } from '../api/common';

// 创建基础的字典Store工厂函数
export const useDictStore = createDictStore<SysDictItemVo>(
  findDictItemByUniqKey,
);
