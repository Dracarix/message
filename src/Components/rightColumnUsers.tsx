import { getFirestore, onSnapshot, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setChat } from 'store/users/chat.slice';
import { ChatObject, UserInfoOnly } from 'types/user';
import { useAuth } from 'hooks/use-auth';
import { ReactComponent as Close } from '../svg/close.svg';
import { ProcessDataFailure } from 'store/processes/process';

export interface LeftUsersProps {
    thisID: string;
}

const LeftUsers:FC<LeftUsersProps> = ({thisID}) => {
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState<ChatObject[]>([]);
    const {user} = useAppSelector(state => state.chat)
    const [userChat, setUserChat] = useState<ChatObject[]>([])
    const [userSelect, setUserSelect] = useState<UserInfoOnly[]>([])
    const { id} = useAuth();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const db = getFirestore();
    

    // ЮзерСелект инфа подписка иначе нет обновления компонента в рил лайф
    useEffect(()=>{
      const getUserChats = () => {

        const unsubChats = onSnapshot(doc(db, "UserChat", id.toString()), (doc) => {
          const data = doc.data() as ChatObject[];
  
          if(data){
            const chat: ChatObject[] = Object.values(data)
            .filter((i)=> i !== null && i.UserInfo)
  
            setUserChat(chat)
  
            
          }else{
            
            
              setLoading(false)
            
            dispatch(ProcessDataFailure('Похоже что произошка ошибка'))
          }
        });
        return () => {
          unsubChats();
          
        };
      }
      getUserChats()
    },[id])
     // ЮзерЧатс инфа подписка иначе нет обновления компонента в рил лайф
    useEffect(()=>{
      const getUserSelects = () => {

        const unsubUsers = onSnapshot(doc(db, "users", id.toString()), (doc) => {
          const data = doc.data()?.selectedUsers as UserInfoOnly[];
  
          if(data){
  
            setUserSelect(data)   
  
          }else{
            
            
              setLoading(false)
            
            dispatch(ProcessDataFailure('Похоже что произошка ошибка'))
          }
        });
        return  ()=> {
          unsubUsers();
        }
      }
      getUserSelects()
    },[id])
    useEffect(() => {
      
      const getChats = () => {

          setLoading(true)
        
        const mainChats: ChatObject[] = []
        for(const item of userChat){
          for(const elem of userSelect){
            if(item.UserInfo.id === elem.id){
              mainChats.push(item)
            }
          }
        }
        
        setChats(mainChats.slice(0, 10))
        setLoading(false)
        
      };
      getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userSelect, userChat]);

    const handleSelect = (chat: ChatObject[][0]) => {
        dispatch(setChat({user:chat.UserInfo}));
        navigate(`/message/chat/${chat.UserInfo.id}`);
    }

    const deleteSelectedUser = async(chat: ChatObject[][0]) =>{
        if(chat.UserInfo.id === user?.id){
          await updateDoc(doc(db, 'users',id.toString() ),{
            selectedUsers:arrayRemove({
              
                id: chat.UserInfo.id,
                fullName: chat.UserInfo.fullName,
                photoURL: chat.UserInfo.photoURL,
             
            })
          })
          navigate('/message/')
        }
        await updateDoc(doc(db, 'users',id.toString() ),{
          selectedUsers:arrayRemove({
            
              id: chat.UserInfo.id,
              fullName: chat.UserInfo.fullName,
              photoURL: chat.UserInfo.photoURL,
           
          })
        })
      
    }
  return (
    <div
      className='rightColumn'
    >
      <div className='main__right__column'>
        <ul style={{padding: 0, margin: 0}}>
          <li className='ChatsIcon' onClick={() => navigate('/message/')}>
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
                    
            ): chats.length >= 1 &&  (
              chats.map((chat, index)=> (
                      <li 
                          className={chat.UserInfo.id !== thisID ? 'ChatsIcon' : 'ChatsIcon active'} 
                          key={index} 
                          onClick={() => handleSelect(chat)}
                      > 
                          <div className='Images__block'>
                            <img src={chat.UserInfo.photoURL} alt={chat.UserInfo.fullName}/>

                            {chat.lastMessage?.for === id.toString() 
                            ? chat.lastMessage?.checked  
                                ? ('') 
                                :(
                                  <div className='new__message'>
                                      ?
                                    </div>
                                )
                            : ''
                             
                            }
                          </div>
                          
                          <span>{chat.UserInfo.fullName}</span>
                          <Close onClick={(event: React.MouseEvent)=>{ 
                            event.stopPropagation();
                            deleteSelectedUser(chat);
                          }} className='delete__user__column' width='25px' height='25px'/>
                      </li>
              )))}
          </ul>
        </div>
    </div>
  );
};

export {LeftUsers};