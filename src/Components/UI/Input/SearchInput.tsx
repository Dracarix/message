import React, { FC } from 'react';

interface InputProps {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}

const SearchInput:FC<InputProps> = ({value, onChange, onKeyDown}) => {
 

  return (
    <input 
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className='inputSearch'
     />
  );
};

export {SearchInput};