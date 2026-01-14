<script lang="tsx">
import type { CSSProperties, PropType } from 'vue';

import { computed, defineComponent, unref } from 'vue';

import { useNamespace } from '@vben/hooks';
import { isArray, isString } from '@vben/utils';

import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';

import { getPopupContainer } from '../../utils';
import { getSlot } from '../../utils/helper';

const props = {
  /**
   * Help text max-width
   * @default: 600px
   */
  maxWidth: { type: String, default: '600px' },
  /**
   * Whether to display the serial number
   * @default: false
   */
  showIndex: { type: Boolean },
  /**
   * Help text font color
   * @default: #ffffff
   */
  color: { type: String, default: '#ffffff' },
  /**
   * Help text font size
   * @default: 14px
   */
  fontSize: { type: String, default: '14px' },
  /**
   * Help text list
   */
  placement: { type: String, default: 'right' },
  /**
   * Help text list
   */
  text: { type: [Array, String] as PropType<string | string[]> },
};

export default defineComponent({
  name: 'BasicHelp',
  components: { Tooltip },
  props,
  setup(props, { slots }) {
    const { b, e } = useNamespace('basic-help');

    const getTooltipStyle = computed(
      (): CSSProperties => ({ color: props.color, fontSize: props.fontSize }),
    );

    const getOverlayStyle = computed(
      (): CSSProperties => ({ maxWidth: props.maxWidth }),
    );

    function renderTitle() {
      const textList = props.text;

      if (isString(textList)) {
        return <p>{textList}</p>;
      }

      if (isArray(textList)) {
        return textList.map((text, index) => {
          return (
            <p key={text}>
              <>
                {props.showIndex ? `${index + 1}. ` : ''}
                {text}
              </>
            </p>
          );
        });
      }
      return null;
    }

    return () => {
      return (
        <Tooltip
          autoAdjustOverflow={true}
          getPopupContainer={() => getPopupContainer()}
          overlayClassName={e('wrap')}
          overlayStyle={unref(getOverlayStyle)}
          placement={props.placement as 'right'}
          title={<div style={unref(getTooltipStyle)}>{renderTitle()}</div>}
        >
          <span class={b()}>{getSlot(slots) || <InfoCircleOutlined />}</span>
        </Tooltip>
      );
    };
  },
});
</script>
<style lang="scss">
$namespace: vben;
$prefix-cls: $namespace + '-basic-help';

.#{$prefix-cls} {
  display: inline-block;
  margin-left: 6px;
  font-size: 14px;
  color: hsl(var(--base-text-color));
  cursor: pointer;

  &:hover {
    color: hsl(var(--primary));
  }

  &__wrap {
    p {
      margin-bottom: 0;
    }
  }
}
</style>
