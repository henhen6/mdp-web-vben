<script lang="tsx">
import type { ExtractPropTypes, PropType } from 'vue';

import { defineComponent, ref } from 'vue';

import { useNamespace, useTimeoutFn } from '@vben/hooks';
import { isNil, triggerWindowResize } from '@vben/utils';

import { Skeleton } from 'ant-design-vue';

import { CollapseTransition } from '../../../transition';
import CollapseHeader from './collapse-header.vue';

const collapseContainerProps = {
  title: { type: String, default: '' },
  loading: { type: Boolean },
  /**
   *  Can it be expanded
   */
  canExpan: { type: Boolean, default: true },
  /**
   * Warm reminder on the right side of the title
   */
  helpMessage: {
    type: [Array, String] as PropType<string | string[]>,
    default: '',
  },
  /**
   * Whether to trigger window.resize when expanding and contracting,
   * Can adapt to tables and forms, when the form shrinks, the form triggers resize to adapt to the height
   */
  triggerWindowResize: { type: Boolean },
  /**
   * Delayed loading time
   */
  lazyTime: { type: Number, default: 0 },
};

export type CollapseContainerProps = ExtractPropTypes<
  typeof collapseContainerProps
>;

export default defineComponent({
  name: 'CollapseContainer',

  props: collapseContainerProps,

  setup(props, { expose, slots }) {
    const { b, e } = useNamespace('collapse-container');

    const show = ref(true);

    const handleExpand = (val: boolean) => {
      show.value = isNil(val) ? !show.value : val;
      if (props.triggerWindowResize) {
        // 200 milliseconds here is because the expansion has animation,
        useTimeoutFn(triggerWindowResize, 200);
      }
    };

    expose({ handleExpand });

    return () => (
      <div class={b()}>
        <CollapseHeader
          {...props}
          onExpand={handleExpand}
          show={show.value}
          v-slots={{
            title: slots.title,
            action: slots.action,
            actionLeft: slots.actionLeft,
          }}
        />

        <div class="p-2">
          <CollapseTransition>
            {props.loading ? (
              <Skeleton active={props.loading} />
            ) : (
              <div class={e('body')} v-show={show.value}>
                {slots.default?.()}
              </div>
            )}
          </CollapseTransition>
        </div>

        {slots.footer && <div class={e('footer')}>{slots.footer()}</div>}
      </div>
    );
  },
});
</script>

<style lang="scss">
$namespace: vben;
$prefix-cls: $namespace + '-collapse-container';

.#{$prefix-cls} {
  background-color: hsl(var(--header));
  border-radius: 2px;
  transition: all 0.3s ease-in-out;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    border-bottom: 1px solid #d9d9d9;
  }

  &__footer {
    border-top: 1px solid #d9d9d9;
  }

  &__action {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
  }
}
</style>
