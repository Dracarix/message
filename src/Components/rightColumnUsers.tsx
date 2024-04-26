import { getFirestore, onSnapshot, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setChat } from 'store/users/chat.slice';
import { UserInfoOnly } from 'types/user';
import { useAuth } from 'hooks/use-auth';
import { setGlobalError } from 'store/error';
import { ReactComponent as Close } from '../svg/close.svg';

export interface LeftUsersProps {
    thisID: string;
}

const LeftUsers:FC<LeftUsersProps> = ({thisID}) => {
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState<UserInfoOnly[]>([]);
    const {user} = useAppSelector(state => state.chat)
    const { id} = useAuth();
    const [vidno, setVidno] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
      
      const getChats = () => {

          setLoading(true)
        const unsub = onSnapshot(doc(db, "users", id.toString()), (doc) => {
          const data = doc.data()?.selectedUsers as UserInfoOnly[];

          if(data){
            

              
              setChats(data.slice(0, 10));
              
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
    const handleSelect = (chat: UserInfoOnly[][0]) => {
        dispatch(setChat({user:chat}));
        navigate(`/chat/${chat.id}`);
    }
    const handleMouseEnter = () => {
        setVidno(true)
    }
    const handleMouseLeave = () => {
        setVidno(false)
    }
    const deleteSelectedUser = async(chat: UserInfoOnly[][0]) =>{
        if(chat.id === user.id){
          await updateDoc(doc(db, 'users',id.toString() ),{
            selectedUsers:arrayRemove({
              
                id: chat.id,
                fullName: chat.fullName,
                photoURL: chat.photoURL,
             
            })
          })
          navigate('/')
        }
        await updateDoc(doc(db, 'users',id.toString() ),{
          selectedUsers:arrayRemove({
            
              id: chat.id,
              fullName: chat.fullName,
              photoURL: chat.photoURL,
           
          })
        })
      
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
                    
            ): chats.length >= 1 &&  (
              chats.map((chat, index)=> (
                      <li 
                          className={chat.id !== thisID ? 'ChatsIcon' : 'ChatsIcon active'} 
                          key={index} 
                          onClick={() => handleSelect(chat)}
                      >
                          <img src={chat.photoURL} alt={chat.fullName}/>
                          <span>{chat.fullName}</span>
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