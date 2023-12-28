import Forms from 'Components/UI/form/form';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAppDispatch } from 'hooks/use-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import { setUser } from 'store/users/user.slice';

const RegisterPage = () => {
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
      console.log(errorCode)
      console.log(errorMessage)
      // ..
    });

  }
  return (
    <>
      <Forms title="register" handleForm={handleReg}/>
      <Link to='/'>login</Link>
    </>
  );
};

export {RegisterPage};