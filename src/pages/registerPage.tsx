import { FormRegister } from 'Components/UI/form/formRegister';
import { getAuth, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, updateProfile } from 'firebase/auth';
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { useAppDispatch } from 'hooks/use-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setUser } from 'store/users/user.slice';
import '../Components/UI/form/form.scss' 
import { useSelector } from 'react-redux';
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../styles/CSSTransition.css'
import { RootState } from 'store/store';
import { useAuth } from 'hooks/use-auth';
import BackLogin from '../Images/background-login.png';
import LogoBig from '../Images/My-logo-big.png';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const db = getFirestore();
  const { loading, error} = useSelector((state: RootState) => state.process)|| {};
  const [hasError, setHasError] = useState(false);
  const {isAuth} = useAuth();
  const location = useLocation()
  const defaultPhoto = 'https://firebasestorage.googleapis.com/v0/b/messager-react-1753d.appspot.com/o/default__photo.jpg?alt=media&token=808ffaeb-5259-4554-b25a-782e7b38ce8b'
  useEffect(() => {
    if (error !== null) {
      setHasError(true);
    }
  }, [error]);
  useEffect(()=> {
    const Redirect =  () => {
      dispatch(ProcessDataStart())
      if(location.pathname === '/register'){
        document.title = 'Регистрация'
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
  
  const handleReg = async (email:string, password:string, firstName: string, lastName: string) => {
    const auth = getAuth();
    const fullName = firstName + ' ' + lastName;
    try {
      dispatch(ProcessDataStart());
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: fullName, photoURL: defaultPhoto });
      const userRef = doc(db, 'users', user.uid);     
      await setDoc(userRef, {
        email: user.email,
        token: user.refreshToken,
        id: user.uid,
        fullName: user.displayName,
        photoURL: defaultPhoto,
      });
      await updateDoc(userRef,{
        firstName: firstName,
        lastName: lastName,
      });
      await setPersistence(auth, browserLocalPersistence);
      await setDoc(doc(db, "UserChat" ,user.uid), {})
      dispatch(setUser({
        email: user.email,
        token: user.refreshToken,
        id: user.uid,
        fullName: user.displayName,
        photoURL: defaultPhoto,
        firstName: firstName,
        lastName: lastName,
      }))
      
      setTimeout(()=> {
        dispatch(ProcessDataSuccess())
        if (isAuth){navigate('/')}
      },200)
      
    } catch (error:any) {
      dispatch(ProcessDataFailure(error.message))
      
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
      <img 
        src={LogoBig} 
        alt="Logo this website" 
        style={{width: '30vw'}}
      />
      <div className='block__form_login'>
        <FormRegister title="Signup" handleForm={handleReg}/>
        <p className="signin"> Already have an account?  <Link to='/login'>Signin</Link> </p>  
        <TransitionGroup>
          {hasError && (
            <CSSTransition 
              timeout={500} 
              classNames="slide" unmountOnExit 
              in={hasError}
            >
              <div style={{display: 'flex', flexDirection: 'column'}}>
              {error && error }
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>   
      </div>

    </div>
  );    
};

export {RegisterPage};