import { getAuth, signOut } from "firebase/auth";
import { useAppDispatch } from "hooks/use-redux";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { closeMenu } from "store/menu.slice";
import { closeModal, openQuitAccount } from "store/processes/isModal";
import { ProcessDataSuccess } from "store/processes/process";
import { removeUser } from "store/users/user.slice";
import { LinkBtnTypes } from "types/user";

interface QuitTypes extends LinkBtnTypes {
    color: string,
}

const QuitAccBtn:FC<QuitTypes> = ({icon = false, color, className = ''}) => {
  const dispatch = useAppDispatch();
  
  const modalQuitAcc = () => {
    dispatch(openQuitAccount())
    dispatch(closeMenu())
  }
    return (
        <button className={`btnQuit ${className || ''}`} onClick={modalQuitAcc}>
            {icon &&
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                fill="#71aaeb" 
                viewBox="0 0 20 20">
                <path 
                    fill-rule="evenodd" 
                    d="M8.32 2h.93a.75.75 0 1 1 0 1.5h-.9c-1 0-1.7 0-2.24.04a2.9 2.9 0 0 0-1.1.26A2.75 2.75 0 0 0 3.8 5c-.13.25-.21.57-.26 1.11-.04.55-.04 1.25-.04 2.24v3.3c0 1 0 1.7.04 2.24.05.53.13.86.26 1.1A2.75 2.75 0 0 0 5 16.2c.25.13.57.21 1.11.26.55.04 1.25.04 2.24.04h.9a.75.75 0 0 1 0 1.5h-.93c-.96 0-1.72 0-2.33-.05a4.39 4.39 0 0 1-1.67-.41 4.25 4.25 0 0 1-1.86-1.86A4.38 4.38 0 0 1 2.05 14C2 13.4 2 12.64 2 11.68V8.32c0-.96 0-1.72.05-2.33.05-.63.16-1.17.41-1.67a4.25 4.25 0 0 1 1.86-1.86c.5-.25 1.04-.36 1.67-.41C6.6 2 7.36 2 8.32 2Zm5.9 4.97a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l1.22-1.22H8.75a.75.75 0 0 1 0-1.5h6.69l-1.22-1.22a.75.75 0 0 1 0-1.06Z" 
                    clip-rule="evenodd">

                </path>
                </svg>
            }
        <span 
        style={{
          marginLeft: '8px', 
          color: color, 
        }}>
          Выйти
        </span>
        </button>
    )
}

const QuitAccSystem = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const dispatch = useAppDispatch();

  const singOutUser = async () => {
      dispatch(closeModal());
      await signOut(auth)
      .then(() => {
        navigate('login')
        dispatch(removeUser());
        dispatch(closeMenu());
      }).catch((error: any) => {
        // Обработка ошибок при выходе
        
      });
      
  }
  const closeThisModal = () => {
    dispatch(closeModal());
    dispatch(ProcessDataSuccess());
  };
  return (
    <div 
    style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        paddingTop:20
      }}>
      Вы действительно хотите выйти?
      <div 
        style={{
          display:'flex', 
          justifyContent: 'space-around',
           width: '100%',
           marginTop: 12
        }}
      >
        <button 
          className="confirm__btn"
          style={{color: '#f80707',}}
          onClick={singOutUser}
        >
          Подтвердить
        </button>
        <button 
          className="confirm__btn"
          onClick={closeThisModal}
        >
          Отмена
        </button>
      </div>
    </div>
  )
}

export {QuitAccBtn, QuitAccSystem}