import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { IsModal } from 'Components/UI/isModal/isModal';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { openReAuth } from 'store/processes/isModal';
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { setChat } from 'store/users/chat.slice';
import { ChatObject } from 'types/user';


const Masseges = () => {
    const {firstName ,email , id} = useAuth();
    const dispatch = useAppDispatch();
    const {loading} = useAppSelector((state)=> state.process);
    const [chats, setChats] = useState<ChatObject[]>([]);
    const navigate = useNavigate();
    const db = getFirestore();
    useEffect(() => {
      
      const getChats = () => {
        dispatch(ProcessDataStart());
        const unsub = onSnapshot(doc(db, "UserChat", id.toString()), (doc) => {
          const data = doc.data();

          if(data){
            const chatObjects: ChatObject[] = Object.values(data);
            dispatch(ProcessDataSuccess())
            setChats(chatObjects);
            
          }
        });
        return () => {
          unsub();
        };
        
      };
      id ? getChats() : dispatch(ProcessDataFailure('Похоже что произошла ошибка'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSelect = (chat: ChatObject) => {
      dispatch(setChat({id: id ,id2:chat.UserInfo.id ,user:chat.UserInfo}));
      navigate('/chat');
    }
    if(loading){ return <IsLoadingBig/>}
  return (
    <div className='rootBlock'>
      Hello {firstName}
      <br/>
      and {email}
      <ul>
        {chats.map((chat)=> (
          <li 
            className='ChatsOtherUser' 
            key={chat.UserInfo.id} 
            onClick={() => handleSelect(chat)}
          >
            <img src={chat.UserInfo.photoURL} alt={chat.UserInfo.fullName}/>
            <h3>{chat.UserInfo.fullName}</h3>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default Masseges;