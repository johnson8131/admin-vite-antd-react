import { Layout } from 'antd';
import React from 'react';
import { renderRoutes } from 'react-router-config';

import { IRouteConfig } from '@/routes/config';

import MyHeader from '../../components/Header';
import MyMenu from '../../components/Menu';

const { Content } = Layout;

const BasicLayout: React.FC<{ route: IRouteConfig }> = ({ children }) => {
  console.log('routewwwwwwwwwww', children);
  return (
    <Layout>
      <MyMenu />
      <Layout>
        <MyHeader />
        <Content style={{ height: 'calc(100vh - 60px)' }}>
          {children}
          {/* {renderRoutes(route.routes)} */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
