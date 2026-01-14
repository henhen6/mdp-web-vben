<script setup lang="ts">
import { FileUpload } from '../../form';

defineOptions({
  inheritAttrs: false,
});
defineProps({
  objectId: {
    type: String,
    required: true,
  },
  objectType: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <FileUpload :object-id="objectId" :object-type="objectType" view />
</template>
