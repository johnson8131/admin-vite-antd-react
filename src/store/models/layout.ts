//import { history, dropByCacheKey } from 'umi';
import { Effect } from 'dva';
import { Reducer } from 'redux';

export interface MenuListType {
  name: string;
  id: string;
  parent: string;
  icon?: JSX.Element;
  path: string;
}

export interface LayoutStateType {
  tabMenuList: MenuListType[];
}
export interface ConnectState {
  layout: LayoutStateType;
}

export interface LayoutModelType {
  namespace: string;
  state: LayoutStateType;
  effects: {
    addTabsMenuList: Effect;
    removeTabsMenuList: Effect;
  };
  reducers: {
    setTabsMenuList: Reducer<LayoutStateType>;
    deleteTabsMenuList: Reducer<LayoutStateType>;
  };
}

const layout: LayoutModelType = {
  namespace: 'layout',
  state: {
    tabMenuList: [],
  },
  reducers: {
    setTabsMenuList(state: any, { payload: { data } }: any) {
      let newTabMenuList = [...state.tabMenuList];
      if (!newTabMenuList.some((item) => item.id === data.id)) {
        newTabMenuList = [...state.tabMenuList, data];
      }
      return { ...state, tabMenuList: newTabMenuList };
    },
    deleteTabsMenuList(state: any, { payload: { data } }: any) {
      let newTabMenuList = state.tabMenuList.filter(
        (item: MenuListType, index: number) => {
          let path = item.parent ? `${item.parent}/${item.id}` : item.id;
          return path !== data;
        },
      );
      return { ...state, tabMenuList: newTabMenuList };
    },
  },
  effects: {
    *addTabsMenuList({ payload }: any, { call, put }: any) {
      yield put({
        type: 'setTabsMenuList',
        payload: {
          data: payload,
        },
      });
    },
    *removeTabsMenuList({ payload }: any, { call, put, select }: any) {
      yield put({
        type: 'deleteTabsMenuList',
        payload: {
          data: payload.targetKey,
        },
      });

      // 获取tabMenuList关闭一个tab页后，tabMenuList的最后一项
      const nowTabMenuPath: string = yield select((state: ConnectState) => {
        let tabMenuList = state.layout.tabMenuList[state.layout.tabMenuList.length - 1];
        if (!tabMenuList) {
          return;
        }
        let nowPath = tabMenuList.parent
          ? `${tabMenuList.parent}/${tabMenuList.id}`
          : tabMenuList.id;
        if (nowPath === 'index') {
          nowPath = '';
        }
        return nowPath;
      });

      let nowPath = location.pathname.substr(1);

      // 关闭tabs页面时也取消该页面的状态保存
      const clearCache = (path: string) => {
        // 需要将所有路由改为小写 因为keepAlive 将pathname都做了小写转换
        const loserCasePath = path.toLowerCase();
        //dropByCacheKey(`/${loserCasePath}`);
      };
      clearCache(nowPath);

      // 如果关闭的是当前打开的页面，则切换路由为当前打开所有可切换页面的最后一个
      // 如果关闭的页面不是当前打开的页面则不切换路由
      if (!nowPath) {
        // 页面为首页时
        nowPath = 'index';
      }

      if (nowPath === payload.targetKey) {
        payload.history.push(`/${nowTabMenuPath}`);
      }
    },
  },
};

export default layout;
