import { setRouterLoadingConfig } from '../helper';
import mainRouters, { HOME } from './mainRouters';
import userRouters from './userRouters';

export * from './mainRouters';
export * from './userRouters';

const router = setRouterLoadingConfig(
  [
    // user
    {
      path: '/user',
      component: 'layouts/Mine',
      //component_from: 'components',
      routes: userRouters,
    },
    //main
    {
      path: HOME,
      //component: 'BasicLayout',  //普通布局
      component: 'TabLayout', //有功能菜单用tab展示的布局
      component_from: 'layouts',
      title: '系统路由',
      //redirect: '/sys/home',
      routes: mainRouters,
    },
  ],
  {
    isFullScreen: true,
  },
);

/**
 * 路径全部使用小写
 * @param {IRouteItemMinor[]} data
 * @returns
 */
const toLowerCaseRouterPath = (data: IRouteItemMinor[]) =>
  data.map((v) => {
    if (v.routes) {
      v.routes = toLowerCaseRouterPath(v.routes);
    }
    v.path = (v.path || '').toLowerCase();
    return v;
  });

export default toLowerCaseRouterPath(router);
