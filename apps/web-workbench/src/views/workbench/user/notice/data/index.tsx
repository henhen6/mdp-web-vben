import type { VbenFormSchema } from '@vben/common-ui';
import type {
  OnActionClickFn,
  OnActionClickParams,
  VxeTableGridOptions,
} from '@vben/components/adapter';
import type { ActionItem } from '@vben/components/table-action';

import type { PageParams } from '#/api';
import type { NoticeType } from '#/api/workbench/user/notice/model';

import { useRouter } from 'vue-router';

import { useVbenVxeGrid } from '@vben/components/adapter';
import { useMessage } from '@vben/components/hooks';

import { NoticeApi } from '#/api/workbench/user/notice/api';
import { DictUniqKey } from '#/enums/dict';
import { MENU_NAME } from '#/enums/menu';
import { notice as permCode } from '#/enums/perm/workbench/user/notice';
import { $t } from '#/locales';

/**
 * 操作列类型枚举
 */
enum ActionType {
  DELETE = 'delete',
  MARK = 'mark',
  VIEW = 'view',
}

/**
 * 表格搜索表单 schema
 * @returns VbenFormSchema[]
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiDict',
      fieldName: 'msgCategory',
      label: $t('workbench.user.notice.msgCategory'),
      componentProps: {
        type: DictUniqKey.console.msgTask.msgCategory,
        renderType: 'Select',
      },
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('workbench.user.notice.title'),
    },
    {
      component: 'Input',
      fieldName: 'content',
      label: $t('workbench.user.notice.content'),
    },

    {
      component: 'Input',
      fieldName: 'author',
      label: $t('workbench.user.notice.author'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createdAt',
      label: $t('workbench.user.notice.createdAt'),
    },
  ];
}

/**
 * 表格列配置
 * @param onActionClick 操作栏按钮点击事件
 * @returns VxeTableGridOptions<NoticeType.NoticeVo>['columns']
 */
export function useColumns(
  onActionClick: OnActionClickFn<NoticeType.NoticeVo>,
): VxeTableGridOptions<NoticeType.NoticeVo>['columns'] {
  return [
    { type: 'checkbox', width: 50 },
    { title: $t('common.title.seq'), type: 'seq', width: 50 },
    {
      field: 'title',
      title: $t('workbench.user.notice.title'),
    },
    {
      field: 'msgCategory',
      title: $t('workbench.user.notice.msgCategory'),
      cellRender: {
        name: 'CellDict',
        attrs: {
          type: DictUniqKey.console.msgTask.msgCategory,
          mode: 'tag',
        },
      },
      width: 100,
    },
    {
      field: 'author',
      title: $t('workbench.user.notice.author'),
      width: 100,
    },
    {
      field: 'read',
      title: $t('workbench.user.notice.read'),
      width: 80,
      cellRender: {
        name: 'CellDict',
        attrs: {
          type: DictUniqKey.common.boolean,
          mode: 'tag',
        },
      },
    },
    {
      field: 'readTime',
      title: $t('workbench.user.notice.readTime'),
      width: 180,
    },
    {
      field: 'createdAt',
      title: $t('workbench.user.notice.createdAt'),
      width: 180,
    },
    {
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('workbench.user.notice.title2.table'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          { code: ActionType.VIEW, auth: permCode.view },
          {
            code: ActionType.MARK,
            auth: permCode.mark,
            text: $t('ui.actionTitle.mark'),
          },
          { code: ActionType.DELETE, auth: permCode.delete },
        ],
      },
      field: 'operation',
      showOverflow: false,
      title: $t('ui.actionTitle.operation'),
      width: 180,
    },
  ];
}

