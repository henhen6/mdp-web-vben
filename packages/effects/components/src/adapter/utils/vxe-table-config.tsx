import type { Recordable } from '@vben/types';

import type { PopConfirm } from '../../table-action';
import type { VxeTableGridOptions, VxeUIExport } from '../vxe-table';

import { h } from 'vue';

import { useAccess } from '@vben/access';
import { IconifyIcon } from '@vben/icons';
import { $t, $te, i18n } from '@vben/locales';
import { VxeLink, VxeText } from '@vben/plugins/vxe-table';
import {
  isArray,
  isEmpty,
  isEmptyOrUnDef,
  isFunction,
  isNullOrUnDef,
  isString,
} from '@vben/utils';

import { get, objectOmit } from '@vueuse/core';
import {
  Badge,
  Button,
  Dropdown,
  Image,
  Menu,
  MenuItem,
  Popconfirm,
  Switch,
  Tag,
} from 'ant-design-vue';

import { useDictStore } from '../../store';

const valueMap = {
  default: {
    enabled: true,
    disabled: false,
  },
  number: {
    enabled: 1,
    disabled: 0,
  },
  string: {
    enabled: '1',
    disabled: '0',
  },
};

export const setConfig = (vxeUI: VxeUIExport) => {
  vxeUI.setConfig({
    grid: {
      align: 'center',
      border: false,
      columnConfig: {
        resizable: true,
      },
      minHeight: 180,
      toolbarConfig: {
        refresh: true, // 刷新
        print: false, // 打印
        export: false, // 导出
        custom: true, // 自定义列
        zoom: true, // 最大化最小化
        search: true, // 搜索
      },
      formConfig: {
        // 全局禁用vxe-table的表单配置，使用formOptions
        enabled: false,
      },
      rowConfig: {
        // 是否需要为每一行的 VNode 设置 key 属性
        useKey: true,
        // 自定义行数据唯一主键的字段名（默认自动生成）
        keyField: 'id',
        // 当鼠标移到行时，是否要高亮当前行
        isHover: true,
        // 当鼠标点击行时，是否要高亮当前行
        isCurrent: true,
      },
      checkboxConfig: {
        // 是否保留勾选状态，对于某些场景可能会用到，比如数据被刷新之后还保留之前选中的状态（需要有 row-config.keyField）
        reserve: true,
        // 高亮勾选行
        highlight: true,
        // 开启复选框范围选择功能（启用后通过鼠标在复选框的列内滑动选中或取消指定行）
        range: true,
        // 触发方式（注：当多种功能重叠时，会同时触发） default（默认）, cell（点击单元格触发）, row（点击行触发）
        trigger: 'cell',
        /**
         * 开启复选框指定行选择功能，启用后通过鼠标点击和 shift 键选取指定范围的行
         */
        isShiftKey: true,
      },
      sortConfig: {
        remote: true, // 所有列是否使用服务端排序，如果设置为 true 则不会对数据进行处理
        trigger: 'cell', // 触发方式（注：当多种功能重叠时，会同时触发）default（点击按钮触发）, cell（点击表头触发）
        // 是否显示列头排序图标
        showIcon: true,
        // 自定义轮转顺序
        orders: ['asc', 'desc', null],
        // 全局排序方法，当触发排序时会调用该函数，返回排序后的列表
        // sortMethod: null,
        // 是否启用多列组合筛选
        // multiple: false,
        // 只对 multiple 有效，是否按照先后触发顺序进行排序
        chronological: false,
        defaultSort: {
          field: 'createdAt',
          order: 'desc',
        },
      },
      // 分页配置项
      pagerConfig: {
        pageSize: 20,
        pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      },
      proxyConfig: {
        // 是否自动加载查询数据
        autoLoad: true,
        // 启用动态序号代理，每一页的序号会根据当前页数变化
        seq: true,
        // 启用排序代理，当点击排序时会自动触发 query 行为
        sort: true,
        // 启用筛选代理，当点击筛选时会自动触发 query 行为
        filter: true,
        // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
        form: true,
        // 是否显示内置的消息提示（可以设为 false 关闭内置的消息提示）
        message: false,
        response: {
          result: 'records', // 配置响应结果列表字段
          total: 'totalRow', // 配置响应结果总条数字段
          // 只对 pager-config 配置了有效，响应结果中获取提示消息的属性
          message: 'msg',
        },
        showActiveMsg: true,
        showResponseMsg: false,
      },
      round: true,
      showOverflow: true,
      size: 'small',
    } as VxeTableGridOptions,
  });
};

