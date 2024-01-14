import {  getAuth, signOut } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { FC, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { removeUser } from 'store/users/user.slice';
import { DeleteAcc } from './deleteAcc';
import { useAuth } from 'hooks/use-auth';
import { SearchInput } from './UI/Input/SearchInput';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { setSearchUserData } from 'store/searchUsers/searchUsers';
import { IsLoadingMini } from './UI/isLoading/isLoading';
import { IsModal } from './UI/isModal/isModal';

interface userSearchTypes {
  setSearchUser : () => void,
  searchUser: {name: string, photoURL : string}
}

const Loyaut:FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const {isAuth} = useAuth();
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const [searchValue, setSearchValue] = useState('');
  const userSearchData = useAppSelector((state)=> state.setSearchUsers);
  const {loading, error} = useAppSelector((state)=> state.process);
  const [searchUser, setSearchUser] = useState<userSearchTypes | null>(null);
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
        querySnapshot.forEach((doc) => {  
          dispatch(ProcessDataSuccess())
          // setSearchUser(doc.data());
          console.log(userSearchData)
          console.log(doc.data())
        });
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
        {userSearchData && userSearchData.data && (
            <div className="userChat">
              <img src={userSearchData.data.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{userSearchData.data.name}</span>
              </div>
            </div>
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