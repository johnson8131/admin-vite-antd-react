// vite-plugin-imp、vite-plugin-style-import
// 两款按需加载都存在部分问题，目前先按照全局引入
// 引入 less 文件，使vite的配置可以替换主题
import 'antd/dist/antd.less';

import history from '@scripts/history';
import global from '@store/models/global';
import layout from '@store/models/layout';
import dva from 'dva';
import createLoading from 'dva-loading';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, HashRouter } from 'react-router-dom';

import App from './App';

const appDva = dva({ history });
appDva.use(createLoading());
appDva.model(global);
appDva.model(layout);
//const { isProd } = window.g_config;
const isProd = false;
export const ModeRouter: React.FC = ({ children }) =>
  isProd ? <HashRouter>{children}</HashRouter> : <Router>{children}</Router>;

appDva.router((props) => {
  return (
    <ModeRouter>
      {/* <ThemeProvider> */}
      <StrictMode>
        <App {...props} />
      </StrictMode>
      {/* </ThemeProvider> */}
    </ModeRouter>
  );
});
//appDva.start('#root');
ReactDOM.render(<div>{appDva.start()()}</div>, document.getElementById('root'));
// StrictMode 开启react严格模式
// ReactDOM.render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
//   document.getElementById('root'),
// );
