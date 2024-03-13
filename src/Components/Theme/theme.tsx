import React, { useEffect } from 'react';
import cn from 'classnames';
import { set } from './theme.slice';
import styles from '../../styles/theme.module.scss';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';

interface ThemeProps {
  // eslint-disable-next-line react/require-default-props
  className?: string;
}
function Theme({ className = '' }: ThemeProps) {
  const theme = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();


  const handleChange = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    dispatch(set(next));
  };

  return (
    <button
      style={{display:"flex" ,justifyContent: 'center',alignItems: 'center',border: 'none'}}
      type="button"
      className={cn(
        className,
        styles.ThemeStyle,
        theme === 'light' ? String(styles.light) : String(styles.dark),
      )}
      onClick={handleChange}
    >
      <div>
      <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
          <g fill="#71aaeb">
            <path d="M10.8 6.05a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0zm3.65 2.15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM4.3 9.45a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0zM7.85 4.8a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z">
            </path>
        <path clip-rule="evenodd" d="M14.18 14.04c2.14.23 4.32-.75 4.32-4.04A8.47 8.47 0 0 0 10 1.5 8.47 8.47 0 0 0 1.5 10a8.47 8.47 0 0 0 8.5 8.5c1.13 0 2.25-1 1.98-2.43l-.17-.68c-.25-.94-.43-1.6 1.08-1.49l1.29.14zm.16-1.5-.25-.02-1.1-.12a3.34 3.34 0 0 0-1.74.27 2 2 0 0 0-1.1 1.68 3.8 3.8 0 0 0 .22 1.47l.14.54c.02.13 0 .22 0 .28a.44.44 0 0 1-.1.17.57.57 0 0 1-.41.19 6.97 6.97 0 0 1-7-7 6.97 6.97 0 0 1 7-7 6.97 6.97 0 0 1 7 7c0 1.3-.41 1.87-.77 2.15-.42.32-1.07.48-1.9.4z" fill-rule="evenodd">
        </path>
        </g>        
        </svg>
        </div>
      {theme === 'light' ? (

        <p style={{color:'#d5d5d5',marginLeft: '8px'}}>
          Тема: <span className='themeBtn' >Светлая</span>
        </p>
        
        ) : (
          <p style={{color:'#d5d5d5',marginLeft: '8px'}}>
            Тема: <span className='themeBtn'>Темная</span>
          </p>
        )}
    </button>
  );
}

export default Theme;
