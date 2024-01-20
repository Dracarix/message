import {  getAuth, signOut } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { FC, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { removeUser } from 'store/users/user.slice';
import { DeleteAcc } from './deleteAcc';
import { useAuth } from 'hooks/use-auth';
import { SearchInput } from './UI/Input/SearchInput';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  getFirestore,
  query, 
  serverTimestamp, 
  setDoc, 
  updateDoc, 
  where 
} from 'firebase/firestore';
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { setSearchUserData } from 'store/searchUsers/searchUsers';
import { IsLoadingMini } from './UI/isLoading/isLoading';
import { IsModal } from './UI/isModal/isModal';
import { SearchUserState } from 'types/user';


const Loyaut:FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const {isAuth, id, name, photoURL} = useAuth();
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const [searchValue, setSearchValue] = useState('');
  const userSearchData: SearchUserState[] = useAppSelector((state)=> state.setSearchUsers.users);
  const {loading, error} = useAppSelector((state)=> state.process);
  const {isOpen} = useAppSelector((state) => state.isModalReduser)
  const SearchUsers = async () => {
    const q = query(
      collection(db, "users"),
      where("name", ">=", searchValue),
      where("name", "<=", searchValue + '\uf8ff')
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
  const handleBack = () => {
    navigate(-1)
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
      console.log('1')
      if(!res.exists()){
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        console.log('2')
        console.log(photoURL)
        await updateDoc(doc(db,"UserChat", id.toString()), {
          [combinedId + ".UserInfo"]: {
            id: user.id,
            name: user.name,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp()
        });
        console.log('3')
        console.log(id)
        console.log(user.id)

        await updateDoc(doc(db,"UserChat", user.id.toString()), {
          [combinedId + ".UserInfo"]: {
            id: id,
            name: name,
            photoURL: photoURL,
          },
          [combinedId + ".date"]: serverTimestamp()
        })
      }else{
        console.log(res)
      }
      console.log('4')
    }catch(err: any){
      console.error('Ошибка выхода:', err)
    }
    dispatch(setSearchUserData([]));
    setSearchValue('');
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
          alignItems: 'center'
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
      {!isAuth ? '' :<>
        <SearchInput 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKey}
        />
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
                  <img src={user.photoURL} alt={user.name} />
                  <div>
                    <p>UserName: {user.name}</p>
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
        <button style={{padding: "10px"}} onClick={singOutUser}>quit</button>
        <DeleteAcc />
        </>}
      </header>
      {isOpen && <IsModal/>}
      <Outlet/>
    </>
  );
};

export {Loyaut};