import type { VNode } from 'vue';

import type { ExtendedModalApi, VbenFormSchema } from '@vben/common-ui';
import type {
  OnActionClickFn,
  OnActionClickParams,
  VxeTableGridOptions,
} from '@vben/components/adapter';
import type { ActionItem } from '@vben/components/table-action';

import type { PageParams } from '#/api';
import type { LoginLogType } from '#/api/workbench/user/loginLog/model';

import { ref } from 'vue';

import { useVbenVxeGrid } from '@vben/components/adapter';
import { useMessage } from '@vben/components/hooks';
import { renderBrowserIcon, renderOsIcon } from '@vben/components/utils';
import { ActionEnum } from '@vben/constants';

import { LoginLogApi } from '#/api/workbench/user/loginLog/api';
import { DictUniqKey } from '#/enums/dict';
import { loginLog as permCode } from '#/enums/perm/workbench/user/loginLog';
import { $t } from '#/locales';

/**
 * 操作列类型枚举
 */
enum ActionType {
  DELETE = 'delete',
  VIEW = 'view',
}

/**
 * 表格搜索表单 schema
 * @returns VbenFormSchema[]
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
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
      component: 'ApiDict',
      fieldName: 'eventType',
      label: $t('workbench.user.loginLog.eventType'),
      componentProps: {
        type: DictUniqKey.workbench.loginLog.eventType,
        showSearch: true,
        renderType: 'Select',
      },
    },
    {
      component: 'ApiDict',
      fieldName: 'status',
      label: $t('workbench.user.loginLog.status'),
      componentProps: {
        type: DictUniqKey.workbench.loginLog.status,
        showSearch: true,
        renderType: 'Select',
      },
    },
    {
      component: 'Input',
      fieldName: 'statusReason',
      label: $t('workbench.user.loginLog.statusReason'),
    },
    {
      component: 'ApiDict',
      fieldName: 'authType',
      label: $t('workbench.user.loginLog.authType'),
      componentProps: {
        type: DictUniqKey.workbench.loginLog.authType,
        showSearch: true,
        renderType: 'Select',
      },
    },
    {
      component: 'ApiDict',
      fieldName: 'loginChannel',
      label: $t('workbench.user.loginLog.loginChannel'),
      componentProps: {
        type: DictUniqKey.workbench.loginLog.loginChannel,
        showSearch: true,
        renderType: 'Select',
      },
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
      fieldName: 'browserName',
      label: $t('workbench.user.loginLog.browserName'),
    },
    {
      component: 'Input',
      fieldName: 'os',
      label: $t('workbench.user.loginLog.os'),
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
      component: 'RangePicker',
      fieldName: 'createdAt',
      label: $t('workbench.user.loginLog.createdAt'),
    },
  ];
}

/**
 * 表格列配置
 * @param onActionClick 操作栏按钮点击事件
 * @returns VxeTableGridOptions<LoginLogType.LoginLogVo>['columns']
 */
export function useColumns(
  onActionClick: OnActionClickFn<LoginLogType.LoginLogVo>,
): VxeTableGridOptions<LoginLogType.LoginLogVo>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    { title: $t('common.title.seq'), type: 'seq', width: 40 },
    {
      title: $t('common.title.expand'),
      type: 'expand',
      width: 40,
      slots: { content: 'expand_content' },
    },
    {
      field: 'appName',
      title: $t('workbench.user.loginLog.appName'),
    },
    {
      field: 'loginIp',
      title: $t('workbench.user.loginLog.loginIp'),
      width: 120,
    },
    {
      field: 'ipLocation',
      title: $t('workbench.user.loginLog.ipLocation'),
    },
    {
      field: 'browserName',
      title: $t('workbench.user.loginLog.browserName'),
      width: 100,
      slots: {
        default: ({ row }) => {
          return renderBrowserIcon(row.browserName, true) as VNode;
        },
      },
    },
    {
      field: 'os',
      title: $t('workbench.user.loginLog.os'),
      width: 100,
      slots: {
        default: ({ row }) => {
          // return 'ww';
          let value = row.os;
          if (value) {
            const split = value.split(' or ');
            if (split.length === 2) {
              value = split[0] as string;
            }
          }
          return renderOsIcon(value, true) as VNode;
        },
      },
    },
    {
      field: 'eventType',
      title: $t('workbench.user.loginLog.eventType'),
      width: 80,
      cellRender: {
        name: 'CellDict',
        attrs: {
          type: DictUniqKey.workbench.loginLog.eventType,
          mode: 'tag',
        },
      },
    },
    {
      field: 'status',
      title: $t('workbench.user.loginLog.status'),
      width: 100,
      cellRender: {
        name: 'CellDict',
        attrs: {
          type: DictUniqKey.workbench.loginLog.status,
          mode: 'badge',
        },
      },
    },
    {
      field: 'statusReason',
      title: $t('workbench.user.loginLog.statusReason'),
    },
    {
      field: 'createdAt',
      title: $t('workbench.user.loginLog.loginDate'),
      width: 160,
    },
    {
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('workbench.user.loginLog.title.table'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          { code: ActionType.VIEW, auth: permCode.view },
          { code: ActionType.DELETE, auth: permCode.delete },
        ],
      },
      field: 'operation',
      showOverflow: false,
      title: $t('ui.actionTitle.operation'),
      width: 150,
    },
  ];
}

export function useIndex() {
  // 表单 页面
  const formWrapperRef = ref<{
    modalApi: ExtendedModalApi;
  }>();
  const { createConfirm, createMessage } = useMessage();

  // 操作栏按钮点击事件
  function onActionClick({
    code,
    row,
  }: OnActionClickParams<LoginLogType.LoginLogVo>) {
    const actionHandlers: Record<
      string,
      (row: LoginLogType.LoginLogVo) => void
    > = {
      [ActionType.DELETE]: handleDelete,
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
      expandConfig: {
        padding: true,
      },
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
            const queryParams: PageParams<Partial<LoginLogType.LoginLogQuery>> =
              {
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
            return await LoginLogApi.page(queryParams);
          },
        },
      },
    } as VxeTableGridOptions<LoginLogType.LoginLogVo>,
  });

  /**
   * 单行删除
   * @param row 当前行
   */
  async function handleDelete(row: LoginLogType.LoginLogVo) {
    await LoginLogApi.remove([row.id]);
    createMessage.success($t('common.tips.deleteSuccess'));
    handleRefresh();
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
          await LoginLogApi.remove(idList);
          createMessage.success($t('common.tips.deleteSuccess'));
          handleRefresh();
        } catch {}
      },
    });
  }

  /**
   * 查看当前行
   * @param row 当前行数据
   */
  function handleView(row: LoginLogType.LoginLogVo) {
    formWrapperRef.value?.modalApi
      .setData({ type: ActionEnum.VIEW, formData: row })
      .open();
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
      danger: true,
      type: 'default',
      onClick: handleBatchDelete,
      auth: permCode.delete,
    },
  ];

  return {
    Grid,
    formWrapperRef,
    actions,
    handleRefresh,
  };
}
