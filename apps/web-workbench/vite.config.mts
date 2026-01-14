import type { ConfigEnv, ProxyOptions } from 'vite';

import { defineConfig } from '@vben/vite-config';

import { consola } from 'consola';
import { loadEnv } from 'vite';

const httpsRE = /^https:\/\//;

interface ProxyTarget {
  // 被代理的接口前缀
  proxyKey: string;
  // 接口替换前
  rewriteAfter: string;
  // 接口替换后
  rewriteBefore: string;
  // 请求的后端地址
  target: string;
}

type ProxyTargetList = Record<string, ProxyOptions>;

function createProxy(proxyTargetList: ProxyTarget[]) {
  const ret: ProxyTargetList = {};

  for (const {
    proxyKey,
    rewriteAfter,
    rewriteBefore,
    target,
  } of proxyTargetList) {
    const isHttps = httpsRE.test(target);

    consola.log(
      '代理配置为：请求的URL前缀为[%s]开头的接口,[%s]被替换为[%s],并代理到后台地址：[%s]',
      proxyKey,
      rewriteBefore,
      rewriteAfter,
      target,
    );

    ret[proxyKey] = {
      changeOrigin: true,
      rewrite: (path) => {
        return path.replace(new RegExp(`^${rewriteBefore}`), `${rewriteAfter}`);
      },
      target,
      ws: true,
      ...(isHttps ? { secure: false } : {}),
    };
  }

  return ret;
}

function wrapperEnv(envConf: any) {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replaceAll(String.raw`\n`, '\n');
    if (realName === 'true') {
      realName = true;
    } else if (realName === 'false') {
      realName = false;
    }

    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }

    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replaceAll("'", '"'));
      } catch {
        realName = '';
      }
    }
    ret[envName] = realName;
  }
  return ret;
}

export default defineConfig(async (config: ConfigEnv | undefined) => {
  const { mode } = config as ConfigEnv;

  // eslint-disable-next-line n/prefer-global/process
  const root = process.cwd();

  const env = loadEnv(mode, root);

  const viteEnv = wrapperEnv(env);
  const { VITE_GLOB_MODE = 'cloud', VITE_PROXY } = viteEnv;

  return {
    application: {},
    vite: {
      server: {
        // 指定域名：在启动项目时，浏览器自动打开项目，以此域名来访问项目
        host: '127.0.0.1',
        // 允许在本地测试时使用什么 域名访问此项目
        allowedHosts: ['127.0.0.1', 'localhost'],
        proxy: createProxy(VITE_PROXY ? VITE_PROXY[VITE_GLOB_MODE] : []),
      },
    },
  };
});
