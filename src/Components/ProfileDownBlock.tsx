import { SearchInput } from "./UI/Input/SearchInput"
import { ProfileButton } from "./UI/isModal/ProfileButton"
import { DeleteAcc } from "./deleteAcc"
import { getAuth, signOut } from "firebase/auth";
import { removeUser } from "store/users/user.slice";
import { IsLoadingMini } from "./UI/isLoading/isLoading";
import { useAppDispatch, useAppSelector } from "hooks/use-redux";
import { useNavigate } from "react-router-dom";

const ProfileDownBlock = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const dispatch = useAppDispatch();
    const {loading, error} = useAppSelector((state)=> state.process);


    const singOutUser =  async () => {
        signOut(auth).then(() => {
          dispatch(removeUser());
          navigate('login')
        }).catch((error) => {
          // Обработка ошибок при выходе
          console.error('Ошибка выхода:', error);
        });
        
      }


    return(
        <>
         <SearchInput/>
        <ProfileButton>
        <div className="profileButton" >

            
      {loading && <div style={{position: 'absolute', top: '10%'}}><IsLoadingMini/>
        </div>}
      {error && <div style={{position: 'absolute', top: '10%', backgroundColor: 'grey'}}><span>{error}</span>
        </div>}
        <button style={{padding: "10px",width: '70px'}} onClick={singOutUser}>quit</button>
        <DeleteAcc />
        
              </div>   
        </ProfileButton>
            </>
    )
}

export {ProfileDownBlock}