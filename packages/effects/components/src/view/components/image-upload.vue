<script setup lang="ts">
import { ImageUpload } from '../../form';

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
  <ImageUpload :object-id="objectId" :object-type="objectType" view />
</template>
