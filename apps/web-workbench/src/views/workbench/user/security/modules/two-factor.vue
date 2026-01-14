<script setup lang="ts">
// 引入 Antd Card 组件（核心新增）
import { Button, Card } from 'ant-design-vue';

import { $t } from '#/locales';

import { useForm } from '../data/two-factor';

const { Form, state, handleSubmit } = useForm();
</script>
<template>
  <Card hoverable bordered :head-style="{ padding: '12px' }" size="small">
    <!-- Card 标题区：title + extra（修改按钮） -->
    <template #title>
      <div class="flex flex-col">
        <h2 class="text-xl font-medium">双因素认证</h2>
        <p class="mt-1 text-sm">开启后，登录时需要输入短信验证码</p>
      </div>
    </template>
    <!-- Card 右上角操作区（修改/未开通按钮） -->
    <template #extra>
      <Button type="primary" disabled> 敬请期待 </Button>
    </template>

    <!-- Card 主体内容区 -->
    <div class="p-0">
      <!-- 脱敏信息展示 -->
      <div v-if="!state.isFormShow">
        <p class="text-gray-700">敬请期待...</p>
      </div>

      <!-- 表单区域：展开时显示，仅列内撑开 -->
      <div v-else>
        <Form />

        <div class="text-right">
          <!-- 核心：text-right 让行内元素居右 -->
          <Button
            :loading="state.btnLoading"
            type="primary"
            @click="handleSubmit"
          >
            {{ $t('common.title.update') }}
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>
