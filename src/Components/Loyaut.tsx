import { useAppSelector } from 'hooks/use-redux';
import { FC, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/use-auth';
import { IsModal } from './UI/isModal/isModal';
import { ProfileDownBlock } from './ProfileDownBlock';
import ScrollTop from './scrollTop';
import { useMediaQuery } from 'react-responsive';
import MainLinkBtn from './mainLinkBtn';
import MediaHeader from './media-menu/MediaHeader';
import MediaFooter from './media-menu/MediaFooter';
import MediaMenu from './media-menu/menu';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../Components/media-menu/mediaMenu.scss';


const Layout: FC = () => {
  const { isAuth } = useAuth();
  const mediaWidth = useMediaQuery({maxWidth: 800});
  const { isOpen } = useAppSelector((state) => state.isModalReduser);
  const {needMenu} = useAppSelector((state) => state.useMenu);
  const menuRef = useRef(null);

  return (
    <>
    {isAuth &&
      <header className="App-header" id='header'>
        {!mediaWidth 
        ?(<>
          <MainLinkBtn/>
           <ProfileDownBlock />
        </>)
        :(<MediaHeader/>)
        }
        
      </header>
    }
      {isOpen && <IsModal />}
      <Outlet />
      {isAuth && <ScrollTop/>}
      {isAuth &&(
        mediaWidth &&(
          <footer className='App-footer' id='footer'>
            <MediaFooter/>
          </footer>
        )

      )}
          <CSSTransition
            timeout={5000} 
            classNames="open-menu" 
            in={needMenu}
            unmountOnExit 
          >
                <MediaMenu/>
          </CSSTransition>
    </>
  );
};

export { Layout };
