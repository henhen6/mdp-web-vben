import type { RouteMeta, RouteRecordRaw } from 'vue-router';

import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteRecordStringComponent,
} from '@vben-core/typings';

import { cloneDeep, mapTree } from '@vben-core/shared/utils';

/**
 * 动态生成路由 - 后端方式
 */
async function generateRoutesByBackend(
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteRecordRaw[]> {
  const { fetchMenuListAsync, layoutMap = {}, pageMap = {} } = options;

  try {
    const menuRoutes = await fetchMenuListAsync?.();
    if (!menuRoutes) {
      return [];
    }

    const normalizePageMap: ComponentRecordType = {};

    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value;
    }

    const routes = convertRoutes(menuRoutes, layoutMap, normalizePageMap);

    return routes;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function convertRoutes(
  routes: RouteRecordStringComponent[],
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
): RouteRecordRaw[] {
  const routeList = routes.map((route) => {
    const { component, name } = route;
    let newRoute = {} as RouteRecordRaw;

    if (!name) {
      console.error(
        '路由的name属性为空，请在菜单管理中正确配置name字段',
        route,
      );
    }

    if (component) {
      newRoute = cloneDeep(route) as unknown as RouteRecordRaw;
      // 处理1级菜单是目录的情况
      if (component.toUpperCase() === 'LAYOUT') {
        newRoute.component = layoutMap[component.toUpperCase()];
      } else {
        // 处理1级菜单是菜单的情况（1级菜单就是菜单时，需要新增一个隐藏的子级）
        const childrenPath = route.path;
        const children = cloneDeep(route) as unknown as RouteRecordRaw;
        children.path = `${childrenPath}/child`;
        // if (children.openWith === '30') {
        //   children.component = 'IFrameView';
        // }

        newRoute.children = [children];
        newRoute.component = layoutMap.LAYOUT;
        newRoute.name = `${String(route.name)}Parent`;
        newRoute.path = childrenPath;
        newRoute.redirect = children.path;
        const meta = (route.meta || {}) as RouteMeta;
        meta.single = true;
        meta.affix = false;
        meta.hideChildrenInMenu = true;
        newRoute.meta = meta;
      }
    } else {
      console.warn(`请正确配置路由：${String(route?.name)}的component属性`);
    }
    newRoute.children &&
      asyncImportRoute(
        newRoute.children as unknown as RouteRecordStringComponent[],
        layoutMap,
        pageMap,
      );
    return newRoute;
  });
  return routeList;
}

function asyncImportRoute(
  routes: RouteRecordStringComponent[],
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
) {
  return mapTree(routes, (node) => {
    const route = node as unknown as RouteRecordRaw;
    const { component, name } = node;

    if (!name) {
      console.error('route name is required', route);
    }

    if (route.meta?.iframeSrc || route.meta?.link) {
      route.component = layoutMap.IFRAME;
    } else {
      // layout转换
      // if (component && layoutMap[component]) {
      //   route.component = layoutMap[component];
      //   // 页面组件转换
      // } else
      if (component) {
        const normalizePath = normalizeViewPath(component);
        const pageKey = normalizePath.endsWith('.vue')
          ? normalizePath
          : `${normalizePath}.vue`;
        route.component = pageMap[pageKey];
      }
    }

    return route;
  });
}

function normalizeViewPath(path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;

  // 这里耦合了vben-admin的目录结构
  return viewPath.replace(/^\/views/, '');
}
export { generateRoutesByBackend };
