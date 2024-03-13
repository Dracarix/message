import { InputSend } from 'Components/UI/Input/SearchInput';
import { Message } from 'Components/UI/message/Message';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { useEffect, useState } from 'react';
import '../styles/chat.scss'
import { LeftUsers } from 'Components/rightColumnUsers';
import {  Navigate, useParams } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { setChat } from 'store/users/chat.slice';
import { useAuth } from 'hooks/use-auth';
import { ChatLoader } from 'Components/UI/isLoading/chatLoader';

const Chats = () => {
  const {user} = useAppSelector((state) => state.chat);
  const { overUserID } = useParams();
  const [loading , setLoading] = useState(false);
  const {id} = useAuth();
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const [huynya , setHuynya] = useState(false)

  const generateChatId = (id1: string , id2: string) => {
    const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
    const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
    return `${firstId}${secondId}`;
  };
  useEffect(() => {
    const fetchChat = async () => {
        setLoading(true)
      
      console.log('1')
      if (overUserID) {
        
          await getDoc(doc(db, 'UserChat', id.toString()))
            .then((doc) => {
              console.log('2')
              if (doc.exists()) {
                console.log('3')

                const data = doc.data();
                if(data){
                  const chatId = generateChatId(id.toString(), overUserID);
                  const overUserIDValue = data[chatId];
                  console.log('4')
                  if (overUserIDValue) {
                    
                    dispatch(setChat({ chatID: chatId, user: overUserIDValue.UserInfo }));
                    
                    setTimeout(()=>{
                      setLoading(false)
                    },250)
                    console.log('5')
                  } else {
                    console.log('1')
                    // Значение overUserIDValue не существует
                    
                    setTimeout(()=>{
                      setLoading(false)
                    },250)
                  }
                }else{
                  console.log('1')
                  setLoading(false)
                  setHuynya(true)
                }
                
              }else{
                console.log('1')
                setLoading(false)
              }
            })
            .catch((error) => {
              console.log('1')
              console.log(error);
              setLoading(false)
            });
      } else {
        setLoading(false)
        setHuynya(true)

      }
    };
  
    fetchChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overUserID, id]);

  
if(huynya){
  return <Navigate to='/'/>
}

  return (
    <div className='chat'>
      <LeftUsers thisID={user.id} />
      <section className='chat_section'>
        {loading ? <ChatLoader/> 
        : (
          <div className='chatInfo'>
            <div className='chatIcons'>
              <img src={user.photoURL} alt="" />
            </div>
            <span>{user.fullName}</span>

        
        </div>
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