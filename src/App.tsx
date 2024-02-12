/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css';
import './styles/style.scss'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, } from 'react-router-dom';
import {Layaut} from 'Components/Loyaut';
import {HomePage} from 'pages/homePage';
import {LoginPage} from 'pages/loginPage';
import {RegisterPage} from 'pages/registerPage';
import Masseges from 'pages/Messages';
import { ErrorPage } from 'pages/errorPage';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { removeUser, setUser } from 'store/users/user.slice';
import ErrorBoundary from 'Components/errorBount';
import PrivateAuth from 'Components/hoc/PrivateAuth';
import { NotPages } from 'pages/NotPages';
import { Chats } from 'pages/Chat';
import { collection, doc, getFirestore, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';

function App() {  
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const auth = getAuth();
  const thisUser = useAppSelector((state) => state.user);
  const {error} = useAppSelector((state) => state.process);
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
}, [dispatch, db]);


  const router = createBrowserRouter(createRoutesFromElements(
      <Route element={<Layaut />}>
        <Route element={<PrivateAuth/>}>
          <Route path='profile' element={<HomePage />} />
          <Route path='/' element={<Masseges />} />
          <Route path='error' element={<ErrorPage />} />
          {/* <Route path='chat' element={<Chats/>}/> */}
          <Route path='chat/:overUserID' element={<Chats />} />
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
