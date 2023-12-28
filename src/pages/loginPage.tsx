import Forms from 'Components/UI/form/form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAppDispatch } from 'hooks/use-redux';
import React from 'react';
import { setUser } from 'store/users/user.slice';
import { Link, useNavigate,  } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleLogin = (email:string, password:string) => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
    .then(({user}) => {
      dispatch(setUser({
        email: user.email,
        token: user.refreshToken,
        id: user.uid,
      }))
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
      navigate('messages')
  }
  return (
    <>
      <Forms title="Join" handleForm={(email, pass) => handleLogin(email, pass)}/>
      <Link to='register'>reginster</Link>
    </>
  );
};

export {LoginPage};