import { useState } from 'react';
import {ReactComponent as MessIcon} from '../../svg/messages.svg';
import {ReactComponent as ProfileIcon} from '../../svg/profile.svg';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { closeMenu, openMenu } from 'store/menu.slice';
import { useLocation, useNavigate } from 'react-router-dom';

const MediaFooter = () => {
  const {needMenu} = useAppSelector((state) => state.useMenu);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const isMessagesPage = location.pathname === '/';
  const styleFooter  = {
    width: '100%',
    display:'flex',
    justifyContent:'space-around'
  }
  const handleMenu = () => {
    if( needMenu){
      dispatch(closeMenu())
    }else{
      dispatch(openMenu())
    }
  }
  return (
    <div style={styleFooter}>
      
        <MessIcon 
          onClick={()=> navigate('/')}
          className={`mess__icon ${isMessagesPage ? 'active' : ''}`}
        />
        <div className='profile__main'
          onClick={handleMenu}
        >

            <ProfileIcon className='profile__icon'/>



        </div>

    </div>
  );
};

export default MediaFooter;