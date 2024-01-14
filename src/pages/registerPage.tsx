import { FormRegister } from 'Components/UI/form/formRegister';
import { getAuth, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, updateProfile } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useAppDispatch } from 'hooks/use-redux';
import { Link, useNavigate } from 'react-router-dom';
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

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const db = getFirestore();
  const { loading, error} = useSelector((state: RootState) => state.process)|| {};
  const [hasError, setHasError] = useState(false);
  const {isAuth} = useAuth();
  const defaultPhoto = '../images/default__photo.jpg'
  useEffect(() => {
    if (error !== null) {
      setHasError(true);
    }
  }, [error]);
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
  const handleReg = async (email:string, password:string, name: string) => {
    const auth = getAuth();

    try {
      dispatch(ProcessDataStart())
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name, photoURL: defaultPhoto });
      const userRef = doc(db, 'users', user.uid);
      const userData = {
        email: user.email,
        token: user.refreshToken,
        id: user.uid,
        name: user.displayName,
        photoURL: defaultPhoto,
      };
      await setDoc(userRef, userData);
      await setPersistence(auth, browserLocalPersistence);
      await setDoc(doc(db, "UserChat" ,user.uid), {})
      dispatch(setUser(userData))
      
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
    <div className='regBlock'>
    
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

export {RegisterPage};