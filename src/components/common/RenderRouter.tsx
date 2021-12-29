import 'nprogress/nprogress.css';

//import '@styles/css/nprogress.css'
import RouteConfig from '@scripts/routers';
import { deepCopy, isFunction, toLowerCaseString } from '@scripts/utils';
import { Button } from 'antd';
import { DvaInstance } from 'dva';
import nprogress from 'nprogress';
import React, { Component, useRef } from 'react';
//import { isArray, isBoolean } from 'util'
import KeepAlive from 'react-activation';
import Loadable, { LoadingComponentProps } from 'react-loadable';
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';

import allModels from '@/store/models';

//import { catchErrorRecord } from '@components/high-order'
import LoadPage from './LoadPage';
//@(catchErrorRecord as any)
export class RouteWithSubRoutes extends Component<RouteProps> {
  constructor(props: RouteProps) {
    super(props);
    nprogress.start();
  }
  componentDidMount() {
    nprogress.done();
  }
  render() {
    const { path, exact, strict, render, ...rest } = this.props;
    return (
      <Route
        compo
        {...{
          path,
          exact,
          strict,
          ...(render && {
            render: (props) => render({ ...props, ...rest }),
          }),
        }}
      />
    );
  }
}

const LoadErrorComponent = () => {
  return (
    <div className="h-100" layout-align="space-between center">
      <div className="w-100 tc">
        <h2 className="highlight">页面加载失败!</h2>
        <a href={window.location.href}>
          <Button type="primary">请重试！</Button>
        </a>
      </div>
    </div>
  );
};

const Loading: React.FC<
  LoadingComponentProps & {
    loadingConfig?: TLoadingConfigProps;
  }
> = ({ error, loadingConfig = true }) => {
  if (error) {
    return <LoadErrorComponent />;
  }
  if (loadingConfig) {
    const { isFullScreen = false, customLoading = null } = loadingConfig
      ? {}
      : loadingConfig;
    return customLoading ? (
      <>{customLoading}</>
    ) : (
      <LoadPage size="large" isFullScreen={isFullScreen} />
    );
  }
  return null;
};

const hasModelExist = (app, model: string) =>
  app._models.some(({ namespace }) => Object.is(namespace, model));

/**
 * 引入model及加载组件
 * @param {Object} app (dva app)
 * @param {Function} component
 * @param {Array} models
 * @returns
 */
const wrapComptRender = (
  app: DvaInstance,
  component: Function,
  data: IRouteItemMinor,
) => {
  const { models, loadingConfig } = data;
  if (models && models.length) {
    models.forEach((item) => {
      //是否已经引入
      if (!hasModelExist(app, item)) {
        //console.log('jjjjjjjjjjj',allModels,allModels[item]);
        //app.model(require(`../../store/models/${item}`).default)
        app.model(allModels[item]);
      }
    });
  }
  // return Loadable({
  //   loading: props => <Loading loadingConfig={loadingConfig} {...props} />,
  //   delay: 200,
  //   timeout: 1000,
  //   loader: () => component()
  // })
  return component();
};

const afreshRawRouter = (app: DvaInstance): IRouteItemMinor[] => {
  const routerList = deepCopy(RouteConfig);
  const handleRoute = (routes: IRouteItemMinor[]) => {
    routes.forEach((item) => {
      const { routes, component, component_from, component_path } = item;
      if (routes) {
        handleRoute(routes);
      } else {
        item.exact = true;
      }
      item.path = toLowerCaseString(item.path);
      if (component) {
        if (!component_path) {
          item.component_path = component;
        }
        console.log(
          'uuuuuuuuu',
          `../../${component_from || 'pages'}/${item.component_path}`,
        );

        item.component = wrapComptRender(
          app,
          () =>
            React.lazy(
              () => import(`../../${component_from || 'pages'}/${item.component_path}`),
            ),
          item,
        );
      }
    });
  };
  handleRoute(routerList);
  return routerList;
};

const renderRoutes = (routes?: IRouteItemMinor[]) => {
  const tabMenuLayout = true;
  return routes ? (
    <Switch>
      {routes.map((route, index) => {
        const { key, path, redirect = '', exact, strict = true } = route;
        const onlyKey = key || index;
        const value = { key: onlyKey, exact, strict };
        if (route.redirect) {
          return (
            <Redirect
              {...{
                from: path,
                to: redirect,
                ...value,
              }}
            />
          );
        }
        console.log('eeeeeeeee', path, route);
        return (
          <RouteWithSubRoutes
            path={path}
            {...value}
            render={(props) => {
              const childRoutes = renderRoutes(route.routes);
              const LoadRouteComponent = route.component;
              if (LoadRouteComponent) {
                return (
                  <>
                    {tabMenuLayout ? (
                      <KeepAlive name={path}>
                        <LoadRouteComponent {...props} route={route}>
                          {childRoutes}
                        </LoadRouteComponent>
                      </KeepAlive>
                    ) : (
                      <LoadRouteComponent {...props} route={route}>
                        {childRoutes}
                      </LoadRouteComponent>
                    )}
                  </>
                );
              }
              return childRoutes;
            }}
          />
        );
      })}
    </Switch>
  ) : null;
};

const RenderRoute: React.FC<{
  app?: DvaInstance;
}> = ({ app }) => {
  const keepData = useRef({
    router: app ? afreshRawRouter(app) : [],
  });

  const { router } = keepData.current;
  //console.log('lllllll',renderRoutes(router),keepData);
  return renderRoutes(router);
};

export default RenderRoute;
