<script setup lang="ts">
import { Page } from '@vben/common-ui';

import Email from './modules/email.vue';
import Face from './modules/face.vue';
import Password from './modules/password.vue';
import Phone from './modules/phone.vue';
import TwoFactor from './modules/two-factor.vue';
</script>
<template>
  <Page
    title="安全设置"
    description="管理账号安全信息，定期更新可提升账号安全性"
  >
    <div class="mx-auto">
      <div
        class="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-2 md:gap-x-3 md:gap-y-3 lg:grid-cols-3"
      >
        <!-- 第一列 -->
        <div class="flex flex-col gap-2 md:gap-3">
          <!-- 手机号（第一列第一个） -->
          <Phone />
          <!-- 人脸识别（第一列第二个） -->
          <Face />
        </div>
        <div class="flex flex-col gap-2 md:gap-3">
          <!-- 邮箱（第二列第一个） -->
          <Email />
          <!-- 双因子验证（第二列第二个，扩展示例） -->
          <TwoFactor />
        </div>
        <div class="flex flex-col gap-2 md:gap-3">
          <!-- 密码（第三列第一个） -->
          <Password />
        </div>
      </div>
    </div>
  </Page>
</template>
