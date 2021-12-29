import React from 'react';

const Footer: React.FC<{}> = (props) => {
  return (
    <>
      <p
        style={{
          textAlign: 'center',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 20,
          padding: 20,
          zIndex: 999,
        }}>
        Copyright © 2020 ***技术部出品
      </p>
    </>
  );
};

export default Footer;
