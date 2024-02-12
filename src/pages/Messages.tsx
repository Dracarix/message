import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import useChatID from 'hooks/useChatID';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { setChat } from 'store/users/chat.slice';
import { ChatObject } from 'types/user';

const Messages: FC = () => { // Изменено имя компонента на Messages
    const { firstName, email, id } = useAuth();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.process);
    const [chats, setChats] = useState<ChatObject[]>([]);
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
    }, [id]);

    const handleSelect = (chat: ChatObject) => {
        
        dispatch(setChat({ chatID: generateChatID(id.toString(), chat.UserInfo.id) ,user: chat.UserInfo }));
        navigate(`/chat/${chat.UserInfo.id}`);
    };

    if (loading) { 
        return <IsLoadingBig/>; 
    }

    return (
        <div className='rootBlock'>
            Hello {firstName}
            <br/>
            and {email}
            <ul>
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
    );
};

export default Messages;
