<script lang="ts" setup>
import { reactive, ref } from 'vue';

import SsoLogin from '../sso/login.vue';
import ConfirmScope from './confirm-scope.vue';

interface State {
  loginView: boolean;
}
const state = reactive<State>({
  loginView: false,
});
const formRef = ref();
const confirmScopRef = ref();
</script>

<template>
  <SsoLogin v-if="state.loginView" ref="formRef" />
  <ConfirmScope v-else ref="confirmScopRef" />
</template>
