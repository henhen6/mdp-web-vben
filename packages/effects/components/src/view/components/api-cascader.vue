<script lang="ts" setup>
import ApiSelect from './api-select.vue';

withDefaults(
  defineProps<{
    childrenField?: string;
    labelField?: string;
    valueField?: string;
  }>(),
  {
    labelField: 'name',
    valueField: 'id',
    childrenField: 'children',
  },
);
</script>
<template>
  <ApiSelect
    :label-field="labelField"
    :value-field="valueField"
    :children-field="childrenField"
  />
</template>
