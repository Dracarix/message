/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css';
import './styles/style.scss'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useLocation, } from 'react-router-dom';
import {Layout} from 'Components/Loyaut';
import {HomePage} from 'pages/homePage';
import {LoginPage} from 'pages/loginPage';
import {RegisterPage} from 'pages/registerPage';
import Messages from 'pages/Messages';
import { ErrorPage } from 'pages/errorPage';
import { FC, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { removeUser, setUser } from 'store/users/user.slice';
import ErrorBoundary from 'Components/errorBount';
import PrivateAuth from 'Components/hoc/PrivateAuth';
import { NotPages } from 'pages/NotPages';
import { Chats } from 'pages/Chat';
import { collection, doc, getFirestore, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import {UserSearch} from 'pages/searchUsers';
import { openReAuth } from 'store/processes/isModal';
import {ProfileSetting} from 'pages/ProfileSetting';

const App:FC = () => {  
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const auth = getAuth();
  const thisUser = useAppSelector((state) => state.user);
  const {error} = useAppSelector((state) => state.process);
  const theme = useAppSelector((state) => state.theme);




  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {

        if (user) {
            const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
                const data = doc.data();
                if(data){
                    
                    dispatch(setUser({
                        email: user.email,
                        token: user.refreshToken,
                        id: user.uid,
                        fullName: user.displayName,
                        photoURL: user.photoURL,
                        firstName: data.firstName,
                        lastName :data.lastName,
                    }));
                    
                }
            });

                return () => {
                    unsub(); 
                };

            
        } else {

                dispatch(removeUser());


        }
        
    });
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [dispatch, db]);

useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);


  const router = createBrowserRouter(createRoutesFromElements(
      <Route element={<Layout />}>
        <Route element={<PrivateAuth/>}>
          <Route path='profile' element={<HomePage />} />
          <Route path='/' element={<Messages />} />
          <Route path='error' element={<ErrorPage />} />
          <Route path='search/:value' element={<UserSearch/>} />
          <Route path='chat/:overUserID' element={<Chats />} />
          <Route path='profile/setting/:thisID' element={<ProfileSetting />} />
        </Route>
        <Route path='login' element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path='*' element={<NotPages/>}/>

      </Route>
  ))
  return (
    
      <RouterProvider router={router}/>

    
  );
}

export default App;
