<!--
 * @Author: Vben
 * @Description: Arrow component with animation
-->
<script lang="ts" setup>
import { computed } from 'vue';

import { useNamespace } from '@vben/hooks';

import { Icon } from '../../icon';

const props = defineProps({
  /**
   * 箭头展开状态
   */
  expand: { type: Boolean },
  /**
   * 默认情况箭头向上
   */
  up: { type: Boolean },
  /**
   * 默认情况箭头向下
   */
  down: { type: Boolean },
  /**
   * 取消内联的填充/边距
   */
  inset: { type: Boolean },
});

// const { prefixCls } = useDesign('basic-arrow');
const { b, m } = useNamespace('basic-arrow');

// get component class
const getClass = computed(() => {
  const { expand, up, down, inset } = props;
  return [
    b(),
    {
      [m('active')]: expand,
      up,
      inset,
      down,
    },
  ];
});
</script>

<template>
  <span :class="getClass">
    <Icon icon="ion:chevron-forward" :style="$attrs.iconStyle" />
  </span>
</template>
<style lang="scss">
$namespace: vben;
$prefix-cls: $namespace + '-basic-arrow';

.#{$prefix-cls} {
  display: inline-block;
  cursor: pointer;
  transform: rotate(0deg);
  transform-origin: center center;
  transition: all 0.3s ease 0.1s;

  &--active {
    transform: rotate(90deg);
  }

  &.inset {
    line-height: 0px;
  }

  &.up {
    transform: rotate(-90deg);
  }

  &.down {
    transform: rotate(90deg);
  }

  &.up.#{$prefix-cls}--active {
    transform: rotate(90deg);
  }

  &.down.#{$prefix-cls}--active {
    transform: rotate(-90deg);
  }
}
</style>
