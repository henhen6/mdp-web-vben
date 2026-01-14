import type { Nullable } from '@vben/types';

export type ScrollType = 'default' | 'main';

export interface CollapseContainerOptions {
  canExpand?: boolean;
  title?: string;
  helpMessage?: Array<any> | string;
}
export interface ScrollContainerOptions {
  enableScroll?: boolean;
  type?: ScrollType;
}

export type ScrollActionType = Nullable<{
  getScrollWrap: () => Nullable<HTMLElement>;
  scrollBottom: () => void;
  scrollTo: (top: number) => void;
}>;
