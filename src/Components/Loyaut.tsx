import { useAppSelector } from 'hooks/use-redux';
import { FC } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/use-auth';
import { IsModal } from './UI/isModal/isModal';
import { ProfileDownBlock } from './ProfileDownBlock';


const Layaut:FC = () => {
  const navigate = useNavigate();
  const {isAuth} = useAuth();

  const {isOpen} = useAppSelector((state) => state.isModalReduser);
  const handleBack = () => {
    navigate(-1)
  }

  
  
  return (
    <>
      <header className="App-header">
        <button
        title='Back'
        type='button'
        style={{backgroundColor: 'transparent',
         border: 'none', 
         padding: '20px 20px',
         color: 'inherit',
         display: 'flex', 
         justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={handleBack}
        > 
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="24" 
          width="12" 
          viewBox="0 0 256 512"
        >
          <path 
            fill="#999" 
            d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"
          />
        </svg>
      </button >
      {isAuth && <>
        
        <ProfileDownBlock/>
      </>}
      </header>
      {isOpen && <IsModal/>}
      <Outlet/>
    </>
  );
};

export {Layaut};