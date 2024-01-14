/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, } from 'react-router-dom';
import {Loyaut} from 'Components/Loyaut';
import {HomePage} from 'pages/homePage';
import {LoginPage} from 'pages/loginPage';
import {RegisterPage} from 'pages/registerPage';
import Masseges from 'pages/Masseges';
import { ErrorPage } from 'pages/errorPage';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { removeUser, setUser } from 'store/users/user.slice';
import ErrorBoundary from 'Components/errorBount';
import PrivateAuth from 'Components/hoc/PrivateAuth';
import { NotPages } from 'pages/NotPages';

function App() {  
  const dispatch = useAppDispatch();
  const auth = getAuth();
  const thisUser = useAppSelector((state) => state.user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
        email: user.email,
        token: user.refreshToken,
        id: user.uid,
        name: user.displayName,
      }));

      } else {
        dispatch(removeUser());
  
      }
    });
  return () => unsubscribe();
}, [auth, dispatch, thisUser]);
  const router = createBrowserRouter(createRoutesFromElements(
      <Route path="/" element={<Loyaut />}>
        <Route element={<PrivateAuth/>}>
          <Route path='profile' element={<HomePage />} />
          <Route index element={<Masseges />} />
          <Route path='error' element={<ErrorPage />} />
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
