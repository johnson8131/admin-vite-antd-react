import { Select, Spin } from 'antd';
import React, { useState, useRef,createRef, useMemo,MutableRefObject } from 'react';
import debounce from 'lodash/debounce';

function DebounceSelect({ fetchOptions, debounceTimeout = 500, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      showSearch
      showArrow={false}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect



const FuzzySearch = (props) => {
    const {onSelect,getData,mode,style} = props;
    const [value, setValue] = useState([]);
    const anchorListRef:MutableRefObject<any> = useRef({});//createRef()
    const mouseEnter=()=>{
      if(anchorListRef){
        anchorListRef.current.style.width='190px';
      }
    }
    const mouseLeave=()=>{
      if(anchorListRef){
        anchorListRef.current.style.width='12px';
      }
    }
    const anchorList =()=>{
      return (
        <div ref={anchorListRef} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}> ddd</div>
      );
    }
    async function fetchDataList(keyWord) {
        console.log('fetching data', keyWord);

        //return getData?getData(keyWord):[];  // [ {label:'sss' ,value: 'unitId' }]
        
        return fetch('https://randomuser.me/api/?results=5')
            .then((response) => response.json())
            .then((body) =>
            body.results.map((user) => ({
                label: `${user.name.first} ${user.name.last}`,
                value: user.login.username,
            })),
            );
    }

    return (
        <DebounceSelect
        mode={mode?mode:null}                 //"multiple |tag"
        value={value}
        allowClear
        placeholder="Select users"
        fetchOptions={fetchDataList}
        onChange={(newValue) => {
            setValue(newValue);
            console.log('ffffffffffffff',newValue)
            onSelect && onSelect(newValue); //{value: "yellowzebra972", label: "Bertold Glaser", key: "yellowzebra972"}
        }}
        style={style?style:{
            width: '100%',
        }}
        />
    );
};

export default FuzzySearch;
