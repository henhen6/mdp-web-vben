// 缓存存储Map
const cacheStore = new Map<
  string,
  { data: any; expireTime: number; timestamp: number }
>();
// 正在进行的请求Map，用于去重
const pendingRequests = new Map<string, Promise<any>>();

// 默认缓存过期时间（5分钟）
const DEFAULT_EXPIRE_TIME = 5 * 60 * 1000;
type ParamsType = {
  [key: string]: any; // 或更具体的类型定义
};
/**
 * 生成稳定的缓存键
 * @param api API函数
 * @param params 请求参数
 * @returns 稳定的缓存键
 */
const generateCacheKey = (
  api: (arg?: any) => Promise<any>,
  params: any | undefined,
): string => {
  const url: string = api.name || api.toString().slice(0, 100);

  // 标准化参数，确保相同内容生成相同的键
  let normalizedParams: string;
  if (params && typeof params === 'object') {
    try {
      // 对对象键进行排序以确保一致性
      const sortedParams: ParamsType = {};
      Object.keys(params)
        .toSorted()
        .forEach((key) => {
          sortedParams[key] = params[key];
        });
      normalizedParams = JSON.stringify(sortedParams);
    } catch {
      normalizedParams = String(params);
    }
  } else {
    normalizedParams = String(params);
  }

  // 创建稳定的键
  return `${url}_${normalizedParams}`;
};

/**
 * 清理过期缓存
 */
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, item] of cacheStore.entries()) {
    if (now - item.timestamp > item.expireTime) {
      cacheStore.delete(key);
    }
  }
};

/**
 * 包装API函数以支持缓存
 * @param api API函数
 * @param options 缓存
 * @param options.expireTime 缓存过期时间
 * @param options.params 缓存参数
 * @returns 带缓存功能的API函数
 */
export const withCache = <
  T extends (arg?: any) => Promise<any[] | Record<string, any>>,
>(
  api?: T,
  options: {
    expireTime?: number;
    params?: any;
  } = {},
) => {
  if (api === undefined) {
    return undefined;
  }

  const { expireTime = DEFAULT_EXPIRE_TIME, params } = options;

  return async (requestParams?: any): Promise<any[] | Record<string, any>> => {
    // 合并默认参数和请求参数
    const finalParams = requestParams || params;

    // 生成缓存键
    const cacheKey = generateCacheKey(api, finalParams);

    // 定期清理过期缓存（每100次调用清理一次）
    if (Math.random() < 0.01) {
      cleanExpiredCache();
    }

    // 1. 检查是否有正在进行的相同请求
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }

    // 2. 检查是否存在有效缓存
    const cachedItem = cacheStore.get(cacheKey);
    if (
      cachedItem &&
      Date.now() - cachedItem.timestamp < cachedItem.expireTime
    ) {
      return cachedItem.data;
    }

    // 3. 没有缓存且没有正在进行的请求，创建新的请求Promise
    const requestPromise = (async () => {
      try {
        // 执行API调用
        const result = await api(finalParams);

        // 存储到缓存
        cacheStore.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          expireTime,
        });

        return result;
      } catch (error) {
        // 发生错误时清除缓存键，避免错误缓存
        cacheStore.delete(cacheKey);
        throw error;
      } finally {
        // 请求完成后，从正在进行的请求Map中删除
        pendingRequests.delete(cacheKey);
      }
    })();

    // 将请求Promise添加到正在进行的请求Map中
    pendingRequests.set(cacheKey, requestPromise);

    // 返回请求Promise
    return requestPromise;
  };
};

/**
 * 清除指定API的缓存
 * @param api API函数或URL字符串
 * @param params 请求参数
 */
export const clearCache = (api: (arg?: any) => Promise<any>, params?: any) => {
  const cacheKey = generateCacheKey(api, params);
  cacheStore.delete(cacheKey);
  pendingRequests.delete(cacheKey);
};

/**
 * 清除所有缓存
 */
export const clearAllCache = () => {
  cacheStore.clear();
  pendingRequests.clear();
};

/**
 * 获取缓存统计信息
 */
export const getCacheStats = () => {
  return {
    cacheCount: cacheStore.size,
    pendingRequestCount: pendingRequests.size,
  };
};
