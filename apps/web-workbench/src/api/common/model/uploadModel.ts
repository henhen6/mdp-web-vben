export namespace FileModel {
  export interface AppendixSaveVO {
    id?: string;
    bizId: string;
    bizType: string;
  }

  export interface FileResultVO extends AppendixSaveVO {
    id?: string;
    bizType: string;
    fileType: string;
    bucket: string;
    path: string;
    url: string;
    uniqueFileName?: string;
    fileMd5?: string;
    originalFileName: string;
    contentType: string;
    suffix: string;
    size: string;
    storageType?: string;
  }

  export interface AppendixResultVO {
    id: string;
    bizId: string;
    bizType: string;
  }

  export interface AppendixQuery {
    bizId: string;
    bizType?: string;
  }

  export interface FileUploadVO {
    // 业务类型
    bizType: string;
    // 桶
    bucket?: string;
    // 存储类型 参考：FileStorageType
    storageType?: string;
  }
}
