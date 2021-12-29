/**
 * 默认中台模版 登录后layout
 */

import './basicLayout.less';

import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { LayoutStateType } from '@store/models/layout';
import { Layout, Menu } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import { DispatchProp } from 'react-redux';

import Authorized from '@/components/Authorized';
import Footer from '@/components/Footer';
import TabsMenu from '@/components/TabsMenu';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

interface Props {
  children: React.ReactNode;
  layout: LayoutStateType;
  dispatch: DispatchProp;
  pageProps: any;
}

const mapStateToProps = ({ layout }: any) => ({ layout });

const TabLayout: React.FC<Props> = (props) => {
  const { children, layout, dispatch, pageProps } = props;

  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const headerMenu = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;

    if (key === 'logout') {
      props.history.push('/user/login');
    }
  };

  return (
    <Layout className="layout_page">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Authorized {...props} dispatch={dispatch} />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
          })}
          <Menu mode="horizontal" className="right_user" onClick={headerMenu}>
            <SubMenu title="1573594251">
              <Menu.Item key="logout" icon={<LogoutOutlined />}>
                退出登录
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Header>

        <Content
          style={{
            margin: '4px 0px',
            minHeight: 280,
          }}>
          {/*
            需要多标签展示页面带有状态保存
            */}

          <TabsMenu {...props} layoutData={layout} dispatch={dispatch}>
            <div> {children} </div>
          </TabsMenu>
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default connect(mapStateToProps)(TabLayout);
