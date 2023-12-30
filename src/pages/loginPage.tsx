import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { useAppDispatch } from 'hooks/use-redux';
import { setUser } from 'store/users/user.slice';
import { Link, useNavigate,  } from 'react-router-dom';
import FormLogin from 'Components/UI/form/formLogin';


const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleLogin = async (email: string, password: string) => {
    const auth = getAuth();
    
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await setPersistence(auth, browserLocalPersistence);
      dispatch(setUser({
        email: user.email,
        token: user.refreshToken,
        id: user.uid,
        name: user.displayName,
      }))
      // Переход к 'messages' после успешной установки persistence
      navigate('messages');
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);
    }
  };
  return (
    <>
      <FormLogin title="Join" handleForm={(email, pass) => handleLogin(email, pass)}/>
      <Link to='register'>reginster</Link>
    </>
  );
};

export {LoginPage};