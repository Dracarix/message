import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useAppSelector } from 'hooks/use-redux';
import React from 'react';
import { FC, useEffect, useState } from 'react';
import { MessagesType } from 'types/user';
import './message.scss'

interface chatIDtype  {chatID: string};

const Message:FC<chatIDtype> = ({chatID}) => {

    const {id} = useAppSelector((state) => state.user);
    const [message, setMessage] = useState([]);
    const db = getFirestore();
    useEffect(() => {
      
        const unSub = onSnapshot(doc(db,"chats", chatID), (doc)=>{
            if (doc.exists()) {
                const data = doc.data()?.messages;

                if (data) {
                    setMessage(data);
                }
            }
        })

        return () => unSub();
    },[chatID])
  return (
    <div className='soobsheniya'>
{message.map((e: MessagesType["word"]) => {
  if (e) {  
    return <Words key={e.id} word={e} />;
  }
  return null; 
})}
    </div>
  );
};


const Words:FC<MessagesType> = ({word}) => {
  const {id} = useAppSelector((state) => state.user);
  const wordDate = word.date.toDate();
  const formattedTime = `${wordDate.getHours()}:${(wordDate.getMinutes() < 10 ? '0' : '') + wordDate.getMinutes()}`;

  return (
    <div>

    <div className={word.senderId !== id.toString() ? 'messageContent-right' : 'messageContent-left'}>

      <div className='block_mess'>

        <div className='img-mess' style={{
          display: word.img !== null ? 'block' : 'none'
        }}>

          {word.img !== null && 
            <img src={word.img} alt={word.img}/>
          }
        </div>

        <p style={{display: word.text === "" ? 'none' : 'block'}}>{word.text}</p>
        <div className="messageInfo">
          <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export {Message, Words};