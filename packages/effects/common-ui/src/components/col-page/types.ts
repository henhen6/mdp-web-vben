import type { PageProps } from '../page/types';

export interface ColPageProps extends PageProps {
  /**
   * 左侧宽度
   * @default 30
   */
  leftWidth?: number;
  /*  左侧最小宽度百分比 */
  leftMinWidth?: number;
  /*  左侧最大宽度百分比 */
  leftMaxWidth?: number;
  /* 左侧折叠后宽度 */
  leftCollapsedWidth?: number;
  /* 左侧是否可折叠 */
  leftCollapsible?: boolean;
  /**
   * 右侧宽度
   * @default 70
   */
  rightWidth?: number;
  /* 右侧最小宽度百分比 */
  rightMinWidth?: number;
  /* 右侧折叠后宽度 */
  rightCollapsedWidth?: number;
  /* 右侧最大宽度百分比*/
  rightMaxWidth?: number;
  /*  右侧是否可折叠*/
  rightCollapsible?: boolean;
  /* 可拖动调整宽度 */
  resizable?: boolean;
  /* 显示拖动分隔线 */
  splitLine?: boolean;
  /* 显示拖动手柄 */
  splitHandle?: boolean;
}
