import cn from 'classnames';
import { set } from './theme.slice';
import styles from '../../styles/theme.module.scss';
import '../../styles/menu.scss';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { useMediaQuery } from 'react-responsive';
import { LinkBtnTypes } from 'types/user';
import { FC } from 'react';

const Theme:FC<LinkBtnTypes> = ({ className = '', icon }) => {
  const theme = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const mediaWidth = useMediaQuery({maxWidth: 800});
const styleMain = {
  display:"flex" ,
  justifyContent: 'center',
  alignItems: 'center',
  border: 'none'
}
const iconFill = theme === 'light' ? '#fff' : '#000';

  const handleChange = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    dispatch(set(next));
  };


const textTheme = () => {
  if(theme === 'light'){
    return (
      <p style={{color:'#d5d5d5',marginLeft: '8px'}}>
          Тема: <span className='themeBtn' >Светлая</span>
        </p>
    )
  }else{
    return(
      <p style={{color:'#d5d5d5',marginLeft: '8px'}}>
            Тема: <span className='themeBtn'>Темная</span>
          </p>
    )
  }
} 


  return (
    <button
      style={styleMain}
      type="button"
      className={cn(
        className,
        styles.ThemeStyle,
        theme === 'light' ? String(styles.light) : String(styles.dark),
      )}
      onClick={handleChange}
    >
      {mediaWidth ?
      icon && 
        <div style={ styleMain}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 5.45455C7.49091 5.45455 5.45455 7.49091 5.45455 10C5.45455 12.5091 7.49091 14.5455 10 14.5455C12.5091 14.5455 14.5455 12.5091 14.5455 10C14.5455 7.49091 12.5091 5.45455 10 5.45455ZM0.909091 10.9091H2.72727C3.22727 10.9091 3.63636 10.5 3.63636 10C3.63636 9.5 3.22727 9.09091 2.72727 9.09091H0.909091C0.409091 9.09091 0 9.5 0 10C0 10.5 0.409091 10.9091 0.909091 10.9091ZM17.2727 10.9091H19.0909C19.5909 10.9091 20 10.5 20 10C20 9.5 19.5909 9.09091 19.0909 9.09091H17.2727C16.7727 9.09091 16.3636 9.5 16.3636 10C16.3636 10.5 16.7727 10.9091 17.2727 10.9091ZM9.09091 0.909091V2.72727C9.09091 3.22727 9.5 3.63636 10 3.63636C10.5 3.63636 10.9091 3.22727 10.9091 2.72727V0.909091C10.9091 0.409091 10.5 0 10 0C9.5 0 9.09091 0.409091 9.09091 0.909091ZM9.09091 17.2727V19.0909C9.09091 19.5909 9.5 20 10 20C10.5 20 10.9091 19.5909 10.9091 19.0909V17.2727C10.9091 16.7727 10.5 16.3636 10 16.3636C9.5 16.3636 9.09091 16.7727 9.09091 17.2727ZM4.53636 3.25455C4.18182 2.9 3.6 2.9 3.25455 3.25455C2.9 3.60909 2.9 4.19091 3.25455 4.53636L4.21818 5.5C4.57273 5.85455 5.15455 5.85455 5.5 5.5C5.84545 5.14545 5.85455 4.56364 5.5 4.21818L4.53636 3.25455ZM15.7818 14.5C15.4273 14.1455 14.8455 14.1455 14.5 14.5C14.1455 14.8545 14.1455 15.4364 14.5 15.7818L15.4636 16.7455C15.8182 17.1 16.4 17.1 16.7455 16.7455C17.1 16.3909 17.1 15.8091 16.7455 15.4636L15.7818 14.5ZM16.7455 4.53636C17.1 4.18182 17.1 3.6 16.7455 3.25455C16.3909 2.9 15.8091 2.9 15.4636 3.25455L14.5 4.21818C14.1455 4.57273 14.1455 5.15455 14.5 5.5C14.8545 5.84545 15.4364 5.85455 15.7818 5.5L16.7455 4.53636ZM5.5 15.7818C5.85455 15.4273 5.85455 14.8455 5.5 14.5C5.14545 14.1455 4.56364 14.1455 4.21818 14.5L3.25455 15.4636C2.9 15.8182 2.9 16.4 3.25455 16.7455C3.60909 17.0909 4.19091 17.1 4.53636 16.7455L5.5 15.7818Z"
              fill={iconFill}
            />
          </svg>
          {textTheme()}
        </div>
      

      : (
        <>
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
          {textTheme()}
        </>
      
      )}
    </button>
  );
}

export default Theme;
