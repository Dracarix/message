
import './App.css';
import './styles/style.scss'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, } from 'react-router-dom';
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
import PrivateAuth from 'Components/hoc/PrivateAuth';
import { NotPages } from 'pages/NotPages';
import { Chats } from 'pages/Chat';
import { doc, getFirestore, onSnapshot,  } from 'firebase/firestore';
import {UserSearch} from 'pages/searchUsers';
import { openErrModal } from 'store/processes/isModal';
import {ProfileSetting} from 'pages/ProfileSetting';
import { UserState } from 'types/user';

const App:FC = () => {  
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const auth = getAuth();
  const {error} = useAppSelector((state) => state.process);
  const theme = useAppSelector((state) => state.theme);

useEffect(()=>{
    if(error !== null){
        dispatch(openErrModal())
    }

// eslint-disable-next-line react-hooks/exhaustive-deps
},[error])


  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unsubscribe = onAuthStateChanged(auth, (user) => {

        if (user) {
            const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
                const data = doc.data() as UserState;
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
          <Route path='message/profile' element={<HomePage />} />
          <Route path='message/' element={<Messages />} />
          <Route path='message/error' element={<ErrorPage />} />
          <Route path='message/search/:value' element={<UserSearch/>} />
          <Route path='message/chat/:overUserID' element={<Chats />} />
          <Route path='message/profile/setting/:thisID' element={<ProfileSetting />} />
        </Route>
        <Route path='message/login' element={<LoginPage />} />
        <Route path="message/register" element={<RegisterPage />} />
        <Route path='*' element={<NotPages/>}/>

      </Route>
  ))
  return (
    
      <RouterProvider router={router}/>

    
  );
}

export default App;


