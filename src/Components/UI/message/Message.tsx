import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useAppSelector } from 'hooks/use-redux';
import { FC, useEffect, useState } from 'react';
import { MessagesType } from 'types/user';

const Message = () => {
    const {chatID} = useAppSelector((state) => state.chat);
    const [message, setMessage] = useState([]);
    const db = getFirestore();
    useEffect(() => {
        const unSub = onSnapshot(doc(db,"chats", chatID), (doc)=>{
            if (doc.exists()) {
                const data = doc.data().messages;

                if (data) {
                    setMessage(data);
                }
            }
        })
        return () => unSub();
    },[chatID])
    console.log(message)
  return (
    <div>
      {message.map((e) => (
        <Words word={e}/>
      ))}
    </div>
  );
};


const Words:FC<MessagesType> = ({word}) => {
  return (
    <div
      
  >
    <div className="messageInfo">
      <span>{word.date}</span>
    </div>
    <div className="messageContent">
      <p>{word.text}</p>
    </div>
  </div>
  );
};

export {Message, Words};