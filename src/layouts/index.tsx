import history from '@scripts/history';
import React, { useEffect } from 'react';

import { getLocalStorage, getSessionStorage } from '@/untils/stroge';

import BasicLayout from './BasicLayout';
import LoginLayout from './LoginLayout';

interface Props {
  location: Location;
}

const Layouts: React.FC<Props> = (props) => {
  const { children, location } = props;

  const storageData = getSessionStorage() || getLocalStorage();

  useEffect(() => {
    if (!storageData) {
      history.push('/user/login');
    }
  }, []);

  let nowPathname = location.pathname.split('/');

  if (!storageData || nowPathname[1] === 'user') {
    return <LoginLayout {...props} />;
  }

  return <BasicLayout {...props} pageProps={props} />;
};

export default Layouts;
