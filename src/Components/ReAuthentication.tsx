import React from 'react';
import { ReAuthenticate } from './UI/form/formLogin';
import { EmailAuthProvider, deleteUser, getAuth, reauthenticateWithCredential, signOut } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { removeUser } from 'store/users/user.slice';
import { closeModal, openReAuth } from 'store/processes/isModal';

const ReAuthenticationForm = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore();
    const thisUser = useAppSelector((state) => state.user);
    const uid = thisUser.id;
    const dispatch = useAppDispatch();
    const handleReAuth = (email: string, pass: string) => {
      dispatch(ProcessDataStart())
        if(user){
            const credential = EmailAuthProvider.credential(email, pass);    
            return reauthenticateWithCredential(user, credential)
            .then(async ()=>{
              if (user) {
                try {
                  await deleteDoc(doc(db, 'users', uid.toString()));
                  await deleteUser(user);
                  await signOut(auth);

                  dispatch(removeUser());
                  dispatch(ProcessDataSuccess());
                  dispatch(closeModal());
        
                } catch (error: any) {
                  console.error('Error:', error.message);
                  if(error.code === 'auth/requires-recent-login'){
                    dispatch(openReAuth());
                  }else{
                    dispatch(ProcessDataFailure(error.message))
                  }
                }
              }
            }).catch((err)=>{
                dispatch(ProcessDataFailure(err.message))
            })
        } else {
            dispatch(ProcessDataFailure('Вы не авторизованы'))
          }
        
    }
   
  return (
    <ReAuthenticate title={'Сonfirm'} handleForm={handleReAuth} />
  );
};

export {ReAuthenticationForm};


