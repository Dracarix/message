import { FormRegister } from 'Components/UI/form/formRegister';
import { getAuth, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, updateProfile } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useAppDispatch } from 'hooks/use-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from 'store/users/user.slice';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const handleReg = async (email:string, password:string, name: string) => {

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setPersistence(auth, browserLocalPersistence);
      await updateProfile(user, { displayName: name });
      const userRef = doc(db, 'users', user.uid);
      const userData = {
        email: user.email,
        token: user.refreshToken,
        id: user.uid,
        name: user.displayName,
      };
      await setDoc(userRef, userData);
      dispatch(setUser(userData))


      navigate('/messages');
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);
    }
  };
  return (
    <>
      <FormRegister title="register" handleForm={handleReg}/>
      <Link to='/'>login</Link>
    </>
  );    
};

export {RegisterPage};