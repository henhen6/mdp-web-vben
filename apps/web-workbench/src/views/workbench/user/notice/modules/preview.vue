<!-- 未完善 -->
<script setup lang="ts">
import type { AiEditorOptions } from 'aieditor';

import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

import { usePreferences } from '@vben/preferences';

import { AiEditor } from 'aieditor';

import 'aieditor/dist/style.css';

defineOptions({ name: 'AiEditorPreview' });
const props = defineProps<{
  modelValue: string;
  options?: AiEditorOptions;
}>();
const { isDark } = usePreferences();
const sidebarTheme = computed(() => {
  const dark = isDark.value;
  return dark ? 'dark' : 'light';
});
const aieditor = ref<AiEditor | null>(null);
const divRef = ref<any>();

const editorConfig = reactive<AiEditorOptions>({
  element: '',
  theme: sidebarTheme.value,
  placeholder: '请输入内容',
  content: '',
  editable: false,
});

const init = () => {
  aieditor.value?.destroy();
  aieditor.value = new AiEditor(editorConfig);
};
watch(
  () => props.modelValue,
  (value) => {
    if (value !== aieditor.value?.getHtml()) {
      editorConfig.content = value;
      init();
    }
  },
);

watch(
  () => sidebarTheme.value,
  (value) => {
    editorConfig.theme = value;
    init();
  },
);

// 挂载阶段
onMounted(() => {
  editorConfig.element = divRef.value;
  init();
});
// 销毁阶段
onUnmounted(() => {
  aieditor.value?.destroy();
});
</script>

<template>
  <div ref="divRef" class="editor-container">
    <div class="aie-container">
      <div class="aie-header-panel" style="display: none">
        <div class="aie-container-header"></div>
      </div>
      <div class="aie-main">
        <div class="aie-container-panel">
          <div class="aie-container-main"></div>
        </div>
      </div>
      <div class="aie-container-footer" style="display: none"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.editor-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.aie-header-panel {
  position: sticky;
  // top: 51px;
  z-index: 1;
}

.aie-header-panel aie-header > div {
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.aie-container {
  border: none !important;
}

.aie-container-panel {
  z-index: 99;
  box-sizing: border-box;
  width: calc(100% - 2rem - 2px);
  max-width: 826.77px;
  height: 100%;
  padding: 1rem;
  margin: 0 auto;
  overflow: auto;
  color: black;
  // background-color: var() rgba($color: var(--color-bg-1), $alpha: 100%);
  border: 1px solid hsl(var(--border));
}

.aie-main {
  position: relative;
  box-sizing: border-box;
  flex: 1;
  padding: 1rem 0;
  overflow: hidden;
  // background-color: red;
  background-color: hsl(var(--background));
}

.aie-directory {
  position: absolute;
  top: 30px;
  left: 10px;
  z-index: 0;
  width: 260px;
}

.aie-title1 {
  font-size: 14px;
  font-weight: 500;
}
</style>
