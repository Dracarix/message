import { IsLoaderUsers} from 'Components/UI/isLoading/isLoading';
import { doc, getDoc, getFirestore} from 'firebase/firestore';
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { setChat } from 'store/users/chat.slice';
import { ChatObject } from 'types/user';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FinishMessages, StartMessages } from 'store/processes/processedMessages';
import { ReactComponent as Lupa } from '../svg/search-lupa.svg';
import { ReactComponent as CloseBtn } from '../svg/close.svg';
import { setDisabledInput, setWorkedInput } from 'store/searchUsers/mainInputDisabled';

const Messages: FC = () => { 
    const { id } = useAuth();
    const [searchValueSplide, setSearchValueSplide] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [fullChats, setFullChats] = useState<ChatObject[]>([]) 
    const [chats, setChats] = useState<ChatObject[]>([]);
    const [boolSearchValueSplide, setBoolSearchValueSplide ] = useState(false);
    const [chatsFilter, setChatsFilter] = useState<ChatObject[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    
    const dispatch = useAppDispatch();
    const { loadingMess } = useAppSelector((state) => state.processMessages);
    const [ignore, setIgnore] = useState(15);
    const itemsPerPage = 15;
    const navigate = useNavigate();
    const db = getFirestore();

    const generateChatID = (id1: string, id2: string) => {
        const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
        const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
        return (`${firstId}${secondId}`);
    };
    
    useEffect(() => {
        const getChats = async () => {
            dispatch(StartMessages());
            const docSnap = await getDoc(doc(db, "UserChat", id.toString()));
            const data = docSnap.data();
            
            if (data) {
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
                });
                
                setFullChats(sortedChats);
                setChats(sortedChats.slice(startIndex, startIndex + itemsPerPage));
                dispatch(FinishMessages());
            }
        };
        getChats();
    }, []);

    useEffect(()=> {
        if(searchValueSplide !== ''){
          setBoolSearchValueSplide(true)
          dispatch(setDisabledInput())
        }else{
            dispatch(setWorkedInput())
          setBoolSearchValueSplide(false)
        }
      }, [searchValueSplide])

    const handleSelect = (chat: ChatObject) => {
            dispatch(setChat({ chatID: generateChatID(id.toString(), chat.UserInfo.id) ,user: chat.UserInfo }));
            navigate(`/chat/${chat.UserInfo.id}`);
    };

    const SearchUsers = () => {
        console.log('1')
        if(searchValueSplide !== ''){
            const filteredChats = fullChats.filter(chat => chat.UserInfo.fullName.toLowerCase().includes(searchValueSplide.toLowerCase()));
            setChatsFilter(filteredChats);
            setIgnore(12)
        }else {
            setChatsFilter([]);
        }

    }

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.code === "Enter"){ 
            SearchUsers()
          }else if (e.code === "Escape"){
            handleClose();
          }
      };

      const handleClose = () => {
        setSearchValueSplide('');
        setChatsFilter([]);
      }

    const nextChats = async () => {
        const newItems = fullChats.slice(startIndex + ignore, startIndex + ignore + itemsPerPage);
        setChats(prevItems => {
            const filteredNewItems = newItems.filter(newItem => {
              
            return !prevItems.some(prevItem => prevItem.UserInfo.id === newItem.UserInfo.id);
          });
          return [...prevItems, ...filteredNewItems];
        });
        setStartIndex(prevIndex => prevIndex + itemsPerPage);
        setIgnore(0)
        if (startIndex + itemsPerPage >= fullChats.length) {
            setHasMore(false);
        }
        
    }


    return (
        <div className='rootBlock'>
            <div className='overUsersList'>
            <div style={{width: '70%' , position: 'relative', display: 'flex', justifyContent: 'center',left:'calc(6px + 2%)', margin: '12px 8px 12px 0px'}}>
            <Lupa className='lupa' onClick={SearchUsers} />
                <input 
                    type="text"
                    value={searchValueSplide} 
                    onChange={(e) => setSearchValueSplide(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder='Поиск'
                    style={{zIndex:1}}
                    className='inputSearch'
                    />
                            <TransitionGroup>
                    {boolSearchValueSplide ?( 
                        <CSSTransition 
                        timeout={500} 
                        classNames="close" unmountOnExit 
                        in={boolSearchValueSplide}
                        >

                    
                                <CloseBtn 
                                    onClick={handleClose}
                                    className='closebtn'
                                />
                        </CSSTransition>
                        )
                    : '' }
                    </TransitionGroup>
            </div>
                {loadingMess ? (
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%'}}>
                    <IsLoaderUsers/>
                    <IsLoaderUsers/>
                    <IsLoaderUsers/>
                    <IsLoaderUsers/>
                    <IsLoaderUsers/>
                    <IsLoaderUsers/>
                    <IsLoaderUsers/>
                </div>
                ): ( chatsFilter.length !== 0 ? (
                        <div className='chatUsersMain' >
                        {chatsFilter.map((chatFiltered)=> (
                            <button
                            className='ChatsOtherUser'
                            key={chatFiltered.UserInfo.id}
                                        onClick={() => handleSelect(chatFiltered)}
                                    >
                                        <img src={chatFiltered.UserInfo?.photoURL} loading='lazy' alt={chatFiltered.UserInfo.fullName}/>
                                        <div className='info__user_mess'>
                                            <h3>{chatFiltered.UserInfo.fullName}</h3>
                                            <p>{chatFiltered.lastMessage?.from === id.toString() 
                                            ? (<>Вы: <span className='LastMessage'> {chatFiltered.lastMessage?.text} </span></>) 
                                            : (<span className='LastMessage'>{chatFiltered.lastMessage?.text}</span>)}</p>
                                        </div>
                                    </button>
                                ))}
                                </div>
                            ):(
                            <InfiniteScroll 
                            next={nextChats} 
                            hasMore={hasMore} 
                            loader={''} 
                            dataLength={chats.length}
                            scrollThreshold={0.9}

                            >
                                <div className='chatUsersMain' >
                                {chats.map((chat, index) => (
                                    <button
                                        className="ChatsOtherUser"
                                        key={index}
                                        onClick={() => handleSelect(chat)}
                                    >
                                        <img src={chat.UserInfo.photoURL} loading='lazy' alt={chat.UserInfo.fullName} />
                                        <div className='info__user_mess'>
                                            <h3>{chat.UserInfo.fullName}</h3>
                                            <p>{chat.lastMessage?.from === id.toString() 
                                            ? (<>Вы: <span className='LastMessage'> {chat.lastMessage?.text} </span></>) 
                                            : (<span className='LastMessage'>{chat.lastMessage?.text}</span>)
                                            }</p>
                                        </div>
                                    </button>
                                ))}
                                </div>
                            </InfiniteScroll>
                        ))}
                    
                
            </div>
        </div>
    );
};

export default Messages;
