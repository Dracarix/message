/* eslint-disable eqeqeq */
import { deleteUser, getAuth, signOut } from 'firebase/auth';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { FC } from 'react';
import { removeUser } from 'store/users/user.slice';
import { setGlobalError } from 'store/error';
import { useNavigate } from 'react-router-dom';
import { openReAuth } from 'store/processes/isModal';
import { ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';

const DeleteAcc:FC = () => {
    const auth = getAuth();
    const db = getFirestore();
    const dispatch = useAppDispatch();
    const thisUser = useAppSelector((state) => state.user);
    const uid = thisUser.id;
    const user = auth.currentUser;
    const navigate = useNavigate();
  
    const deleteThisUser = async () => {
      dispatch(ProcessDataStart())
        if (user) {
          try {
            await deleteDoc(doc(db, 'users', uid.toString()));
            await deleteDoc(doc(db, 'UserChat', uid.toString()));
            await deleteUser(user);
            await signOut(auth);
      
            dispatch(removeUser());
            dispatch(ProcessDataSuccess())
          } catch (error: any) {
            console.error('Error:', error.message);
            if(error.code == 'auth/requires-recent-login'){
              dispatch(openReAuth());
            }else{
              dispatch(setGlobalError(error.message ));
              navigate('/error')
              console.error(error.message)
            }
          }
        }
      };
  return (

      <button 
        style={{padding: "10px"}} 
        onClick={deleteThisUser}
      >
        delete
      </button>

    
  );
};

export {DeleteAcc};