<script setup lang="ts">
import type { LoginLogType } from '#/api/workbench/user/loginLog/model';

import { Codemirror } from 'vue-codemirror';

import { JsonViewer } from '@vben/common-ui';
import { ApiDict } from '@vben/components/view';
import { $t } from '@vben/locales';

import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { Tooltip, TypographyParagraph } from 'ant-design-vue';

import { DictUniqKey } from '#/enums/dict';

// 注册Antd Tooltip组件
defineProps<{
  // 接收登录日志单行数据
  row: LoginLogType.LoginLogVo;
}>();
const logExtensions = [java(), oneDark];
</script>
<template>
  <div class="login-log-card rounded-lg shadow-sm">
    <!-- 登录日志信息容器：Flex 4列布局，自动换行，响应式适配 -->
    <div class="-mx-2 flex flex-wrap">
      <!-- 第1列：姓名 -->
      <div class="w-1/4 min-w-[200px] px-1 py-1.5">
        <div class="log-item">
          <span class="label font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.name') }}：
          </span>
          <span class="value text-gray-800">{{ row.name || '-' }}</span>
        </div>
      </div>

      <!-- 第2列：账号 -->
      <div class="w-1/4 min-w-[200px] px-1 py-1.5">
        <div class="log-item">
          <span class="label font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.account') }}：
          </span>
          <TypographyParagraph
            class="value inline-block"
            :style="{ maxWidth: 'calc(100% - 80px)', marginBottom: 0 }"
            :copyable="{ tooltip: false }"
          >
            {{ row.account || '-' }}
          </TypographyParagraph>
        </div>
      </div>

      <!-- 第3列：认证方式 -->
      <div class="w-1/4 min-w-[200px] px-1 py-1.5">
        <div class="log-item">
          <span class="label font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.authType') }}：
          </span>
          <span class="value text-gray-800">
            <ApiDict
              :value="row.authType"
              :type="DictUniqKey.workbench.loginLog.authType"
            />
          </span>
        </div>
      </div>

      <!-- 第4列：登录渠道 -->
      <div class="w-1/4 min-w-[200px] px-1 py-1.5">
        <div class="log-item">
          <span class="label font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.loginChannel') }}：
          </span>
          <span class="value text-gray-800">
            <ApiDict
              :value="row.loginChannel"
              :type="DictUniqKey.workbench.loginLog.loginChannel"
            />
          </span>
        </div>
      </div>

      <!-- 第5列：浏览器名称 -->
      <div class="w-1/4 min-w-[200px] px-1 py-1.5">
        <div class="log-item">
          <span class="label font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.browserName') }}：
          </span>
          <span class="value text-gray-800">{{ row.browserName || '-' }}</span>
        </div>
      </div>

      <!-- 第6列：浏览器版本 -->
      <div class="w-1/4 min-w-[200px] px-1 py-1.5">
        <div class="log-item">
          <span class="label font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.browserVersion') }}：
          </span>
          <span class="value text-gray-800">{{
            row.browserVersion || '-'
          }}</span>
        </div>
      </div>

      <!-- 第7列：AppKey -->
      <div class="w-1/4 min-w-[200px] px-1 py-1.5">
        <div class="log-item">
          <span class="label font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.appKey') }}：
          </span>
          <TypographyParagraph
            class="value inline-block"
            :style="{ maxWidth: 'calc(100% - 80px)', marginBottom: 0 }"
            :copyable="{ tooltip: false }"
          >
            {{ row.appKey || '-' }}
          </TypographyParagraph>
        </div>
      </div>

      <!-- 第8列：App名称 -->
      <div class="w-1/4 min-w-[200px] px-1 py-1.5">
        <div class="log-item">
          <span class="label font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.appName') }}：
          </span>
          <span class="value text-gray-800">{{ row.appName || '-' }}</span>
        </div>
      </div>

      <!-- 第9列：UA信息（长文本）- 跨2列展示，提升可读性 -->
      <div class="w-1/2 min-w-[400px] px-1 py-1.5">
        <div class="log-item long-text-item">
          <span class="label mb-1 block font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.ua') }}：
          </span>
          <Tooltip :title="row.ua || '-'">
            <Codemirror
              autofocus
              :extensions="logExtensions"
              indent-with-tab
              :style="{ height: '100px' }"
              :tab-size="2"
              :model-value="row.ua"
            />
          </Tooltip>
        </div>
      </div>

      <!-- 第10列：Token信息（长文本）- 跨2列展示 -->
      <div class="w-1/2 min-w-[400px] px-1 py-1.5">
        <div class="log-item long-text-item">
          <span class="label mb-1 block font-medium text-gray-600">
            {{ $t('workbench.user.loginLog.tokenInfo') }}：
          </span>
          <Tooltip :title="row.tokenInfo || '-'">
            <JsonViewer copyable boxed :value="row.tokenInfo || '{}'" />
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-log-card {
  // 响应式适配：小屏幕自动转为2列
  @media (max-width: 1200px) {
    .flex-wrap > div {
      width: 50% !important;
    }
  }

  // 超小屏幕单列展示
  @media (max-width: 768px) {
    .flex-wrap > div {
      width: 100% !important;
    }
  }

  :deep(.default-json-theme) {
    &.jv-container .jv-code {
      &.boxed:not(.open) {
        height: 100px;
      }
    }
  }

  .log-item {
    // 基础项样式
    .label {
      display: inline-block;
      min-width: 80px;
    }

    // 长文本项特殊样式
    &.long-text-item {
      .long-text-content {
        width: 100%;
        word-break: break-all; // 强制换行，避免英文长文本溢出
        transition: all 0.2s;

        &:hover {
          background-color: #f0f8ff; // hover时轻微高亮
        }
      }
    }
  }
}
</style>
