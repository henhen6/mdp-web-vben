export interface Result<T> {
  code: number;
  data: T;
  path: string;
  msg: string;
  errorMsg: string;
  timestamp: string;
  extra: Record<string, string>;
}

export interface PageParams<T> {
  model: T;
  size: number;
  current: number;
  sort?: string;
  order?: string;
  extra?: any;
}

export interface PageResult<T> {
  // 当前页数据
  records: T[];
  // 当前页码
  pageNumber: number;
  // 每页数据数量
  pageSize: number;
  // 每页数据数量最大限制。
  maxPageSize: number;
  // 总页数。
  totalPage: number;
  // 总数据数量。
  totalRow: number;
}

export interface Kv {
  key: string;
  value: string;
}

export interface AudioDto {
  id: string;
  auditStatus: number;
  reviewComments?: string;
}
export interface IdDto {
  id: string;
}

export interface StatusUpdateDto {
  id: string;
  status: number;
}
