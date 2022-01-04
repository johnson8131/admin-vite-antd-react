import { Button, Card } from 'antd';
import React, { useState } from 'react';

import EditableTable from '../components/EditableTable';
import FuzzySearch from '../components/FuzzySearch';

const AbputPage = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <Card>About Page</Card>
      <FuzzySearch />
      cccccccccc
      <EditableTable />
      <br />
      <Button
        onClick={() => {
          let i = count + 1;
          console.log('ggg');
          setCount(i);
        }}
      >
        fffff
      </Button>{' '}
      count:{count}
    </>
  );
};

export default AbputPage;
