import type {
  WorkbenchQuickNavItem,
  WorkbenchTrendItem,
} from '@vben/common-ui';

// 同样，这里的 url 也可以使用以 http 开头的外部链接
export const quickNavItems: WorkbenchQuickNavItem[] = [
  {
    title: '官网',
    icon: 'ion:settings-outline',
    color: '#3fb27f',
    url: 'https://mddata.top',
  },
  {
    title: '文档',
    icon: 'ion:key-outline',
    color: '#4daf1bc9',
    url: 'https://mddata.top',
  },
  {
    title: 'vben文档',
    icon: 'ion:bar-chart-outline',
    color: '#00d8ff',
    url: 'https://doc.vben.pro/',
  },
];

export const trendItems: WorkbenchTrendItem[] = [
  {
    percent: 10,
    name: '1.0.0 即将发布',
    date: '2025年8月09日',
    desc: `统一身份认证系统 + 开放平台`,
  },
];
