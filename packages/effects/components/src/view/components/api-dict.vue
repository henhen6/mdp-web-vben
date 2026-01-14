<script lang="ts" setup>
import type { PropType } from 'vue';

import { computed, onBeforeMount, ref } from 'vue';

import { i18n } from '@vben/locales';
import { BADGE_STATUS, isNullOrUnDef } from '@vben/utils';

import { Badge, Space, Tag } from 'ant-design-vue';

import { useDictStore } from '../../store/dict';

defineOptions({
  name: 'ApiDictView',
  inheritAttrs: false,
});

const props = defineProps({
  value: {
    type: [String, Number, Boolean, Array],
    default: undefined,
  },
  data: {
    // 当前行数据
    type: Object,
    default: () => {},
  },
  // 回显方式
  mode: {
    type: String,
    default: 'tag',
    validator: (val: string) => ['badge', 'tag', 'text'].includes(val),
  },
  // 字典类型或枚举类型
  type: {
    type: String,
    default: undefined,
  },
  // 数据类型 [1-字符串 2-整型 3-布尔]
  dataType: {
    type: String,
    default: undefined,
    validator: (val: string) =>
      isNullOrUnDef(val) || ['1', '2', '3'].includes(val),
  },
  colorMap: {
    // 标签color映射关系
    type: Object as PropType<Record<number | string, ColorType>>,
    default: () => ({}),
  },
  colorList: {
    // 预设的颜色列表
    type: Array as PropType<ColorType[]>,
    default: () => [
      { propType: '#E7FCF8' }, // 青绿色系
      { propType: '#E6F7FF' }, // 蓝色系
      { propType: '#F6FFED' }, // 绿色系
      { propType: '#FFFBE6' }, // 橙色系
      { propType: '#F9F0FF' }, // 紫色系
      { propType: '#FFF1F0' }, // 深红系
      { propType: '#FFF7E6' }, // 深橙系
      { propType: '#FCFFE6' }, // 黄绿系
      { propType: '#FFF0F6' }, // 粉色系
      { propType: '#E6FFFB' }, // 青色系
      { propType: '#F3EAFD' }, // 深紫系
      { propType: '#E6F4FF' }, // 深蓝系
      { propType: '#F2FFF0' }, // 深绿系
      { propType: '#FEFFE6' }, // 金黄系
      { propType: '#FFF2E8' }, // 棕橙系
      { propType: '#E8F4FF' }, // 宝蓝系
      { propType: '#F2FFF2' }, // 草绿系
      { propType: '#F9F0FF' }, // 浅紫系
      { propType: '#FFF2E8' }, // 浅橙系
      { propType: '#E6FFFB' }, // 浅青系
      { propType: '#FEFFE6' }, // 明黄系
      { propType: '#F3EAFD' }, // 薰衣系
      { propType: '#FFFBE6' }, // 金橙系
      { propType: '#FFEDED' }, // 玫红系
      { propType: '#E6F7FF' }, // 天蓝系
      { propType: '#F6FFED' }, // 嫩绿系
      { propType: '#FFF0F6' }, // 桃粉系
      { propType: '#FFF7E6' }, // 杏橙系
      { propType: '#FFEDED' }, // 红色系
      { propType: '#F4F4F5' }, // 灰色系
    ],
  },
  useColorList: {
    // 是否使用预设的颜色列表
    type: Boolean,
    default: false,
  },
  useCss: {
    // 使用字典表中配置的 cssStyle 和 cssClass
    type: Boolean,
    default: true,
  },
});
type ColorType = {
  // 组件类名
  cssClass?: string;
  // 组件样式
  cssStyle?: string;
  // 组件属性
  propType?: string;
};
type NewOption = ColorType & {
  children?: NewOption[];
  label: string;
  value: any;
};
const dictStore = useDictStore();
const options = ref<NewOption[]>([]);
type NewOptionType = NewOption & { tagProps?: any };
const cValue = computed(() => {
  // 查找匹配的选项并返回标签
  if (Array.isArray(props.value)) {
    // 处理数组值的情况
    return props.value
      .map((val) => {
        const option = options.value.find((opt) => opt.value === val);
        return option ? option.label : val;
      })
      .join(', ');
  } else {
    // 处理单个值的情况
    const option = options.value.find((opt) => opt.value === props.value);
    return option ? option.label : props.value;
  }
});
const createOption = (
  label: boolean | number | string,
  value: boolean | number | string,
): NewOptionType => ({
  label: String(label),
  value,
});

