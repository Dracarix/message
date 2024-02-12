import { useState } from "react";
import { SearchInput } from "./UI/Input/SearchInput"
import { ProfileButton } from "./UI/isModal/ProfileButton"
import { DeleteAcc } from "./deleteAcc"
import { getAuth, signOut } from "firebase/auth";
import { query, collection, where, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp, getFirestore } from "firebase/firestore";
import { ProcessDataStart, ProcessDataSuccess, ProcessDataFailure } from "store/processes/process";
import { setSearchUserData } from "store/searchUsers/searchUsers";
import { removeUser } from "store/users/user.slice";
import { SearchUserState } from "types/user";
import { IsLoadingMini } from "./UI/isLoading/isLoading";
import { useAppDispatch, useAppSelector } from "hooks/use-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "hooks/use-auth";

const ProfileDownBlock = () => {
    const navigate = useNavigate();
    const { id, fullName, photoURL} = useAuth();
    const auth = getAuth();
    const dispatch = useAppDispatch();
    const db = getFirestore();
    const [searchValue, setSearchValue] = useState('');
    const userSearchData: SearchUserState[] = useAppSelector((state)=> state.setSearchUsers.users);
    const {loading, error} = useAppSelector((state)=> state.process);
    const SearchUsers = async () => {
      const q = query(
        collection(db, "users"),
        where("fullName", ">=", searchValue),
        where("fullName", "<=", searchValue + '\uf8ff')
      );
  
      try{
        dispatch(ProcessDataStart());
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty){
            dispatch(ProcessDataSuccess())
            const usersData = querySnapshot.docs.map((doc) => {
              const data = doc.data() as SearchUserState; // Уточняем тип данных
              return data;
            });
            dispatch(setSearchUserData(usersData))
            console.log(userSearchData)
        }else{
          dispatch(ProcessDataFailure('нет таких пользователей'));
        console.log('нет таких пользователей')
  
        }
        
      }catch(err: any){
        dispatch(ProcessDataFailure(err.message));
        console.error(err.message)
      };
    }

    const singOutUser =  async () => {
        signOut(auth).then(() => {
          dispatch(removeUser());
          navigate('login')
        }).catch((error) => {
          // Обработка ошибок при выходе
          console.error('Ошибка выхода:', error);
        });
        
      }
      const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.code === "Enter" && SearchUsers();
      };
      const generateChatId = (id1: string, id2: string) => {
        const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
        const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
        return `${firstId}${secondId}`;
      };
      const handleSelect = async (user: SearchUserState) => {
        const combinedId = generateChatId(id.toString(), user.id.toString());
        try{
          const res = await getDoc(doc(db, "chats",combinedId))
          
          if(!res.exists()){
            await setDoc(doc(db, "chats", combinedId), { messages: [] });
    
            await updateDoc(doc(db,"UserChat", id.toString()), {
              [combinedId + ".UserInfo"]: {
                id: user.id,
                fullName: user.fullName,
                photoURL: user.photoURL,
              },
              [combinedId + ".date"]: serverTimestamp()
            });
    
            await updateDoc(doc(db,"UserChat", user.id.toString()), {
              [combinedId + ".UserInfo"]: {
                id: id,
                fullName: fullName,
                photoURL: photoURL,
              },
              [combinedId + ".date"]: serverTimestamp()
            })
          }else{
            
          }
        }catch(err: any){
          dispatch(ProcessDataFailure(err))
        }
        dispatch(setSearchUserData([]));
        setSearchValue('');
      } 
    return(
        <>
         <SearchInput 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKey}
        />
        <ProfileButton>
                <div style={{display: 'flex', flexDirection: 'column'}}>
        {userSearchData.length >= 1 ? (
            <ul className='user-list'>
            {userSearchData.map((user) => (
              user.id !== id && (
                  <li 
                  style={{cursor: 'pointer'}}
                  key={user.id} 
                  className="user-item"
                  onClick={() => handleSelect(user)}
                  >
                  <img src={user.photoURL} alt={user.fullName} />
                  <div>
                    <p>first name: {user.firstName}</p>
                  </div>
                </li>
              )
              ))}
          </ul>
        ) : (
            ''
            )}
            
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