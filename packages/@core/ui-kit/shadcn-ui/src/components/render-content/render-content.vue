<script lang="ts">
import type { Component, PropType } from 'vue';

import { defineComponent, h } from 'vue';

import { isFunction, isObject, isString } from '@vben-core/shared/utils';

// 抽离 content 的类型
type ContentType = (() => []) | (() => any) | Component | string;

export default defineComponent({
  name: 'RenderContent',
  props: {
    content: {
      default: undefined,
      type: [Object, Array, String, Function] as PropType<ContentType>,
    },
    // 是否支持字符串中的换行符
    renderBr: {
      default: true,
      type: Boolean,
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      if (!props.content) {
        return null;
      }
      const isComponent =
        !Array.isArray(props.content) &&
        (isObject(props.content) || isFunction(props.content)) &&
        props.content !== null;
      if (!isComponent) {
        if (props.renderBr) {
          let lines: string[] = [];
          if (Array.isArray(props.content)) {
            lines = props.content as unknown as string[];
          } else if (isString(props.content)) {
            lines = props.content.split('\n');
          }
          const result = [];
          for (const [i, line] of lines.entries()) {
            result.push(h('p', { key: i }, line));
          }
          return result;
        } else {
          return Array.isArray(props.content)
            ? props.content.join('')
            : props.content;
        }
      }
      return h(props.content as never, {
        ...attrs,
        props: {
          ...props,
          ...attrs,
        },
        slots,
      });
    };
  },
});
</script>
