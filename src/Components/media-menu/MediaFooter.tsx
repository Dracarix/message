import {ReactComponent as MessIcon} from '../../svg/messages.svg';
import {ReactComponent as ProfileIcon} from '../../svg/profile.svg';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { closeMenu, openMenu } from 'store/menu.slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { removeSelectMess } from 'store/users/deleteMess';

const MediaFooter = () => {
  const {needMenu} = useAppSelector((state) => state.useMenu);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const isMessagesPage = location.pathname === '/message/';
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
          onClick={()=> {
            dispatch(removeSelectMess())
            navigate('/message/')
          }}
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