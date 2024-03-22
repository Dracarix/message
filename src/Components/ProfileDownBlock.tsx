import { SearchInput } from "./UI/Input/SearchInput"
import { ProfileButton } from "./UI/isModal/ProfileButton"
import { DeleteAcc } from "./deleteAcc"
import { getAuth, signOut } from "firebase/auth";
import { removeUser } from "store/users/user.slice";
import { IsLoadingMini } from "./UI/isLoading/isLoading";
import { useAppDispatch, useAppSelector } from "hooks/use-redux";
import { useMatch, useNavigate } from "react-router-dom";
import Theme from "./Theme/theme";
import '../styles/menu.scss';

const ProfileDownBlock = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const dispatch = useAppDispatch();
    const {loading, error} = useAppSelector((state)=> state.process);
    const match = useMatch("/search/:value");


    const singOutUser =  async () => {
        signOut(auth)
          .then(() => {
            dispatch(removeUser());
            navigate('login')
          }).catch((error) => {
            // Обработка ошибок при выходе
            console.error('Ошибка выхода:', error);
          });
        
    }


    return(
        <>{!match && 
        
         <SearchInput/>
        }
        {loading && <div style={{position: 'absolute', top: '10%',left: '50%'}}><IsLoadingMini/>
        </div>}
      {error && <div style={{position: 'absolute', top: '10%', backgroundColor: 'grey'}}><span>{error}</span>
        </div>}
        <ProfileButton>
        <ul className="profileButton" >

            
          <li className="list_menu">
            <button className='btnQuit' onClick={singOutUser}>
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
            <span style={{marginLeft: '8px'}}>
              Выйти
            </span>
            </button>
          </li>
          <li className="list_menu">
            <DeleteAcc />
          </li>
          <li className="list_menu">
            <Theme/>
          </li>
        </ul>   
        </ProfileButton>
            </>
    )
}

export {ProfileDownBlock}