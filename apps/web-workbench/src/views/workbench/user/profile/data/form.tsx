import type { VbenFormSchema } from '@vben/components/adapter';

import type { UserType } from '#/api/console/organization/user/model';

import { computed, onMounted, reactive } from 'vue';

import { useVbenForm } from '@vben/components/adapter';
import { useMessage } from '@vben/components/hooks';
import { useUserStore } from '@vben/stores';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

import { OrgApi } from '#/api/console/organization/org/api';
import { PositionApi } from '#/api/console/organization/position/api';
import { UserApi } from '#/api/console/organization/user/api';
import { DictUniqKey } from '#/enums/dict';
import { FileObjectType } from '#/enums/file';
import { $t } from '#/locales';
import { useAuthStore } from '#/store';

export interface FormState {
  loading: boolean;
  btnLoading: boolean;
}
export function useSchema(_state: FormState): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      label: $t('console.organization.user.id'),
      dependencies: {
        show: false,
        triggerFields: ['username'],
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('console.organization.user.name'),
    },
    // 这里必须隐藏一个 avatarObjectId 属性，否则下面无法取值
    {
      component: 'Input',
      fieldName: 'avatarObjectId',
      label: $t('console.organization.user.avatar'),
      dependencies: {
        show: false,
        triggerFields: ['avatar'],
      },
    },
    {
      component: 'ImageUpload',
      fieldName: 'avatar',
      label: $t('console.organization.user.avatar'),
      componentProps: (values: Partial<UserType.UserVo>) => {
        return {
          objectId: values.avatarObjectId, // 必须在schema中隐藏一个avatarObjectId属性，否则这里无法取值
          objectType: FileObjectType.console.user.avatar,
        };
      },
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('console.organization.user.username'),
      componentProps: {
        autocomplete: 'off',
      },
      disabled: true,
    },
    {
      component: 'ApiDict',
      fieldName: 'sex',
      label: $t('console.organization.user.sex'),
      componentProps: {
        type: DictUniqKey.common.sex,
        renderType: 'RadioGroup',
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'positionId',
      label: $t('console.organization.user.positionId'),
      componentProps: {
        allowClear: true,
        api: PositionApi.list,
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'lastTopCompanyId',
      label: $t('console.organization.user.lastTopCompanyId'),
      hide: true,
      componentProps: {
        api: OrgApi.list,
        labelField: 'name',
        valueField: 'id',
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'lastCompanyId',
      label: $t('console.organization.user.lastCompanyId'),
      hide: true,
      componentProps: {
        api: OrgApi.list,
        labelField: 'name',
        valueField: 'id',
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'lastDeptId',
      label: $t('console.organization.user.lastDeptId'),
      hide: true,
      componentProps: {
        api: OrgApi.list,
        labelField: 'name',
        valueField: 'id',
      },
    },
    {
      component: 'Input',
      fieldName: 'pwErrorLastTime',
      hide: true,
      label: $t('console.organization.user.pwErrorLastTime'),
    },
    {
      component: 'InputNumber',
      fieldName: 'pwErrorNum',
      hide: true,
      label: $t('console.organization.user.pwErrorNum'),
    },
    {
      component: 'Input',
      fieldName: 'pwExpireTime',
      hide: true,
      label: $t('console.organization.user.pwExpireTime'),
    },
    {
      component: 'Input',
      fieldName: 'lastLoginTime',
      hide: true,
      label: $t('console.organization.user.lastLoginTime'),
    },
  ];
}
export function useForm() {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const { createMessage } = useMessage();
  const state = reactive<FormState>({
    loading: false,
    btnLoading: false,
  });
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isHorizontal = computed(() => breakpoints.greaterOrEqual('md').value);
  const [Form, formApi] = useVbenForm({
    schema: useSchema(state),
    showDefaultActions: false,
    commonConfig: {
      colon: true,
    },
  });

  onMounted(async () => {
    try {
      state.loading = true;
      const user = await UserApi.getById(userStore.userInfo?.id as string);

      user.avatarObjectId = user.avatar;
      user.avatar = undefined;

      formApi.setValues({
        ...user,
      });
    } finally {
      state.loading = false;
    }
  });

  function handleReset() {
    formApi.resetForm();
  }

  async function handleSubmit() {
    try {
      if (state.btnLoading) {
        return;
      }

      state.btnLoading = true;

      const { valid } = await formApi.validate();
      if (!valid) {
        return;
      }
      const data =
        await formApi.getValues<Omit<UserType.UserDto, 'children' | 'id'>>();

      await UserApi.updateProfile(data);

      await authStore.fetchUserInfo();
      createMessage.success('更新成功');
    } finally {
      state.btnLoading = false;
    }
  }

  return {
    Form,
    isHorizontal,
    state,
    handleReset,
    handleSubmit,
  };
}
