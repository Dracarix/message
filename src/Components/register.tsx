import React from 'react';
import Forms from './UI/form/form';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useAppDispatch } from 'hooks/use-redux';
import { setUser } from 'store/users/user.slice';

const Register = () => {
  const dispatch = useAppDispatch();
  
  const handleReg = (email:string, password:string) => {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
    .then(({user}) => {
      dispatch(setUser({
        email: user.email,
        token: user.refreshToken,
        id: user.uid
        
      }))
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

  }
  return (
    <Forms title="register" handleForm={handleReg}/>
  );
};

export default Register;