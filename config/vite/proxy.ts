/**
 * Proxy
 * 本地反向代理
 */
import type { ProxyOptions } from 'vite';

import { VITE_PROXY_HTTP } from '../constant';

type ProxyTargetList = Record<
  string,
  // eslint-disable-next-line no-unused-vars
  ProxyOptions & { rewrite?: (path: string) => string }
>;

const httpsRE = /^https:\/\//;

/**
 * Generate proxy
 * @param list
 */
export function createProxy() {
  const ProxyList: ProxyTargetList = {
    '/api': {
      target: VITE_PROXY_HTTP,
      changeOrigin: true,
      rewrite: (pre) => pre.replace(/^\/api/, ''), // 将 /api 重写为空
      // https is require secure=false
      ...(httpsRE.test(VITE_PROXY_HTTP) ? { secure: false } : {}),
    },
    '/foo': 'http://localhost:4567/foo',
    '^/fallback/.*': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/fallback/, ''), // 正则表达式写法
    },
  };
  return ProxyList;
}
