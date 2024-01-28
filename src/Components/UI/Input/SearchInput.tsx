import { Timestamp, arrayUnion, doc, getFirestore, serverTimestamp, updateDoc,  } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setGlobalError } from 'store/error';
import { v4 as uuid } from "uuid";
import '../../../images/attach.png';
import '../../../images/img.png';

interface InputProps {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}

const SearchInput:FC<InputProps> = ({value, onChange, onKeyDown}) => {
 

  return (
    <input 
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className='inputSearch'
     />
  );
};


const InputSend = () => {
  const storage = getStorage();
  const db = getFirestore();
  const [text, setText] = useState('');
  const [img, setImg] = useState<File | null>(null);
  const {chatID, user} = useAppSelector((state) => state.chat);
  const { id } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate()


  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          
        },
        (error) => {
          if (typeof error === 'string') {
            dispatch(setGlobalError(error));
            navigate('/error')
          } else {
            console.error('Неожиданный тип ошибки:', error);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL: any) => {
            await updateDoc(doc(db, "chats", chatID), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: user.id,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      if(text === ''){

      }else{
        await updateDoc(doc(db, "chats", chatID), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: user.id,
            date: Timestamp.now(),
          }),
        });
      }
      await updateDoc(doc(db, "UserChat", user.id), {
        [chatID + ".lastMessage"]: {
          text,
        },
        [chatID + ".date"]: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "UserChat", id.toString()), {
        [chatID + ".lastMessage"]: {
          text,
        },
        [chatID + ".date"]: serverTimestamp(),
      });
      setText('');
      setImg(null);
      }
      
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget === e.target) {
        handleSend();
    }

}

  return (
    <div className="inputSend">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleEnter}
      />
      <div className="send">
        <img src='../../../images/attach.png' alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files ? e.target.files[0] : null)}
          
        />
        <label htmlFor="file">
          <img src='../../../images/img.png' alt="" />
        </label>
        <button 
          onClick={handleSend}
          
        >Send</button>
      </div>
    </div>
  );
};

export {SearchInput, InputSend};

