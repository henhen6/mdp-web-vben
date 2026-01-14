<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { DocLayout } from '@vben/layouts';

const { replace } = useRouter();
function handleClickLogo() {
  replace({ path: '/welcome' });
}
</script>

<template>
  <DocLayout @click-logo="handleClickLogo" />
</template>