/**
 * 表格配置项可以用 cellRender: { name: 'CellImage' },
 * @param vxeUI
 */
export const rendererCellImage = (vxeUI: VxeUIExport) => {
  vxeUI.renderer.add('CellImage', {
    renderTableDefault(_renderOpts, params) {
      const { column, row } = params;
      return h(Image, { src: row[column.field] });
    },
  });
};

export const rendererCellLink = (vxeUI: VxeUIExport) => {
  vxeUI.renderer.add('CellLink', {
    renderTableDefault(renderOpts) {
      const { props } = renderOpts;
      return h(
        Button,
        { size: 'small', type: 'link' },
        { default: () => props?.text },
      );
    },
  });
};

export const rendererCellText = (vxeUI: VxeUIExport) => {
  vxeUI.renderer.add('CellText', {
    renderTableDefault({ props, attrs }, params) {
      const { column, row } = params;
      return h(
        VxeText,
        { ...props, ...attrs },
        { default: () => row[column.field] },
      );
    },
  });
};

export const rendererCellVxeLink = (vxeUI: VxeUIExport) => {
  vxeUI.renderer.add('CellVxeLink', {
    renderTableDefault({ props, attrs }, params) {
      const { column, row } = params;
      return h(
        VxeLink,
        {
          ...props,
          ...attrs,
          onClick: () => attrs?.onClick?.({ row }),
        },
        { default: () => row[column.field] },
      );
    },
  });
};
export const rendererCellDict = (vxeUI: VxeUIExport) => {
  vxeUI.renderer.add('CellDict', {
    renderTableDefault(
      {
        options,
        props,
        attrs,
      }: {
        /**
         * @param type 字典类型
         * @param dataType 数据类型 [1-字符串 2-整型 3-布尔]
         * @param mode 回显方式 'badge', 'tag', 'text'
         * @param useCss 使用字典表中配置的 cssStyle 和 cssClass
         */
        attrs: {
          dataType?: string;
          mode: 'badge' | 'tag' | 'text' | undefined;
          type: string;
          useCss: boolean;
        };
        options:
          | undefined
          | {
              cssClass: string | undefined;
              cssStyle: string | undefined;
              propType: string | undefined;
              value: boolean | number | string;
            }[];
        props: { [key: string]: any };
      },
      { column, row },
    ) {
      if (isNullOrUnDef(attrs)) {
        return h(
          'span',
          {
            style: 'color: red',
          },
          { default: () => '请配置字典类型' },
        );
      }
      const dictStore = useDictStore();
      // 字典项 uniqKey
      const value = get(row, column.field);
      // 字典类型
      const { type, mode, useCss, dataType } = attrs;

      if (isEmptyOrUnDef(type)) {
        return h(
          'span',
          {
            style: 'color: red',
          },
          { default: () => '请配置字典类型' },
        );
      }

      let item = dictStore.getDictItem(type, value);
      if (!item) {
        const itemList = dictStore.getDictItemOptionList(type);
        item = itemList.find((item) => {
          let val = item.value;
          switch (dataType) {
            case '1': {
              val = String(item.value);
              break;
            }
            case '2': {
              try {
                val = Number(item.value);
              } catch (error) {
                console.error(error);
              }
              break;
            }
            case '3': {
              val = ['1', 1, true, 'true'].includes(item.value);
              break;
            }
            // No default
          }
          return val === value;
        });
      }
      // 字典缓存中，没有数据
      if (!item) {
        return h('span', {}, { default: () => value });
      }

      // 字典国际化
      let label = item.name;
      if (!isNullOrUnDef(item.i18nJson) && !isEmpty(item.i18nJson)) {
        try {
          const i18nJson = JSON.parse(item.i18nJson);
          label = i18nJson[(i18n.global.locale as any).value];
        } catch {}
        // 容错处理
        if (isEmptyOrUnDef(label)) {
          label = item.name;
        }
      }
      // 容错处理
      if (isEmptyOrUnDef(label)) {
        label = value;
      }

      // 优先取options中传递的颜色，其次取字典项中配置的颜色
      let color: string | undefined;
      let cssClass: string | undefined;
      let cssStyle: string | undefined;
      if (options && isArray(options)) {
        const tagItem = options.find((item) => item.value === value);
        color = tagItem?.propType;
        cssClass = tagItem?.cssClass;
        cssStyle = tagItem?.cssStyle;
      }
      if (isEmptyOrUnDef(color)) {
        color = item.propType;
      }
      if (isEmptyOrUnDef(cssStyle)) {
        cssStyle = item.cssStyle;
      }
      if (isEmptyOrUnDef(cssClass)) {
        cssClass = item.cssClass;
      }
      // 默认居中
      if (isEmptyOrUnDef(cssClass)) {
        cssClass = 'mx-auto';
      }

      if (mode === 'tag') {
        return h(
          Tag,
          {
            ...props,
            color,
            ...(useCss
              ? {
                  class: cssClass,
                  style: cssStyle,
                }
              : {}),
          },
          { default: () => label },
        );
      } else if (mode === 'badge') {
        return h(
          Badge,
          {
            ...props,
            status: color as
              | 'default'
              | 'error'
              | 'processing'
              | 'success'
              | 'warning',
            ...(useCss
              ? {
                  class: cssClass,
                  style: cssStyle,
                }
              : {}),
          },
          { text: () => label },
        );
      } else {
        return h(
          'span',
          {
            ...(useCss
              ? {
                  class: cssClass,
                  style: cssStyle,
                }
              : {}),
          },
          { default: () => label },
        );
      }
    },
  });
};
export const rendererCellTag = (vxeUI: VxeUIExport) => {
  vxeUI.renderer.add('CellTag', {
    renderTableDefault({ options, props, attrs }, { column, row }) {
      const value = get(row, column.field);
      const valueType: 'default' | 'number' | 'string' =
        attrs?.valueType ?? 'default';

      const tagOptions = options ?? [
        {
          color: 'success',
          label: $t('common.enabled'),
          class: 'mx-auto',
          value: (valueMap[valueType] || valueMap.default).enabled,
        },
        {
          color: 'error',
          class: 'mx-auto',
          label: $t('common.disabled'),
          value: (valueMap[valueType] || valueMap.default).disabled,
        },
      ];
      const tagItem = tagOptions.find((item) => item.value === value);
      return h(
        Tag,
        {
          ...props,
          ...objectOmit(tagItem ?? {}, ['label']),
        },
        { default: () => tagItem?.label ?? value },
      );
    },
  });
};
export const rendererCellSwitch = (vxeUI: VxeUIExport) => {
  vxeUI.renderer.add('CellSwitch', {
    renderTableDefault({ attrs, props }, { column, row }) {
      const loadingKey = `__loading_${column.field}`;
      const finallyProps = {
        checkedChildren: $t('common.enabled'),
        checkedValue: 1,
        unCheckedChildren: $t('common.disabled'),
        unCheckedValue: 0,
        ...props,
        checked: row[column.field],
        loading: row[loadingKey] ?? false,
        'onUpdate:checked': onChange,
      };
      async function onChange(newVal: any) {
        row[loadingKey] = true;
        try {
          const result = await attrs?.beforeChange?.(newVal, row);
          if (result !== false) {
            row[column.field] = newVal;
          }
        } finally {
          row[loadingKey] = false;
        }
      }
      return h(Switch, finallyProps);
    },
  });
};

