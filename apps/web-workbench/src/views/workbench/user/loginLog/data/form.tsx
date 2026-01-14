import type { ExtendedModalApi } from '@vben/common-ui';
import type { VbenFormSchema } from '@vben/components/adapter';

import type { LoginLogType } from '#/api/workbench/user/loginLog/model';

import { reactive } from 'vue';

import { useVbenForm } from '@vben/components/adapter';
import { ActionEnum } from '@vben/constants';

import { $t } from '#/locales';

export interface Emits {
  (e: 'success'): void;
}

export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      label: $t('workbench.user.loginLog.id'),
    },
    {
      component: 'Input',
      fieldName: 'userId',
      label: $t('workbench.user.loginLog.userId'),
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('workbench.user.loginLog.name'),
    },
    {
      component: 'Input',
      fieldName: 'account',
      label: $t('workbench.user.loginLog.account'),
    },
    {
      component: 'Input',
      fieldName: 'eventType',
      label: $t('workbench.user.loginLog.eventType'),
    },
    {
      component: 'Input',
      fieldName: 'status',
      label: $t('workbench.user.loginLog.status'),
    },
    {
      component: 'Input',
      fieldName: 'statusReason',
      label: $t('workbench.user.loginLog.statusReason'),
    },
    {
      component: 'Input',
      fieldName: 'authType',
      label: $t('workbench.user.loginLog.authType'),
    },
    {
      component: 'Input',
      fieldName: 'loginChannel',
      label: $t('workbench.user.loginLog.loginChannel'),
    },
    {
      component: 'Input',
      fieldName: 'loginDate',
      label: $t('workbench.user.loginLog.loginDate'),
    },
    {
      component: 'Input',
      fieldName: 'loginIp',
      label: $t('workbench.user.loginLog.loginIp'),
    },
    {
      component: 'Input',
      fieldName: 'ipLocation',
      label: $t('workbench.user.loginLog.ipLocation'),
    },
    {
      component: 'Input',
      fieldName: 'ua',
      label: $t('workbench.user.loginLog.ua'),
    },
    {
      component: 'Input',
      fieldName: 'browserName',
      label: $t('workbench.user.loginLog.browserName'),
    },
    {
      component: 'Input',
      fieldName: 'browserVersion',
      label: $t('workbench.user.loginLog.browserVersion'),
    },
    {
      component: 'Input',
      fieldName: 'os',
      label: $t('workbench.user.loginLog.os'),
    },
    {
      component: 'Input',
      fieldName: 'deviceInfo',
      label: $t('workbench.user.loginLog.deviceInfo'),
    },
    {
      component: 'Input',
      fieldName: 'appKey',
      label: $t('workbench.user.loginLog.appKey'),
    },
    {
      component: 'Input',
      fieldName: 'appName',
      label: $t('workbench.user.loginLog.appName'),
    },
    {
      component: 'Input',
      fieldName: 'appRedirect',
      label: $t('workbench.user.loginLog.appRedirect'),
    },
    {
      component: 'Input',
      fieldName: 'tokenInfo',
      label: $t('workbench.user.loginLog.tokenInfo'),
    },
    {
      component: 'Input',
      fieldName: 'createdAt',
      label: $t('workbench.user.loginLog.createdAt'),
    },
    {
      component: 'Input',
      fieldName: 'createdBy',
      label: $t('workbench.user.loginLog.createdBy'),
    },
  ];
}

export interface FormState {
  type: ActionEnum;
  formData: Partial<LoginLogType.LoginLogVo>;
}

export function useForm(emit: Emits) {
  const state = reactive<FormState>({
    type: ActionEnum.ADD,
    formData: {},
  });

  const [EditForm, formApi] = useVbenForm({
    schema: useSchema(),
    showDefaultActions: false,
  });

  async function loadFormData({ formData, type }: FormState) {
    state.type = type;
    state.formData = { ...formData };

    await formApi.setValues(state.formData);
  }

  async function handleSubmit(wrapperApi: ExtendedModalApi) {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    wrapperApi.lock();
    try {
      wrapperApi.close();
      emit('success');
    } finally {
      wrapperApi.unlock();
    }
  }
  return {
    EditForm,
    loadFormData,
    handleSubmit,
  };
}
