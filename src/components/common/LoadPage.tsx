import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import classNames from 'classnames';
import React from 'react';
interface ILoadPage {
  isHide?: boolean;
  isFullScreen?: boolean;
  style?: React.CSSProperties;
  className?: string;
  size?: 'large';
  iconStyle?: React.CSSProperties;
}

const LoadPage: React.FC<ILoadPage> = ({
  isHide,
  isFullScreen,
  style = {},
  className = '',
  size,
  iconStyle,
  children,
}) => {
  const newIconStyle = iconStyle || {
    fontSize: Object.is(size, 'large') ? 40 : 24,
  };
  return (
    <div
      style={style}
      className={classNames(`tc ${className}`, {
        'load-container': isFullScreen,
        hide: isHide,
      })}>
      <Spin indicator={<LoadingOutlined style={newIconStyle} spin />} />
      {children}
    </div>
  );
};

LoadPage.defaultProps = {
  isHide: false,
  isFullScreen: false,
};

export default LoadPage;
