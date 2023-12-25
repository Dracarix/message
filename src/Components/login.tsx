import React from 'react';
import Forms from './UI/form/form';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAppDispatch } from 'hooks/use-redux';
import { setUser } from 'store/users/user.slice';

const Login = () => {
  const dispatch = useAppDispatch();
  
  const handleLogin = (email:string, password:string) => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
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
      });

  }
  return (
    <Forms title="Join" handleForm={(email, pass) => handleLogin(email, pass)}/>
  );
};

export default Login;