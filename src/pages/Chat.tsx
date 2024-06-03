import { InputSend } from 'Components/UI/Input/SearchInput';
import { Message } from 'Components/UI/message/Message';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { useEffect, useState } from 'react';
import '../styles/chat.scss'
import { LeftUsers } from 'Components/rightColumnUsers';
import {  Navigate, useParams } from 'react-router-dom';
import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { setChat } from 'store/users/chat.slice';
import { useAuth } from 'hooks/use-auth';
import { ChatLoader } from 'Components/UI/isLoading/chatLoader';
import { ChatObject, SearchUserState,  UserState } from 'types/user';
import { ProcessDataFailure } from 'store/processes/process';
import { useMediaQuery } from 'react-responsive';
import CheckedMess from 'Components/UI/message/CheckedMess';
import { DeleteChat } from 'Components/deleteChat';

const Chats = () => {
  const {user} = useAppSelector((state) => state.chat);
  const { overUserID } = useParams();
  const [loading , setLoading] = useState(false);
  const {id, fullName, photoURL} = useAuth();
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const [valideChat , setValideChat] = useState(false);
  const mediaWidth = useMediaQuery({maxWidth: 800});
  const [select , setSelect] = useState(false)
  const {words} = useAppSelector(state => state.selectedMess);

  const generateChatId = (id1: string , id2: string) => {
    const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
    const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
    return `${firstId}${secondId}`;
  };
  const newChat = async (userNew: SearchUserState) => {
    const chatId = generateChatId(userNew.id.toString(), id.toString())
    try {
      const chatDoc = doc(db, "chats", chatId);
      const userChatDoc = doc(db, "UserChat", id.toString());

      const chatDocSnapshot = await getDoc(chatDoc);
      if (!chatDocSnapshot.exists()) {
        await setDoc(chatDoc, { messages: [] });
        
        await updateDoc(userChatDoc, {
          [chatId + ".UserInfo"]: {
            id: userNew.id,
            fullName: userNew.fullName,
            photoURL: userNew.photoURL,
          },
          [chatId + ".date"]: serverTimestamp(),
        });
  
        const currentUserChatDoc = doc(db, "UserChat", userNew.id.toString());
        await updateDoc(currentUserChatDoc, {
          [chatId + ".UserInfo"]: {
            id: id,
            fullName: fullName,
            photoURL: photoURL,
          },
          [chatId + ".date"]: serverTimestamp(),
        });
        await fetchChat();
      }else{
        await updateDoc(userChatDoc, {
          [chatId + ".UserInfo"]: {
            id: userNew.id,
            fullName: userNew.fullName,
            photoURL: userNew.photoURL,
          },
          [chatId + ".date"]: serverTimestamp(),
        });
        await fetchChat();
      }
    } catch (err: any) {
      dispatch(ProcessDataFailure(err.code));
    }
  };


  const fetchChat = async () => {
    setLoading(true)

  if (overUserID) {

    const querySnapshot = await getDocs(collection(db, "users"));
    const docSnap = await getDoc(doc(db, "users", id.toString()));
    const thisUserDocRef = doc (db, "users" , id.toString())
    if(querySnapshot.empty){
      setLoading(false);
      setValideChat(true);
    }
    const usersSearch: SearchUserState[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as SearchUserState;
        
        usersSearch.push(userData);
      })
      for (var i = usersSearch.length - 1; i >= 0; i--) {
        if (usersSearch[i].id.toString() !== overUserID) {
          usersSearch.splice(i, 1);
        }
    }     
    if(usersSearch.length === 0){
      setLoading(false);
       setValideChat(true);
       return;
    }
          const userChat = await getDoc(doc(db, 'UserChat', id.toString()))
          const data = userChat.data();

            
            if(data){
              const UserArr: ChatObject[] = Object.values(data);
              const chatId = generateChatId(id.toString(), overUserID);
              let UserFound = false;
              UserArr.forEach(e => {
                if(e.UserInfo){
                  if(e.UserInfo.id === overUserID){
                    UserFound = true;
                    return UserFound
                  }
                }
                
              });
              const userNew = usersSearch[0];
              
              const overUserIDValue = data[chatId] as ChatObject ;
              const RightChats = docSnap.data() as UserState;
              if(UserFound){
                // если чел есть в списке UserChat у этого пользователя
                if (overUserIDValue) {
                 
                  if(RightChats){                        
                    if(!RightChats.selectedUsers){
                      await updateDoc(thisUserDocRef, { selectedUsers:[{
                          id: overUserID,
                          fullName: overUserIDValue.UserInfo.fullName,
                          photoURL: overUserIDValue.UserInfo.photoURL,                   
                      }]})
                     
                    }else{
                      if(RightChats.selectedUsers.length === 0){
                        await updateDoc(thisUserDocRef,{
                          selectedUsers:arrayUnion({
                            
                              id: overUserID,
                              fullName: overUserIDValue.UserInfo.fullName,
                              photoURL: overUserIDValue.UserInfo.photoURL,
                           
                          })
                        })
                      }
                      RightChats.selectedUsers.forEach(async element => {
                        if(element.id !== overUserID){
                          await updateDoc(thisUserDocRef,{
                            selectedUsers:arrayUnion({
                              
                                id: overUserID,
                                fullName: overUserIDValue.UserInfo.fullName,
                                photoURL: overUserIDValue.UserInfo.photoURL,
                             
                            })
                          })
                         
                        }
                      });
                    }
                    dispatch(setChat({ chatID: chatId, user: overUserIDValue.UserInfo }));
                    
                      setLoading(false)

                  }
                } else {
                    setLoading(false)
                }
              }else{
                // если чела нет в списке UserChat у этого пользователя
                await newChat(userNew);
                if (overUserIDValue) {
                  if(RightChats){
                    if(!RightChats.selectedUsers){
                      await updateDoc(thisUserDocRef, { selectedUsers:[{
                          id: overUserID,
                          fullName: overUserIDValue.UserInfo.fullName,
                          photoURL: overUserIDValue.UserInfo.photoURL,                   
                      }]})
                    }else{
                      if(RightChats.selectedUsers.length === 0){
                        await updateDoc(thisUserDocRef,{
                          selectedUsers:arrayUnion({
                            
                              id: overUserID,
                              fullName: overUserIDValue.UserInfo.fullName,
                              photoURL: overUserIDValue.UserInfo.photoURL,
                           
                          })
                        })
                      }
                      RightChats.selectedUsers.forEach(async element => {
                        if(element.id !== overUserID){
                          await updateDoc(thisUserDocRef,{
                            selectedUsers:arrayUnion({
                              
                                id: overUserID,
                                fullName: overUserIDValue.UserInfo.fullName,
                                photoURL: overUserIDValue.UserInfo.photoURL,
                             
                            })
                          })
                        }
                      });
                    }
                    dispatch(setChat({ chatID: chatId, user: overUserIDValue.UserInfo }));
                    
                    
                      setLoading(false)
                   
                    
                  }
                } else {
                  
                    setLoading(false)
                  
                }
              }
              
              }else{
                setLoading(false)
                setValideChat(true)
              }

  } else {
    setLoading(false)
    setValideChat(true)

  }
};
  useEffect(() => {
    if(overUserID){
      const chatId = generateChatId(overUserID, id.toString())
      console.log(chatId);
    }

  
    fetchChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overUserID, id]);

  useEffect(()=>{
    if(words.length === 0){
      setSelect(false)
    }else{
      setSelect(true)
    }
  },[words])


if(valideChat){
  return <Navigate to='/message/'/>
}

  return (
    <div className='chat'>
      {!mediaWidth && <LeftUsers thisID={user?.id || ''} />}
      <section className='chat_section'>
        {loading ? <ChatLoader/> 
        : (
          select
            ?(<CheckedMess/>
            ):(
              <div className='chatInfo'>
                  <div className='chatIcons'>
                    <img src={user?.photoURL} alt="" />
                  </div>
                  <span>{user?.fullName}</span>
                  <div style={{position:'absolute', right:'12px'}}>
                    <DeleteChat UserID={user?.id}  />
                  </div>
              </div>
            )
        )}
        
        {overUserID && 
          <Message chatID={generateChatId(id.toString(), overUserID)} />
        }
        <InputSend disabled={loading}/>
      </section>
    </div>
  );
};

export {Chats};