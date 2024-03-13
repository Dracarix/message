import React, { FC, ReactNode } from 'react';
import './buttonStyle.scss'
interface buttonType  {
    children:ReactNode;
    className:string;
    onClick: () => void  ;
}
const NewButton:FC<buttonType> = ({children, className, onClick}) => {
  return (
    <button
        className={className}
        onClick={onClick}
    >
        {children}
    </button>
  );
};

export default NewButton;