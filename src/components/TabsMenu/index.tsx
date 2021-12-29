/**
 * 该文件用来设置多标签页切换
 */
import './tabsMenu.less';

import { LayoutStateType } from '@store/models/layout';
import { Layout, Tabs } from 'antd';
import React, { useState } from 'react';
import { useAliveController } from 'react-activation';
import { DispatchProp } from 'react-redux';

import NotPage from '@/pages/NoFond';

const { Content } = Layout;

const { TabPane } = Tabs;

interface Props {
  layoutData: LayoutStateType;
  dispatch: DispatchProp;
  children: any;
}

const TabsMenu: React.FC<Props> = (props) => {
  const { children, layoutData, dispatch, history } = props;
  const [activeKey, setActiveKey] = useState('');
  const { getCachingNodes, drop, refresh } = useAliveController();
  const cachingNodes = getCachingNodes();
  console.log('ffffffffffffff', cachingNodes);

  const { tabMenuList } = layoutData;

  const callback = (key: string) => {
    if (key === 'index') {
      key = '';
    }
    history.push(`/${key}`);
    setActiveKey(key);
  };

  const onEdit = (
    targetKey:
      | string
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>,
    action: 'add' | 'remove',
  ) => {
    // [action](targetKey); 因为只有删除功能就直接调用了
    remove(targetKey);
  };

  const remove = (
    targetKey:
      | string
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>,
  ) => {
    setActiveKey('');
    drop(`/${history.location.pathname.substr(1)}`); //删除tab页面的缓存
    dispatch({
      type: 'layout/removeTabsMenuList',
      payload: { targetKey, history },
    });
  };

  const TabPaneList = tabMenuList.map((item, index) => {
    if (!item) {
      return <TabPane key={'404'} tab={<span>{'404'}</span>} />;
    }
    let key = item.parent ? `${item.parent}/${item.id}` : item.id;
    return (
      <TabPane
        key={key}
        tab={
          <span>
            {item.icon}
            {item.name}
          </span>
        }
      />
    );
  });

  let defaultActiveKey = history.location.pathname.substr(1);

  defaultActiveKey = defaultActiveKey ? defaultActiveKey : 'index';

  return (
    <div>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        activeKey={activeKey ? activeKey : defaultActiveKey}
        onChange={callback}
        onEdit={onEdit}
        type={tabMenuList.length === 1 ? 'card' : 'editable-card'}
        hideAdd={true}
        animated={true}
        className="tabs_menu">
        {TabPaneList}
      </Tabs>
      {tabMenuList.length ? (
        <Content className="tabsMenu_content">{children}</Content>
      ) : (
        <div className="tabsMenu_content_notPage">
          <NotPage />
        </div>
      )}
    </div>
  );
};

export default TabsMenu;
