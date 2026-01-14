import type { CSSProperties } from 'vue';

import type { NoticeType } from '#/api/workbench/user/notice/model';

import { computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import {
  ActionEnum,
  CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT,
} from '@vben/constants';

import { NoticeApi } from '#/api/workbench/user/notice/api';

export interface Emits {
  (e: 'success'): void;
}

export interface FormState {
  type: ActionEnum;
  formData: NoticeType.NoticeVo;
}

export function useDetail() {
  const { currentRoute } = useRouter();
  const state = reactive<FormState>({
    type: ActionEnum.ADD,
    formData: {} as NoticeType.NoticeVo,
  });

  async function loadFormData({ formData, type }: FormState) {
    state.type = type;
    state.formData = { ...formData };
  }

  onMounted(async () => {
    const id = currentRoute.value.params.id as string;
    const formData = await NoticeApi.getById(id);
    const type = currentRoute.value.query.type as ActionEnum;
    loadFormData({ formData, type });
  });

  return {
    loadFormData,
    state,
  };
}

export const contentStyle = computed<CSSProperties>(() => {
  return {
    // 容器高度 - 1rem(Card的p-2)   - 54px(page title高度) - 32px(footer高度)
    height: `calc(var(${CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT}) - 1rem - 54px - 32px)`,
  };
});
