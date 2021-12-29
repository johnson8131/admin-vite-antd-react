/**
 * 权限控制，在这里匹配后台权限
 **/
import iconList from './iconUtils';

// type 资源类型(1:导航 2:菜单 3:按钮)
// pic 用来存储最外层权限属于第几个用来匹配icon

interface MenuConfig {
  id: string;
  name: string;
  type: 1 | 2 | 3;
  icon?: JSX.Element;
  parent?: string;
  pic: number;
  children?: Array<MenuConfig>;
}

let allAuthorized: MenuConfig[] = [
  {
    id: 'index',
    name: '工作台',
    type: 2,
    pic: 0,
    children: [],
  },
  {
    id: 'sys',
    name: '企业管理',
    type: 1,
    pic: 1,
    children: [
      {
        id: 'home',
        name: 'Home',
        pic: 0,
        type: 2,
      },
      {
        id: 'demo',
        name: '测试',
        pic: 0,
        type: 2,
      },
      {
        id: 'about',
        name: '链属企业列表',
        pic: 0,
        type: 2,
      },
      {
        id: 'coreList',
        name: '核心企业列表',
        pic: 0,
        type: 2,
      },
    ],
  },
];

/**
 * 用来将后台传来的权限数据整合成为前台所需的格式
 * @params allAuthorized 后台传来的数据
 * 在权限数据上添加了父级标识用来给tabs切换时改变路由
 */
const changeMenuType = (allAuthorized: MenuConfig[]) => {
  return allAuthorized.map((item, index) => {
    if (item.children) {
      item.children.map((item2, index2) => {
        item2.parent = item.parent ? `${item.parent}/${item.id}` : item.id;
      });
      changeMenuType(item.children);
    }
    return { ...item, icon: iconList[item.pic] };
  });
};

const allMenu: MenuConfig[] = changeMenuType(allAuthorized);

/**
 * 这里的参数替换为后台传来的权限数据
 */
const authorizedMenu = changeMenuType(allAuthorized);

export { allMenu, authorizedMenu, MenuConfig };
