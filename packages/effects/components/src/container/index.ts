import { withInstall } from '../utils';
import collapseContainer from './src/collapse/collapse-container.vue';
import lazyContainer from './src/lazy-container.vue';
import scrollContainer from './src/scroll-container.vue';

// 折叠组件
export const CollapseContainer = withInstall(collapseContainer);

// 滚动组件
export const ScrollContainer = withInstall(scrollContainer);

// 懒加载组件
export const LazyContainer = withInstall(lazyContainer);

export * from './src/typing';