const createTagOption = (
  option: NewOption | null,
  value: boolean | number | string,
  index: number,
): NewOptionType => {
  if (!option) {
    return createOption(value, value);
  }

  let propType;
  if (option.propType) {
    propType = option.propType;
  } else {
    // 从 colorMap 获取颜色配置
    const colorMapConfig = props.colorMap[option.value];
    // 从 colorList 获取颜色配置（处理索引越界）
    const colorListConfig =
      props.useColorList && props.colorList.length > 0
        ? props.colorList[index % props.colorList.length]
        : undefined;

    // 优先使用 colorMap 配置，其次使用 colorList 配置
    const colorConfig = colorMapConfig || colorListConfig;

    propType = colorConfig?.propType;
  }

  // badge 模式下，需要区分 status 还是 color 属性； tag模式下，一定是color
  const isBadge =
    props.mode === 'badge' &&
    (isNullOrUnDef(propType) || BADGE_STATUS.includes(propType));

  const tagProps = {
    ...(isBadge ? { status: propType } : { color: propType }),
    ...(props.useCss
      ? { class: option.cssClass, style: option.cssStyle }
      : undefined),
  };
  return {
    ...option,
    tagProps,
  };
};
const cNewOptions = computed<NewOptionType[]>(() => {
  if (Array.isArray(props.value)) {
    return props.value.map((val: any) => {
      const option = options.value.find((opt) => opt.value === val) ?? null;
      // 修复：根据选项在 options 数组中的实际索引来获取 colorList 颜色
      const optionIndex = option ? options.value.indexOf(option) : 0;
      return createTagOption(option, val, optionIndex);
    });
  } else {
    if (props.value === undefined || props.value === null) {
      return [];
    }
    const option = options.value.find((opt) => opt.value === props.value);
    // 修复：根据选项在 options 数组中的实际索引来获取 colorList 颜色
    const optionIndex = option ? options.value.indexOf(option) : 0;
    if (option) {
      return [createTagOption(option, props.value, optionIndex)];
    } else {
      if (!isNullOrUnDef(props.value)) {
        return [createOption(props.value, props.value)];
      }
      return [];
    }
  }
});

onBeforeMount(() => {
  requestData();
});

const requestData = async () => {
  if (!props.type) return;

  try {
    options.value = dictStore.getDictItemOptionList(
      props.type,
      (i18n.global.locale as any).value,
    );
    if (props.dataType) {
      options.value = options.value.map((item) => {
        let val = item.value;
        switch (props.dataType) {
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
        return { ...item, value: val };
      });
    }
  } catch (error) {
    console.error('获取字典数据失败:', error);
    options.value = [];
  }
};
</script>
<template>
  <template v-if="mode === 'tag'">
    <Space v-if="cNewOptions.length > 0">
      <template v-for="item in cNewOptions" :key="item.value">
        <Tag v-if="item.tagProps" v-bind="item.tagProps">
          {{ item.label }}
        </Tag>
        <span v-else>{{ item.label }}</span>
      </template>
    </Space>
  </template>
  <template v-else-if="mode === 'badge'">
    <Space v-if="cNewOptions.length > 0">
      <template v-for="item in cNewOptions" :key="item.value">
        <Badge v-if="item.tagProps" v-bind="item.tagProps" :text="item.label" />
        <span v-else>{{ item.label }}</span>
      </template>
    </Space>
  </template>
  <template v-else>
    <span>{{ cValue }}</span>
  </template>
</template>
