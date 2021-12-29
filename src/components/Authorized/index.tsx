/**
 *  该文件仅做导航栏路由展示使用
 **/

import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { DispatchProp } from 'react-redux';

import { allMenu, authorizedMenu, MenuConfig } from '@/utils/authorized';

const { SubMenu } = Menu;

interface Props {
  dispatch: DispatchProp;
}

const Authorized = (props: Props) => {
  const { dispatch, history } = props;
  const [nowTabPath, setNowTabPath] = useState(history.location.pathname);
  useEffect(() => {
    // 首次加载页面将当前路由所对应页面添加到多页tabMenuList中
    // 当检测到路由变化时将当前路由所对应页面添加到多页tabMenuList中
    let nowPath = history.location.pathname.substr(1);
    if (!nowPath) {
      nowPath = 'index';
    }
    // 获取当前路由对应的页面 some 可以直接跳出循环性能优化
    const getDefaultMenu = (authorizedMenu: MenuConfig[]) => {
      let nowTabsMenu: MenuConfig | undefined;
      authorizedMenu.some((item) => {
        let itemMenuPath = item.parent ? `${item.parent}/${item.id}` : item.id;
        if (itemMenuPath === nowPath) {
          nowTabsMenu = item;
          return true;
        } else if (!nowTabsMenu && item.children && item.children.length) {
          // 当外层没有匹配到并且还有子元素时再进行子级匹配
          nowTabsMenu = getDefaultMenu(item.children);
        }
      });
      return nowTabsMenu;
    };

    let data = getDefaultMenu(authorizedMenu);
    //console.log('33333333',location);
    setNowTabPath(nowPath);
    dispatch({
      type: 'layout/addTabsMenuList',
      payload: data,
    });
  }, [history.location.pathname, nowTabPath]);

  const renderMenu = (menu: MenuConfig) => {
    if (menu.type !== 2 && (!menu.children || !menu.children.length)) {
      // 类型为导航并且没有子菜单时不显示该项
      return null;
    }
    if (menu.children && menu.children.length) {
      return (
        <SubMenu key={menu.id} icon={menu.icon} title={menu.name}>
          {menu.children.map((item, index) => {
            return renderMenu(item);
          })}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={menu.id} icon={menu.icon}>
          {menu.name}
        </Menu.Item>
      );
    }
  };

  const MenuList = authorizedMenu
    .map((item, index) => {
      return renderMenu(item);
    })
    .filter((item) => item);

  const gotoPage = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    let { keyPath } = event;

    let path = keyPath.reverse().join('/');

    if (path === 'index') {
      path = '';
    }
    setNowTabPath(path);
    history.push(`/${path}`);
  };

  let defaultSelected = () => {
    // 获取默认选中菜单和默认打开的导航栏
    const pathArray = history.location.pathname.split('/');
    // 默认打开根目录菜单
    let defaultOpenKeys: string[] = pathArray
      .map((item, index) => {
        if (index === pathArray.length - 1 || index === 0) {
          return '';
        } else {
          return item;
        }
      })
      .filter((item) => item);

    let defaultSelected = pathArray[pathArray.length - 1];
    if (!defaultSelected) {
      defaultSelected = 'index';
    }
    let defaultSelectedKeys = [defaultSelected];
    return [defaultOpenKeys, defaultSelectedKeys];
  };

  const [defaultOpenKeys, defaultSelectedKeys] = defaultSelected();

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultOpenKeys={defaultOpenKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      selectedKeys={defaultSelectedKeys}
      onClick={gotoPage}>
      {MenuList}
    </Menu>
  );
};

export default Authorized;
