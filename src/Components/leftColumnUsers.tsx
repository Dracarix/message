import { getFirestore, onSnapshot, doc } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessDataStart, ProcessDataSuccess, ProcessDataFailure } from 'store/processes/process';
import { setChat } from 'store/users/chat.slice';
import { ChatObject } from 'types/user';
import { IsLoadingBig } from './UI/isLoading/isLoading';
import { useAuth } from 'hooks/use-auth';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface LeftUsersProps {
    thisID: string;
}
const LeftUsers:FC<LeftUsersProps> = ({thisID}) => {
    const [chats, setChats] = useState<ChatObject[]>([]);
    const { id} = useAuth();
    const [vidno, setVidno] = useState(false);
    const {loading} = useAppSelector((state)=> state.process);
    const dispatch = useAppDispatch();
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
    const handleMouseEnter = () => {
        setVidno(true)
    }
    const handleMouseLeave = () => {
        setVidno(false)
    }
    if(loading){ return <IsLoadingBig/>}
    
  return (
    <ul
    className='ChatsOtherUserColumn'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}

    >   
        {chats.map((chat)=> (
            chat.UserInfo.id !== thisID && (
                <li 
                    className='ChatsIcon' 
                    key={chat.UserInfo.id} 
                    onClick={() => handleSelect(chat)}
                >
                    <img src={chat.UserInfo.photoURL} alt={chat.UserInfo.fullName}/>
                    <TransitionGroup>
                        {vidno && (
                        <CSSTransition 
                        timeout={400} 
                        classNames="leftColumn" unmountOnExit 
                        in={vidno}
                        >
                        <h3>{chat.UserInfo.fullName}</h3>
                        </CSSTransition>
                    )}
                    </TransitionGroup>  
                    
                </li>
            )
        
            
          
        ))}
    </ul>
  );
};

export {LeftUsers};