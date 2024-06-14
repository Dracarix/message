import { FormRegister } from 'Components/UI/form/formRegister';
import { getAuth, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, updateProfile } from 'firebase/auth';
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setUser } from 'store/users/user.slice';
import '../Components/UI/form/form.scss' 
import { ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { useEffect, useState } from 'react';
import '../styles/CSSTransition.css';
import { useAuth } from 'hooks/use-auth';
import BackLogin from '../Images/background-login.png';
import LogoBig from '../Images/My-logo-big.png';
import { useMediaQuery } from 'react-responsive';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const db = getFirestore();
  const { loading} = useAppSelector((state) => state.process)|| {};
  const [hasError, setHasError] = useState(false);
  const {isAuth} = useAuth();
  const mediaWidth = useMediaQuery({maxWidth: 800});
  const location = useLocation();
  const [errorAuth , setErrorAuth] = useState<string | null>(null);
  const defaultPhoto = 'https://firebasestorage.googleapis.com/v0/b/messager-react-1753d.appspot.com/o/default__photo.jpg?alt=media&token=808ffaeb-5259-4554-b25a-782e7b38ce8b'




  useEffect(() => {
    if (errorAuth !== null) {
      setHasError(true);
    }
  }, [errorAuth]);
  useEffect(()=> {
    const Redirect =  () => {
      dispatch(ProcessDataStart())
      if(location.pathname === '/message/register'){
        document.title = 'Регистрация'
      }
        if(isAuth){
          navigate('/message/');
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
          dispatch(setUser({
            email: user.email,
            token: user.refreshToken,
            id: user.uid,
            fullName: user.displayName,
            photoURL: defaultPhoto,
            firstName: firstName,
            lastName: lastName,
          }))
          await setDoc(doc(db, "UserChat" , user.uid), {});
          setTimeout(()=> {
            dispatch(ProcessDataSuccess())
            if (isAuth){navigate('/message/')}
          },200)
    } catch (error:any) {
      dispatch(ProcessDataSuccess())
      setErrorAuth(error.code)
      
    }
  };
  if(loading){
    return <IsLoadingBig/>
  }
  return (
    <div 
      className='regBlock'
      style={{
        backgroundImage:`url(${BackLogin})`
      }}
    >
      {!mediaWidth &&(
        <img 
          src={LogoBig} 
          alt="Logo this website" 
          style={{width: '20vw'}}
        />
      )}
      <div className='block__form_login'>
        <FormRegister title="Signup" handleForm={handleReg} error={errorAuth || ''}/>
        <p className="signin"> Уже есть аккаунт?  <Link style={{textShadow: 'none'}} to='/message/login'>Вход</Link> </p>  

      </div>

    </div>
  );    
};

export {RegisterPage};