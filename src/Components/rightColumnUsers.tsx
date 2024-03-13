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
import { setGlobalError } from 'store/error';

export interface LeftUsersProps {
    thisID: string;
}
const LeftUsers:FC<LeftUsersProps> = ({thisID}) => {
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState<ChatObject[]>([]);
    const { id} = useAuth();
    const [vidno, setVidno] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
      
      const getChats = () => {

          setLoading(true)
        const unsub = onSnapshot(doc(db, "UserChat", id.toString()), (doc) => {
          const data = doc.data();

          if(data){
            const sortedChats: ChatObject[] = Object.values(data)
            .filter(i => i !== null && i.lastMessage)
            .sort((a, b) => {
              if (!a.lastMessage && !b.lastMessage) {
                  return 0;
              } else if (!a.lastMessage) {
                  return 1;
              } else if (!b.lastMessage) {
                  return -1;
              } else {
                  return b.lastMessage.date.seconds - a.lastMessage.date.seconds;
              }
          }).slice(0, 6);
            setChats(sortedChats);
            
            setTimeout(()=>{
              setLoading(false)
            },250)
          }else{
            
            setTimeout(()=>{
              setLoading(false)
            },250)
            setGlobalError('Похоже что произошка ошибка')
          }
        });
        return () => {
          unsub();
        };
        
      };
      getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    const handleSelect = (chat: ChatObject) => {
        dispatch(setChat({user:chat.UserInfo}));
        navigate(`/chat/${chat.UserInfo.id}`);
    }
    const handleMouseEnter = () => {
        setVidno(true)
    }
    const handleMouseLeave = () => {
        setVidno(false)
    }
    
  return (
    <div
      className='rightColumn'
    >
      <div className='main__right__column'>
        <ul style={{padding: 0, margin: 0}}>
          <li className='ChatsIcon' onClick={() => navigate('/')}>
            <span>Все чаты</span>
          </li>
        </ul>
        
        <div className='band__ChatsIcon'>
        <svg width="306" height="2" viewBox="0 0 306 2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="-0.000823975" y1="1" x2="306.001" y2="1" stroke="#727272"/>
        </svg>
  
        </div>
          <ul
            className='ChatsOtherUserColumn'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >   
            {loading ? (
                <>
                    <div className="ChatsIcon loading">
                        <div className="wrapper">
                            <div className="line"></div>
                        </div>
                    </div>
                    <div className="ChatsIcon loading">
                        <div className="wrapper">
                            <div className="line"></div>
                        </div>
                    </div>
                    <div className="ChatsIcon loading">
                        <div className="wrapper">
                            <div className="line"></div>
                        </div>
                    </div>
                    <div className="ChatsIcon loading">
                        <div className="wrapper">
                            <div className="line"></div>
                        </div>
                    </div>
                    <div className="ChatsIcon loading">
                        <div className="wrapper">
                            <div className="line"></div>
                        </div>
                    </div>
                </>
                    
            ): chats.length >= 2 && (
              chats.map((chat)=> (
                      <li 
                          className={chat.UserInfo.id !== thisID ? 'ChatsIcon' : 'ChatsIcon active'} 
                          key={chat.UserInfo.id} 
                          onClick={() => handleSelect(chat)}
                      >
                          <span>{chat.UserInfo.fullName}</span>
                          <img src={chat.UserInfo.photoURL} alt={chat.UserInfo.fullName}/>
                      </li>
              )))}
          </ul>
        </div>
    </div>
  );
};

export {LeftUsers};