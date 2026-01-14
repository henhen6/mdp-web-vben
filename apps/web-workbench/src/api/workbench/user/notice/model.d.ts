export namespace NoticeType {
  export interface NoticeDto {
    id: string; // ID
    taskId: string; // 消息任务
    title: string; // 标题
    content: string; // 发送内容
    msgCategory: string; // 消息分类
    author: string; // 发布人
    url: string; // 跳转地址
    createdBy: string; // 创建人ID
    createdAt: string; // 创建时间
    updatedBy: string; // 最后修改人
    updatedAt: string; // 最后修改时间
  }

  export interface NoticeVo {
    id: string; // ID
    taskId: string; // 消息任务
    title: string; // 标题
    content: string; // 发送内容
    msgCategory: string; // 消息分类
    author: string; // 发布人
    url: string; // 跳转地址
    createdBy: string; // 创建人ID
    createdAt: string; // 创建时间
    updatedBy: string; // 最后修改人
    updatedAt: string; // 最后修改时间
    read: boolean; // 是否已读
    readTime: string; // 已读时间
  }

  export interface NoticeQuery {
    id: string; // ID
    taskId: string; // 消息任务
    title: string; // 标题
    content: string; // 发送内容
    msgCategory: string; // 消息分类
    author: string; // 发布人
    url: string; // 跳转地址
    createdBy: string; // 创建人ID
    createdAt: string; // 创建时间
    updatedBy: string; // 最后修改人
    updatedAt: string; // 最后修改时间
  }
}
