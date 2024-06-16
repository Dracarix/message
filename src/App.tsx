
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
import {ProfileSetting} from 'pages/ProfileSetting';
import { UserState } from 'types/user';
import { setActive } from 'store/users/activeUser';

const App:FC = () => {  
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const auth = getAuth();
  const {activeUser} = useAppSelector((state) => state.activeUser);
  const theme = useAppSelector((state) => state.theme);


useEffect(()=>{
    const isActiveUser = () => {
        dispatch(setActive(true));
      };
      const isPassiveUser = () => {
        dispatch(setActive(false));
      }

      
      window.addEventListener('click', isActiveUser);
      window.addEventListener('touchstart', isActiveUser);
      
      return () => {
        window.removeEventListener('click', isPassiveUser);
        window.removeEventListener('touchstart', isPassiveUser);
      };

// eslint-disable-next-line react-hooks/exhaustive-deps
},[])
useEffect(()=>{
    setTimeout(()=>{
        dispatch(setActive(false));
    },1000 * 60 * 10)
},[activeUser])

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


