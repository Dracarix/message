import { getAuth } from 'firebase/auth';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useAuth } from 'hooks/use-auth';
import { useEffect, useState } from 'react';
import { ChatObject } from 'types/user';

const Masseges = () => {
    const {name ,email , isAuth, id} = useAuth();
    const auth = getAuth();
    const [chats, setChats] = useState<ChatObject[]>([]);
    const db = getFirestore();
    useEffect(() => {
      const getChats = () => {
        const unsub = onSnapshot(doc(db, "UserChat", id.toString()), (doc) => {
          const data = doc.data();
          if(data){
            const chatObjects: ChatObject[] = Object.values(data);
            setChats(chatObjects);
            console.log(chatObjects)
          }
          
        });
  
        return () => {
          unsub();
        };
      };
  
      id && getChats();
    }, [id]);
  return (
    <div>
      Hello {name}
      <br/>
      and {email}
      <ul>
        {chats.map((chat)=> (
          <li key={chat.UserInfo.id}>
            <img src={chat.UserInfo.photoURL} alt={chat.UserInfo.name}/>
            <h3>{chat.UserInfo.name}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Masseges;