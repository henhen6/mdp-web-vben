<script lang="ts" setup>
import type { Oauth2Model } from '#/api/common/model/oauth2';

import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { useMessage } from '@vben/components/hooks';
import { preferences } from '@vben/preferences';

import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  Typography,
  TypographyParagraph,
  TypographyTitle,
} from 'ant-design-vue';

import { Oauth2Api } from '#/api/common/oauth2';

const { createMessage } = useMessage();
const appTitle = preferences.app.name;
const route = useRoute();
export interface State {
  appId: string;
  appVo: any;
  selectedScopeList: string[];
  scopeList: any[];
  user: any;
  oauth2Param: Oauth2Model.ConfirmDto;
}

const state = reactive<State>({
  appId: route.query.client_id as string, // 客户端id
  appVo: {}, // 应用信息
  selectedScopeList: [], // 已经勾选的权限列表
  scopeList: [], // 权限信息列表
  oauth2Param: route.query as unknown as Oauth2Model.ConfirmDto, // 授权参数,
  user: {}, // 当前用户信息
});

onMounted(async () => {
  await getConfirmInfo();
});

async function getConfirmInfo() {
  const res = await Oauth2Api.getConfirmInfo(state.oauth2Param);
  state.appVo = res.appVo;
  state.selectedScopeList = res.scopes;
  state.scopeList = res.scopeList;
  state.user = res.user;
}

async function handleConfirm() {
  const param: Oauth2Model.ConfirmDto = {
    client_id: state.oauth2Param.client_id,
    scope: state.selectedScopeList.join(','),
    build_redirect_uri: true,
    response_type: state.oauth2Param.response_type,
    redirect_uri: state.oauth2Param.redirect_uri,
    state: state.oauth2Param.state,
  };
  const res = await Oauth2Api.confirm(param);
  createMessage.success('授权成功，即将跳转');
  setTimeout(() => {
    location.href = res.redirect_uri;
  }, 1000);
}
function handleReject() {
  const errorUri = 'error=access_denied&error_description=用户拒绝了请求';
  location.href = state.oauth2Param.redirect_uri.includes('?')
    ? `${state.oauth2Param.redirect_uri}&${errorUri}`
    : `${state.oauth2Param.redirect_uri}?${errorUri}`;
}
</script>

<template>
  <div>
    <Flex>
      <Flex justify="space-between">
        <img
          alt="avatar"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          :style="{ display: 'block', width: '100px' }"
        />
        <Flex
          align="flex-end"
          justify="space-between"
          :style="{ padding: '2px' }"
        >
          <Typography>
            <TypographyTitle>
              {{ state.appVo.name }}
            </TypographyTitle>
            <TypographyParagraph>
              {{ state.appVo.intro }}
            </TypographyParagraph>
          </Typography>
        </Flex>
      </Flex>
    </Flex>
    <Divider />
    <div>
      使用 {{ appTitle }} 账号访问
      <Button type="link" :href="state.appVo.homeUrl" target="_blank">
        {{ state.appVo.name }}
      </Button>
      ，并允许ta获得以下权限：
    </div>
    <CheckboxGroup v-model:value="state.selectedScopeList" class="mt-4">
      <ul>
        <li v-for="item in state.scopeList" :key="item.code" class="">
          <Checkbox :value="item.code">
            <span class="mr-2">{{ item.code }} </span>
            <span>{{ item.confirmPrompt }}</span>
          </Checkbox>
        </li>
      </ul>
    </CheckboxGroup>
    <Flex wrap="wrap" gap="small" class="mt-4">
      <Button @click="handleConfirm" type="primary">同意授权</Button>
      <Button @click="handleReject">拒绝</Button>
    </Flex>
    <Flex wrap="wrap" gap="small" class="mt-4">
      你可以随时在 帐号设置 > 第三方应用 中取消你的授权
    </Flex>
  </div>
</template>

<style lang="less" scoped></style>
