import './global.less';

import { Spin } from 'antd';
import React, { Suspense } from 'react';
import { AliveScope as KeepAliveLayout } from 'react-activation';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import RenderRouter from '@/components/common/RenderRouter';
import Authority from '@/layouts/Authority';
import routes from '@/routes/config';

const App = (props: any) => {
  return (
    <Suspense fallback={<Spin size="large" className="layout__loading" />}>
      <Authority>
        {/* <BrowserRouter>{renderRoutes(routes)}</BrowserRouter> */}
        <KeepAliveLayout>
          <RenderRouter {...props} />
        </KeepAliveLayout>
      </Authority>
    </Suspense>
  );
};

export default withRouter(App);
