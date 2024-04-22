
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { setUser } from 'store/users/user.slice';
import { Link, useLocation, useNavigate,  } from 'react-router-dom';
import {FormLogin} from 'Components/UI/form/formLogin';
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { useEffect, useState } from 'react';
import '../styles/CSSTransition.css'
import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from 'hooks/use-auth';
import BackLogin from '../Images/background-login.png';
import LogoBig from '../Images/My-logo-big.png';
import { useMediaQuery } from 'react-responsive';


const LoginPage = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading} = useAppSelector((state) => state.process)|| {};

  const location = useLocation();
  const mediaWidth = useMediaQuery({maxWidth: 800});
  const auth = getAuth();
  const [errorAuth , setErrorAuth] = useState<string | null>(null);
  const {isAuth} = useAuth()


  useEffect(()=> {
    const Redirect =  () => {
      dispatch(ProcessDataStart())
      if(location.pathname === '/login'){
        document.title = 'Аутентификация'
      }
        if(isAuth){
          navigate('/');
          dispatch(ProcessDataSuccess());
        }else{
          setTimeout(()=> {
            dispatch(ProcessDataSuccess());
          },500)
        };
     
  
    }
    Redirect();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isAuth])

  const handleLogin = async (email: string, password: string) => {
    try {
      setErrorAuth(null)
      dispatch(ProcessDataStart())
      await signInWithEmailAndPassword(auth, email, password)
        .then((data) => {
          setPersistence(auth, browserLocalPersistence)
            .then(async (data) => {
              const user = auth.currentUser;
              if(user){
                const userData = {
                email: user.email,
                token: user.refreshToken,
                id: user.uid,
                fullName: user.displayName,
                photoURL: user.photoURL,
        
              };
              dispatch(setUser(userData));
              dispatch(ProcessDataSuccess());
              if (isAuth){navigate('/')}
            }
            })
            .catch((error) => {
              setErrorAuth(error.code)
              dispatch(ProcessDataSuccess());
            });
        })
        .catch((error) => {
          setErrorAuth(error.code)
          dispatch(ProcessDataSuccess());
        })
    } catch (error: any) {
      setErrorAuth(error.code)
      dispatch(ProcessDataSuccess());
    }
  };
  if(loading){
    return <IsLoadingBig/>
  }
  return (
    <div 
      className='regBlock'
      style={{backgroundImage:`url(${BackLogin})`}}
    >
      {!mediaWidth &&
      
      <img 
        src={LogoBig} 
        alt="Logo this website" 
        style={{width: '20vw'}}
      />
      }
      <div className='block__form_login'>
          <FormLogin 
            title="Signin"
            handleForm={(email, pass) => handleLogin(email, pass)}
            error={errorAuth || ''}
           />
          <p className="signin">Еще нет аккаунта?  <Link style={{textShadow: 'none'}} to='/register'>Регистрация</Link> </p>
          {errorAuth && errorAuth}
      </div>
    </div>
  );
};

export {LoginPage};

      // try{
      //   const response = await axios.post('http://localhost:2000/api/login', { email, password });
      //   if (response.status === 200) {    
      //     const userData = response.data;
      //     dispatch(setUser(userData));
      //     dispatch(ProcessDataSuccess(userData));
      //   } else {
      //     console.log(response.data.code)
      //     console.log(response.data.message)
      //     const errorData = response.data;
      //     dispatch(ProcessDataFailure({ code: errorData.code, message: errorData.message }));
      //   }
      // }catch(err: any){
      //   console.log(err.response)
      // }