import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { collection, doc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { setSearchUserData } from 'store/searchUsers/searchUsers';
import { setChat } from 'store/users/chat.slice';
import { ChatObject, SearchUserState } from 'types/user';

const Messages: FC = () => { // Изменено имя компонента на Messages
    const { id } = useAuth();
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.process);
    const [chats, setChats] = useState<ChatObject[]>([]);
    const [boolSearchValue, setBoolSearchValue ] = useState(false);
    const navigate = useNavigate();

    const db = getFirestore();
    const generateChatID = (id1: string, id2: string) => {
        const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
        const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
        return (`${firstId}${secondId}`);
    };
    useEffect(() => {
        const getChats = () => {
            dispatch(ProcessDataStart());
            const unsub = onSnapshot(doc(db, "UserChat", id.toString()), (doc) => {
                const data = doc.data();

                if (data) {
                    const chatObjects: ChatObject[] = Object.values(data);
                    dispatch(ProcessDataSuccess())
                    setChats(chatObjects);
                }
            });
            return () => {
                unsub();
            };
        };
        getChats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    useEffect(()=> {
        if(searchValue !== ''){
          setBoolSearchValue(true)
        }else{
          setBoolSearchValue(false)
        }
      }, [searchValue])
    
    const handleSelect = (chat: ChatObject) => {
            dispatch(setChat({ chatID: generateChatID(id.toString(), chat.UserInfo.id) ,user: chat.UserInfo }));
            navigate(`/chat/${chat.UserInfo.id}`);
    };
    const SearchUsers = async () => {
        const q = query(
            collection(db, "UserChat" , id.toString()),
            where("fullName", ">=", searchValue),
            where("fullName", "<=", searchValue + '\uf8ff')
          );
          try{
            dispatch(ProcessDataStart());
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty){
                dispatch(ProcessDataSuccess())
                const usersData = querySnapshot.docs.map((doc) => {
                  const data = doc.data() as SearchUserState; // Уточняем тип данных
                  return data;
                });
                dispatch(setSearchUserData(usersData))
      
            }else{
              dispatch(ProcessDataFailure('нет таких пользователей'));
              dispatch(setSearchUserData([]))
            console.log('нет таких пользователей')
      
            }
            
          }catch(err: any){
            dispatch(ProcessDataFailure(err.message));
            console.error(err.message)
          };
    }
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.code === "Enter" && SearchUsers();
      };
      const handleClose = () => {
        setSearchValue('')
      }
    if (loading) { 
        return <IsLoadingBig/>; 
    }

    return (
        <div className='rootBlock'>
            <div className='overUsersList'>
            <div style={{width: '50%' , position: 'relative', display: 'flex', justifyContent: 'center'}}>
                <img className='lupa' src='https://firebasestorage.googleapis.com/v0/b/messager-react-1753d.appspot.com/o/images-norm.png?alt=media&token=9a602fcd-c85e-4bab-bb8e-cad0e9e12ed1' alt=''/>
                <input 
                    type="text"
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder='Поиск'

                    className='inputSearch'
                    />
                            <TransitionGroup>
                    {boolSearchValue ?( 
                        <CSSTransition 
                        timeout={500} 
                        classNames="close" unmountOnExit 
                        in={boolSearchValue}
                        >

                    
                        <svg onClick={handleClose} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 16 16" className='closebtn'>
                            <path fill="currentColor" d="M9 9v4a1 1 0 1 1-2 0V9H3a1 1 0 1 1 0-2h4V3a1 1 0 1 1 2 0v4h4a1 1 0 1 1 0 2H9Z"></path>
                        </svg>
                        </CSSTransition>
                        )
                    : '' }
                    </TransitionGroup>
    </div>
                <ul >
                    {chats.map((chat) => (
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
        </div>
    );
};

export default Messages;
