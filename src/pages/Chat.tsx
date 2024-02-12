import { InputSend } from 'Components/UI/Input/SearchInput';
import { Message } from 'Components/UI/message/Message';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { useEffect, useState } from 'react';
import '../styles/chat.scss'
import { LeftUsers } from 'Components/leftColumnUsers';
import {  Navigate, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { setChat } from 'store/users/chat.slice';
import { useAuth } from 'hooks/use-auth';
import { ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';

const Chats = () => {
  const {user} = useAppSelector((state) => state.chat);
  const {loading} = useAppSelector((state) => state.process);
  const { overUserID } = useParams();
  const {id} = useAuth();
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const navigate = useNavigate();
  const [huynya , setHuynya] = useState(false)

  const generateChatId = (id1: string , id2: string) => {
    const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
    const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
    return `${firstId}${secondId}`;
  };
  useEffect(() => {
    const fetchChat = async () => {
      dispatch(ProcessDataStart());
      
      if (overUserID) {
        
        const userDoc = await getDoc(doc(db, 'users', overUserID));
        if (userDoc.exists()) {
          
          await getDoc(doc(db, 'UserChat', id.toString()))
            .then((doc) => {

              if (doc.exists()) {


                const data = doc.data();
                if(data){
                  const chatId = generateChatId(id.toString(), overUserID);
                  const overUserIDValue = data[chatId];
                  if (overUserIDValue) {
                    
                    dispatch(setChat({ chatID: chatId, user: overUserIDValue.UserInfo }));
                    dispatch(ProcessDataSuccess());
  
                  } else {
                    // Значение overUserIDValue не существует
                    dispatch(ProcessDataSuccess());
                    setHuynya(true)
                  }
                }else{
                  dispatch(ProcessDataSuccess());
                  setHuynya(true)
                }
                
              }else{
                dispatch(ProcessDataSuccess());
                setHuynya(true)
              }
            })
            .catch((error) => {
              console.log(error);
              dispatch(ProcessDataSuccess());
            });
        } else {
          dispatch(ProcessDataSuccess());
          setHuynya(true)

        }
      } else {
        dispatch(ProcessDataSuccess());
        setHuynya(true)

      }
    };
  
    fetchChat();
  }, [overUserID, id]);
  // http://localhost:3000/chat/UKBdxjgJWwdCc2hsJCIe1U9Fog52
  
if(huynya){
  return <Navigate to='/'/>
}
if (loading) {
    // Если данные чата еще не загружены, можно показать загрузочный индикатор или просто сообщение о загрузке
    return <div>Loading chat...</div>;
}
  return (
    <div className='chat'>
      <LeftUsers thisID={user.id} />
      <section className='chat_section'>
        <div className='chatInfo'>
          <div className='chatIcons'>
            <img src={user.photoURL} alt="" />
          </div>
          <span>{user.fullName}</span>

        
        </div>
        {overUserID && 
          <Message chatID={generateChatId(id.toString(), overUserID)} />
        }
        <InputSend/>
      </section>
    </div>
  );
};

export {Chats};