<script setup lang="ts">
interface Props {
  value?: any;
}
defineProps<Props>();
</script>
<template>
  <p class="text-sm">{{ value }}</p>
</template>