export function useIndex() {
  const { createConfirm, createMessage } = useMessage();
  const { push } = useRouter();
  // 操作栏按钮点击事件
  function onActionClick({
    code,
    row,
  }: OnActionClickParams<NoticeType.NoticeVo>) {
    const actionHandlers: Record<string, (row: NoticeType.NoticeVo) => void> = {
      [ActionType.DELETE]: handleDelete,
      [ActionType.MARK]: handleMark,
      [ActionType.VIEW]: handleView,
    };

    const handler = actionHandlers[code];
    if (handler) {
      handler(row);
    } else {
      throw new Error(`未知的操作类型: ${code}`);
    }
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      fieldMappingTime: [['createdAt', ['createdAt_st', 'createdAt_ed']]],
      schema: useGridFormSchema(),
      submitOnChange: true,
      collapsed: true,
      commonConfig: {
        labelWidth: 80,
      },
    },
    gridOptions: {
      columns: useColumns(onActionClick),
      height: 'auto',
      keepSource: true,
      proxyConfig: {
        ajax: {
          query: async (params, formValues) => {
            const { page, sorts, filters } = params;
            const model = { ...formValues };
            // 处理筛选条件
            filters.forEach(({ field, values }) => {
              model[field] = values.join(',');
            });

            // 组装分页请求参数
            const queryParams: PageParams<Partial<NoticeType.NoticeQuery>> = {
              model,
              size: page.pageSize,
              current: page.currentPage,
            };

            // 处理排序条件
            const firstSort = sorts[0];
            if (firstSort) {
              queryParams.sort = firstSort.field;
              queryParams.order = firstSort.order;
            } else {
              queryParams.sort = 'createdAt';
              queryParams.order = 'desc';
            }
            return await NoticeApi.page(queryParams);
          },
        },
      },
    } as VxeTableGridOptions<NoticeType.NoticeVo>,
  });

  /**
   * 单行删除
   * @param row 当前行
   */
  async function handleDelete(row: NoticeType.NoticeVo) {
    await NoticeApi.remove([row.id]);
    createMessage.success($t('common.tips.deleteSuccess'));
    handleRefresh();
  }

  async function handleBatchMark() {
    const selectedRows = gridApi.grid.getCheckboxRecords();
    const idList = selectedRows.map((item) => item.id);

    if (idList.length <= 0) {
      createMessage.warning($t('common.tips.pleaseSelectTheData'));
      return;
    }

    createConfirm({
      iconType: 'warning',
      content: $t('common.tips.confirmMark'),
      onOk: async () => {
        try {
          await NoticeApi.mark(idList);
          createMessage.success($t('common.tips.operationSuccess'));
          handleRefresh();
        } catch {}
      },
    });
  }

  /**
   * 批量删除已勾选数据
   */
  async function handleBatchDelete() {
    const selectedRows = gridApi.grid.getCheckboxRecords();
    const idList = selectedRows.map((item) => item.id);

    if (idList.length <= 0) {
      createMessage.warning($t('common.tips.pleaseSelectTheData'));
      return;
    }

    createConfirm({
      iconType: 'warning',
      content: $t('common.tips.confirmDelete'),
      onOk: async () => {
        try {
          await NoticeApi.remove(idList);
          createMessage.success($t('common.tips.deleteSuccess'));
          handleRefresh();
        } catch {}
      },
    });
  }

  /**
   * 编辑当前行
   * @param row 当前行数据
   */
  function handleMark(row: NoticeType.NoticeVo) {
    createConfirm({
      iconType: 'warning',
      content: $t('common.tips.confirmMark'),
      onOk: async () => {
        try {
          await NoticeApi.mark([row.id]);
          createMessage.success($t('common.tips.operationSuccess'));
          handleRefresh();
        } catch {}
      },
    });
  }

  /**
   * 查看当前行
   * @param row 当前行数据
   */
  async function handleView(row: NoticeType.NoticeVo) {
    try {
      await NoticeApi.mark([row.id]);
      handleRefresh();
    } finally {
      push({
        name: MENU_NAME.VIEW_NOTICE,
        params: { id: row.id },
      });
    }
  }

  /**
   * 刷新表格数据
   */
  function handleRefresh() {
    gridApi.query();
  }

  /**
   * 表头固定按钮
   */
  const actions: ActionItem[] = [
    {
      label: $t('ui.actionTitle.delete'),
      type: 'default',
      danger: true,
      onClick: handleBatchDelete.bind(null),
      auth: permCode.delete,
    },
    {
      label: $t('ui.actionTitle.mark'),
      type: 'default',
      onClick: handleBatchMark.bind(null),
      auth: permCode.mark,
    },
  ];

  /**
   * 表头下拉框按钮
   */
  const dropActions: ActionItem[] = [];

  return {
    Grid,
    actions,
    dropActions,
    handleRefresh,
  };
}
