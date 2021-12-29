import { setRouterLoadingConfig } from '../helper';

export const LOGIN = '/user/login';
export const REGISTER = '/user/register';

export default setRouterLoadingConfig(
  [
    {
      path: LOGIN,
      component: 'User/Login',
      title: '登陆',
    },
    {
      path: REGISTER,
      component: 'User/Register',
      title: '注册',
    },
  ],
  {
    isFullScreen: true,
  },
);
