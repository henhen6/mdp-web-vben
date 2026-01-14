import { GlobalDictUniqKey } from '@vben/constants';

/**
 * 后端配置在 sys_dict 表中的字典
 */
export const DictUniqKey = {
  ...GlobalDictUniqKey,
  workbench: {
    loginLog: {
      status: 'LoginStatusEnum',
      authType: 'AuthTypeEnum',
      loginChannel: 'LoginChannelEnum',
      eventType: 'LoginEventTypeEnum',
    },
  },
  console: {
    dict: {
      i18n: 'DICT_I18N',
    },
    msgTask: {
      type: 'MsgTypeEnum',
      status: 'MsgTaskStatusEnum',
      msgCategory: 'MsgCategoryEnum',
      recipientScope: 'MsgRecipientScopeEnum',
    },
  },
};
