<script setup lang="ts">
import { maskPhone } from '@vben/utils';

// 引入 Antd Card 组件（核心新增）
import { Button, Card } from 'ant-design-vue';

import { $t } from '#/locales';

import { useForm } from '../data/phone';

const { Form, state, userStore, handleToggleForm, handleSubmit } = useForm();
</script>
<template>
  <Card hoverable bordered :head-style="{ padding: '12px' }" size="small">
    <!-- Card 标题区：title + extra（修改按钮） -->
    <template #title>
      <div class="flex flex-col">
        <h2 class="text-xl font-medium">手机号</h2>
        <p class="mt-1 text-sm">用于登录验证、安全通知、密码找回</p>
      </div>
    </template>
    <!-- Card 右上角操作区（修改/未开通按钮） -->
    <template #extra>
      <Button type="primary" @click="handleToggleForm">
        {{
          state.isFormShow
            ? $t('common.title.cancel')
            : $t('common.title.update')
        }}
      </Button>
    </template>

    <!-- Card 主体内容区 -->
    <div class="p-0">
      <!-- 脱敏信息展示 -->
      <div v-if="!state.isFormShow">
        <p class="text-gray-700">{{ maskPhone(userStore.userInfo?.phone) }}</p>
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
