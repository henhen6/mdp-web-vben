<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue';

import { useVbenForm } from '@vben/common-ui';

import { Alert, Space, Spin, Tag } from 'ant-design-vue';

import { Description } from '../description';
import { useSchemaStore } from '../store/schema';
import { schemaToDetailForm } from '../utils/tool';

const props = defineProps({
  tableName: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  view: {
    type: Boolean,
    default: false,
  },
  addFieldPrefix: {
    // 追加字段前辍
    type: String,
    default: '',
  },
});
const schemaStore = useSchemaStore();
const schema = computed(() => {
  return schemaStore.getSchema(props.tableName);
});
const schemaDescItems = computed(() => {
  return schemaToDetailForm(schema.value, props.data);
});

const formObj = computed(() => {
  const [Form, api] = useVbenForm({
    showDefaultActions: false,
    ...schema.value,
  });
  return {
    form: Form,
    api,
  };
});
const tableNotExist = ref(false);
const cData = computed(() => {
  const newData: any = {};
  Object.keys(props.data || {}).forEach((key: string) => {
    // 如果key不以addFieldPrefix为前辍，则自动追加
    if (key.startsWith(props.addFieldPrefix)) {
      newData[key] = props.data[key];
    } else {
      newData[props.addFieldPrefix + key] = props.data[key];
    }
  });
  return newData;
});
watch(
  () => props.tableName,
  () => {
    tableNotExist.value = false;
    schemaStore.requestData(props.tableName).catch(() => {
      tableNotExist.value = true;
    });
  },
);
onMounted(() => {
  tableNotExist.value = false;
  schemaStore.requestData(props.tableName).catch(() => {
    tableNotExist.value = true;
  });
});
defineExpose({
  getForm() {
    return markRaw(formObj.value?.form);
  },
  getFormApi() {
    return formObj.value?.api;
  },
});
const spinning = computed(() => {
  if (tableNotExist.value) {
    return false;
  }
  return Object.keys(schema.value).length === 0;
});
</script>
<template>
  <div v-if="tableNotExist" class="table-not-exist">
    <Alert type="error" message="表单不存在！" show-icon>
      <template #description>
        <Space size="small" :split="true" direction="vertical">
          <Tag> 请检查流程设计是否正确！ </Tag>
        </Space>
      </template>
    </Alert>
  </div>
  <Spin :spinning="spinning" v-else>
    <div v-if="view" class="desc-wrap">
      <div v-for="item in schemaDescItems" :key="item.field" class="desc-card">
        <Description
          :data="cData"
          :label-style="{
            width: '120px',
          }"
          :schema="item.children"
          :title="schemaDescItems.length === 1 ? undefined : item.label"
        />
      </div>
    </div>
    <Spin v-else :spinning="spinning">
      <component :is="markRaw(formObj?.form)" />
    </Spin>
  </Spin>
</template>
<style scoped lang="less">
@import './styles/common-form.less';
@import './styles/common-detail.less';
</style>
