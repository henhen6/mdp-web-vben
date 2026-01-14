<script setup lang="ts">
import type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarRootProps,
} from 'reka-ui';

import type { CSSProperties } from 'vue';

import type { ClassType } from '@vben-core/typings';

import { computed } from 'vue';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui';

interface Props extends AvatarFallbackProps, AvatarImageProps, AvatarRootProps {
  alt?: string;
  class?: ClassType;
  dot?: boolean;
  dotClass?: ClassType;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  height?: number | string;
  size?: number;
  width?: number | string;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  alt: 'avatar',
  as: 'button',
  dot: false,
  dotClass: 'bg-green-500',
  fit: 'cover',
});

const imageStyle = computed<CSSProperties>(() => {
  const { fit } = props;
  if (fit) {
    return { objectFit: fit };
  }
  return {};
});

const text = computed(() => {
  return props.alt?.slice(-2)?.toUpperCase();
});

const rootStyle = computed(() => {
  const style: CSSProperties = {};

  // 先判断 props.width，再判断 props.size
  if (props.width !== undefined) {
    style.width = `${props.width}px`;
  } else if (props.size !== undefined && props.size > 0) {
    style.width = `${props.size}px`;
  }

  // 先判断 props.height，再判断 props.size
  if (props.height !== undefined) {
    style.height = `${props.height}px`;
  } else if (props.size !== undefined && props.size > 0) {
    style.height = `${props.size}px`;
  }

  return style;
});
</script>

<template>
  <div
    :class="props.class"
    :style="rootStyle"
    class="relative flex flex-shrink-0 items-center"
  >
    <Avatar :class="props.class" class="size-full">
      <AvatarImage :alt="alt" :src="src" :style="imageStyle" />
      <AvatarFallback>{{ text }}</AvatarFallback>
    </Avatar>
    <span
      v-if="dot"
      :class="dotClass"
      class="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background"
    >
    </span>
  </div>
</template>
