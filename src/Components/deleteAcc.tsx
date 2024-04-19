/* eslint-disable eqeqeq */
import { deleteUser, getAuth, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { FC } from 'react';
import { removeUser } from 'store/users/user.slice';
import { setGlobalError } from 'store/error';
import { useNavigate } from 'react-router-dom';
import { openReAuth } from 'store/processes/isModal';
import { ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { ChatObject } from 'types/user';

const DeleteAcc:FC = () => {
    const auth = getAuth();
    const db = getFirestore();
    const dispatch = useAppDispatch();

    const {id} = useAppSelector((state) => state.user);
    const user = auth.currentUser;
    const navigate = useNavigate();
    const deletePhoto = 'https://firebasestorage.googleapis.com/v0/b/messager-react-1753d.appspot.com/o/delete_user.png?alt=media&token=e166711f-a034-4c70-a4e9-cfa45a2c07be';
    
    const deleteThisUser = async () => {
      dispatch(ProcessDataStart())
        if (user) {
          try {
            await deleteUser(user);
            await usersDeleteUser()
            await userChatDeleteUser()
            await signOut(auth);
      
            dispatch(removeUser());
            dispatch(ProcessDataSuccess())
          } catch (error: any) {
            console.error('Error:', error.message);
            if(error.code == 'auth/requires-recent-login'){
              dispatch(openReAuth());
              dispatch(ProcessDataSuccess())
            }else{
              dispatch(setGlobalError(error.message ));
              navigate('/error')
              console.error(error.message)
            }
          }
        }
      };
      const generateChatID = (id1: string, id2: string) => {
        const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
        const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
        return (`${firstId}${secondId}`);
    };
      const usersDeleteUser = async () => {
        const docRef =  doc(db, "users", id.toString());
        updateDoc(docRef, {photoURL: deletePhoto})

      }

      const userChatDeleteUser = async () => {
        const docSnap = await getDoc(doc(db, "UserChat", id.toString()));
        const dataThisUser = docSnap.data();
        if(dataThisUser){
          const userObject: ChatObject[] = Object.values(dataThisUser);
          userObject.forEach(async (item)=> {
            if(item.UserInfo.id && item && item.UserInfo){

            const idOtherUser = item.UserInfo.id;
            
              const ChatID = generateChatID(idOtherUser, id.toString());
            const docRef = doc(db, 'UserChat', idOtherUser);
            const querySnapshot = await getDoc(docRef);
            const dataOtherUser = querySnapshot.data();
            if (dataOtherUser) {
              const otherUserObject: ChatObject[] = Object.values(dataOtherUser);
              otherUserObject.forEach(async (i)=> {
                if(i.UserInfo.id === id.toString()){
                  await updateDoc(docRef, { [`${ChatID}.UserInfo.photoURL`]: deletePhoto });
                }
              })
              
            }            
          }
          })
        }

      };

    
  return (

      <button 
        style={{
        padding: "10px", 
        width: '100%',
        textAlign:'start',
        border: 'none',
        background: 'none'
      }} 
        onClick={deleteThisUser}
      >
        delete
        
      </button>

    
  );
};

export {DeleteAcc};