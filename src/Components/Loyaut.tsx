import { useAppSelector } from 'hooks/use-redux';
import { FC, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/use-auth';
import { IsModal } from './UI/isModal/isModal';
import { ProfileDownBlock } from './ProfileDownBlock';
import ScrollTop from './scrollTop';
import BackBtn from './BackBtn';
import { useMediaQuery } from 'react-responsive';


const Layout: FC = () => {
  const { isAuth } = useAuth();
  const [mediaHeader , setMediaHeader] = useState(false);
  const mediaWidth = useMediaQuery({maxWidth: 800});
  const { isOpen } = useAppSelector((state) => state.isModalReduser);

  return (
    <>
      <header className="App-header" id='header'>
        {!mediaWidth 
        ?(<>
          <BackBtn/>
          {isAuth && <ProfileDownBlock />}
        </>)
        :('')
        }
        
      </header>
      {isOpen && <IsModal />}
      <Outlet />
      {isAuth && <ScrollTop/>}
    </>
  );
};

export { Layout };
