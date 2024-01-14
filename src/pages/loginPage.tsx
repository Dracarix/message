
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { setUser } from 'store/users/user.slice';
import { Link, useNavigate,  } from 'react-router-dom';
import {FormLogin} from 'Components/UI/form/formLogin';
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/CSSTransition.css'
import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from 'hooks/use-auth';

const LoginPage = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error} = useAppSelector((state) => state.process)|| {};
  const [hasError, setHasError] = useState(false);
  const auth = getAuth();
  const {isAuth} = useAuth()
  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error, isAuth]);

  useEffect(()=> {
    const Redirect =  () => {
      dispatch(ProcessDataStart())
      
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
      dispatch(ProcessDataStart())
      setPersistence(auth, browserLocalPersistence)
      .then(async (data) => {

      })
      .catch((error) => {
        dispatch(ProcessDataFailure(error.message ));
      });
      await signInWithEmailAndPassword(auth, email, password)
      .then((data) => {

      })
      .catch((error) => {
        dispatch(ProcessDataFailure(error.message));
      })
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
      const user = auth.currentUser;
      if(user){
        const userData = {
        email: user.email,
        token: user.refreshToken,
        id: user.uid,
        name: user.displayName,
      };
      dispatch(setUser(userData));
      dispatch(ProcessDataSuccess());
      console.log(isAuth)
      if (isAuth){navigate('/')}
    }
    } catch (error: any) {
      console.error('Ошибка при отправке запроса:', error.message);
      dispatch(ProcessDataFailure({ code: error.code, message: error.message }));
    }
  };
  if(loading){
    return <IsLoadingBig/>
  }
  return (
    <div
      className='regBlock'
    >
      <FormLogin title="Signin" handleForm={(email, pass) => handleLogin(email, pass)}/>
      <p className="signin">Don't have an account yet?  <Link to='/register'>Signup</Link> </p>
      <TransitionGroup>
        {hasError && (
        <CSSTransition 
        timeout={500} 
        classNames="slide" unmountOnExit 
        in={hasError}
        >
          <div style={{display: 'flex', flexDirection: 'column'}}>
          {error ? error : (
            ''
          )}
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>  

    </div>
  );
};

export {LoginPage};