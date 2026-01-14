<script lang="tsx">
import type { ExtractPropTypes, PropType } from 'vue';

import { defineComponent } from 'vue';

import { useNamespace } from '@vben/hooks';

import { BasicArrow, BasicTitle } from '../../../basic';

const collapseHeaderProps = {
  prefixCls: String,
  title: String,
  show: Boolean,
  canExpan: Boolean,
  helpMessage: {
    type: [Array, String] as PropType<string | string[]>,
    default: '',
  },
};

export type CollapseHeaderProps = ExtractPropTypes<typeof collapseHeaderProps>;

export default defineComponent({
  name: 'CollapseHeader',
  inheritAttrs: false,
  props: collapseHeaderProps,
  emits: ['expand'],
  setup(props, { slots, attrs, emit }) {
    const { e } = useNamespace('collapse-container');
    return () => (
      <div class={[`${e('header')} px-2 py-5`, attrs.class]}>
        <BasicTitle helpMessage={props.helpMessage} normal>
          {slots.title?.() || props.title}
        </BasicTitle>

        <div class={e('action')}>
          {slots.actionLeft?.()}

          {slots.action
            ? slots.action({
                expand: props.show,
                onClick: () => emit('expand'),
              })
            : props.canExpan && (
                <BasicArrow
                  expand={props.show}
                  onClick={() => emit('expand')}
                  up
                />
              )}
        </div>
      </div>
    );
  },
});
</script>
