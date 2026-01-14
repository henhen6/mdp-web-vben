import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { UserApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');
  const accessStore = useAccessStore();
  const layoutMap: ComponentRecordType = {
    LAYOUT: BasicLayout,
    IFRAME: IFrameView,
  };

  // 跟Vben官方的实现逻辑略有不同，这里固定采用 后端路由 + 前端路由方式
  return await generateAccessible({
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1.5,
      });

      const menuList = await UserApi.findUserRouter(
        import.meta.env.VITE_GLOB_APP_ID,
      );
      accessStore.setRouterList(menuList);
      return menuList;
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