export const rendererCellOperation = (vxeUI: VxeUIExport) => {
  vxeUI.renderer.add('CellOperation', {
    renderTableDefault({ attrs, options, props }, { column, row }) {
      const defaultProps = { size: 'small', type: 'link', ...props };
      let align = 'center';
      switch (column.align) {
        case 'left': {
          align = 'start';
          break;
        }
        case 'right': {
          align = 'end';
          break;
        }
        default: {
          align = 'center';
          break;
        }
      }
      const presets: Recordable<Recordable<any>> = {
        delete: {
          danger: true,
          text: $t('common.title.delete'),
          popConfirm: {},
        },
        edit: {
          text: $t('common.title.edit'),
        },
        view: {
          text: $t('common.title.view'),
        },
      };
      const { hasAnyPermission, isPermission } = useAccess();
      const operations: Array<Recordable<any>> = (
        options || ['edit', 'delete', 'view']
      )
        .map((opt) => {
          if (isString(opt)) {
            return presets[opt]
              ? { code: opt, ...presets[opt], ...defaultProps }
              : {
                  code: opt,
                  text: $te(`common.${opt}`) ? $t(`common.${opt}`) : opt,
                  ...defaultProps,
                };
          } else {
            return { ...defaultProps, ...presets[opt.code], ...opt };
          }
        })
        .map((opt) => {
          const optBtn: Recordable<any> = {};
          Object.keys(opt).forEach((key) => {
            optBtn[key] = isFunction(opt[key]) ? opt[key](row) : opt[key];
          });
          return optBtn;
        })
        .filter((opt) => opt.show !== false)
        .filter((opt) =>
          opt.mode
            ? isPermission(opt.auth, true, opt.mode)
            : hasAnyPermission(opt.auth),
        );

      function renderBtn(opt: Recordable<any>, listen = true) {
        return h(
          Button,
          {
            ...props,
            ...opt,
            icon: undefined,
            onClick: listen
              ? () =>
                  attrs?.onClick?.({
                    code: opt.code,
                    row,
                  })
              : undefined,
          },
          {
            default: () => {
              const content = [];
              if (opt.icon) {
                content.push(
                  h(IconifyIcon, { class: 'size-5', icon: opt.icon }),
                );
              }
              content.push(opt.text);
              return content;
            },
          },
        );
      }

      function renderConfirm(opt: Recordable<any>) {
        let viewportWrapper: HTMLElement | null = null;
        return h(
          Popconfirm,
          {
            /**
             * 当popconfirm用在固定列中时，将固定列作为弹窗的容器时可能会因为固定列较窄而无法容纳弹窗
             * 将表格主体区域作为弹窗容器时又会因为固定列的层级较高而遮挡弹窗
             * 将body或者表格视口区域作为弹窗容器时又会导致弹窗无法跟随表格滚动。
             * 鉴于以上各种情况，一种折中的解决方案是弹出层展示时，禁止操作表格的滚动条。
             * 这样既解决了弹窗的遮挡问题，又不至于让弹窗随着表格的滚动而跑出视口区域。
             */
            getPopupContainer(el) {
              viewportWrapper = el.closest('.vxe-table--viewport-wrapper');
              return document.body;
            },
            placement: 'topLeft',
            title:
              opt.popConfirm?.title ??
              $t('ui.actionTitle.delete', [attrs?.nameTitle || '']),
            ...props,
            ...opt,
            icon: undefined,
            onOpenChange: (open: boolean) => {
              // 当弹窗打开时，禁止表格的滚动
              if (open) {
                viewportWrapper?.style.setProperty('pointer-events', 'none');
              } else {
                viewportWrapper?.style.removeProperty('pointer-events');
              }
            },
            onConfirm: () => {
              attrs?.onClick?.({
                code: opt.code,
                row,
              });
            },
          },
          {
            default: () => renderBtn({ ...opt }, false),
            description: () =>
              h(
                'div',
                { class: 'truncate' },
                opt.popConfirm?.content ??
                  $t('ui.actionMessage.deleteConfirm', [
                    row[attrs?.nameField || 'name'],
                  ]),
              ),
          },
        );
      }

      function handleMenuClick(e: any) {
        // const action = dropdownList.value[e.key];
        // if (action.onClick && isFunction(action.onClick)) {
        //   action.onClick(action);
        // }
        if (attrs?.onClick && isFunction(attrs?.onClick)) {
          attrs?.onClick?.({ code: e.key, row });
        }
      }
      const getPopConfirmProps = (attrs: PopConfirm) => {
        const originAttrs: any = attrs;
        delete originAttrs.icon;
        if (attrs.confirm && isFunction(attrs.confirm)) {
          originAttrs.onConfirm = attrs.confirm;
          delete originAttrs.confirm;
        }
        if (attrs.cancel && isFunction(attrs.cancel)) {
          originAttrs.onCancel = attrs.cancel;
          delete originAttrs.cancel;
        }
        return originAttrs;
      };

      function renderDropdownMenu(dropdownList: Array<Recordable<any>>) {
        return h(
          Menu,
          {
            onClick: handleMenuClick,
          },
          {
            default: () =>
              dropdownList.map((action) =>
                h(
                  MenuItem,
                  { key: action.code },
                  {
                    default: () => {
                      // 处理带Popconfirm的情况
                      if (action.popConfirm) {
                        return h(
                          Popconfirm,
                          getPopConfirmProps(action.popConfirm),
                          {
                            // Popconfirm的icon插槽
                            icon: action.popConfirm.icon
                              ? () =>
                                  h(IconifyIcon, {
                                    icon: action.popConfirm.icon,
                                  })
                              : undefined,
                            // Popconfirm的默认插槽（触发元素）
                            default: () =>
                              h(
                                'div',
                                {
                                  class:
                                    action.disabled === true
                                      ? 'cursor-not-allowed text-gray-300'
                                      : '',
                                },
                                [
                                  action.icon
                                    ? h(IconifyIcon, { icon: action.icon })
                                    : null,
                                  action.text
                                    ? h('span', { class: 'ml-1' }, action.text)
                                    : null,
                                ],
                              ),
                          },
                        );
                      }

                      // 不带Popconfirm的情况
                      return h(
                        'div',
                        {
                          class:
                            action.disabled === true
                              ? 'cursor-not-allowed text-gray-300'
                              : '',
                        },
                        [
                          action.icon
                            ? h(IconifyIcon, { icon: action.icon })
                            : null,
                          action.text ? h('span', action.text) : null,
                        ],
                      );
                    },
                  },
                ),
              ),
          },
        );
      }

      function renderDropdown(dropdownList: Array<Recordable<any>>) {
        if (dropdownList.length === 0) {
          return null;
        }
        return h(
          Dropdown,
          {
            trigger: ['hover'],
          },
          {
            default: () =>
              h(
                Button,
                {
                  size: 'small',
                  type: 'link',
                },
                {
                  icon: () =>
                    h(IconifyIcon, {
                      class: 'size-5',
                      icon: 'ant-design:more-outlined',
                    }),
                },
              ),
            // 注意：Dropdown通常需要默认插槽定义下拉菜单内容，这里原代码未体现，需根据实际情况补充
            overlay: () => renderDropdownMenu(dropdownList), // 示例，实际需替换为真实下拉项
          },
        );
      }

      const dropdownOptions = operations.filter((opt) => {
        return !!opt.dropdown;
      });
      const btnOptions = operations.filter((opt) => {
        return !opt.dropdown;
      });

      const dropdownBtns = renderDropdown(dropdownOptions);

      const btns = btnOptions.map((opt) =>
        isNullOrUnDef(opt.popConfirm) ? renderBtn(opt) : renderConfirm(opt),
      );

      const btnList = [...btns, dropdownBtns];
      return h(
        'div',
        {
          class: 'flex table-operations',
          style: { justifyContent: align },
        },
        btnList,
      );
    },
  });
};
