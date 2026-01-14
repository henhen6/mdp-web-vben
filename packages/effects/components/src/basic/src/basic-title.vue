<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import { useNamespace } from '@vben/hooks';

import BasicHelp from './basic-help.vue';

interface Props {
  helpPosition?: 'after' | 'before';
  /** Help text list or string */
  helpMessage?: string | string[];
  /** Whether the color block on the left side of the title */
  span?: boolean;
  /** Whether to default the text, that is, not bold */
  normal?: boolean;
  /** 是否显示底部线条 */
  line?: boolean;
  /** 底部线条 是否虚线 */
  dashed?: boolean;
  /** 是否显示光标 */
  cursor?: boolean;
  /** 是否不能选择 */
  noneSelect?: boolean;
  /** 字体大小 */
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  helpPosition: 'after',
  helpMessage: '',
  span: false,
  normal: true,
  line: false,
  dashed: false,
  cursor: false,
  noneSelect: false,
  h1: false,
  h2: false,
  h3: false,
});

const { b } = useNamespace('basic-title');

const slots = useSlots();
const getClass = computed(() => [
  b(),
  { [b('show-span')]: props.span && slots.default },
  { [b('line')]: !!props.line },
  { [b('cursor')]: !!props.cursor },
  { [b('none-select')]: !!props.noneSelect },
  { [b('dashed')]: !!props.line && !!props.dashed },
  { [b('normal')]: !!props.normal },
  { [b('h1')]: !!props.h1 },
  { [b('h2')]: !!props.h2 },
  { [b('h3')]: !!props.h3 },
]);
</script>
<template>
  <span :class="getClass">
    <BasicHelp
      v-if="helpPosition === 'before' && helpMessage"
      :class="b('help')"
      :text="helpMessage"
    />
    <slot></slot>
    <BasicHelp
      :class="b('help')"
      v-if="helpPosition === 'after' && helpMessage"
      :text="helpMessage"
    />
  </span>
</template>
<style lang="scss" scoped>
$namespace: vben;
$prefix-cls: $namespace + '-basic-title';

.#{$prefix-cls} {
  display: flex;
  padding-left: 7px;
  font-size: var(--font-size-base);
  font-weight: bold;
  color: hsl(var(--accent-foreground));

  &-none-select {
    user-select: none;
  }

  &-cursor {
    cursor: pointer;
  }

  &-normal {
    font-size: var(--font-size-lg);
    font-weight: normal;
  }

  &-h1 {
    font-size: 2em;
  }

  &-h2 {
    font-size: 1.5em;
  }

  &-h3 {
    font-size: 1em;
  }

  &-line {
    border-bottom: var(--border-width-base) solid transparent;
    border-bottom-color: inherit;
  }

  &-dashed {
    border-style: dashed;
  }

  &-show-span {
    padding-left: 15px;
    border-left: 5px solid hsl(var(--primary));
  }

  &-h1::before {
    height: 2em;
  }

  &-h2::before {
    height: 1.5em;
  }

  &-h3::before {
    height: 1em;
  }

  &-help {
    margin-left: 10px;
  }
}
</style>
