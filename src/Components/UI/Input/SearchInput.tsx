import { Timestamp, arrayUnion, doc, getFirestore, serverTimestamp, updateDoc,  } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { FC, useState } from 'react';
import './input.scss'
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from "uuid";
import { ProcessDataFailure } from 'store/processes/process';
import { setGlobalError } from 'store/error';

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
  const navigate = useNavigate();
  const {error} = useAppSelector((state) => state.process);

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
            setText('');
            setImg(null);
          });
        }
      );
    } else {
      
      if(text !== ''){
        
        const newMessage = {
          id: uuid(),
          text,
          senderId: user.id,
          date: Timestamp.now(),
          img: null,
        };
        await updateDoc(doc(db, "chats", chatID), {
          messages: arrayUnion(newMessage),
        }).catch((err) => {
          dispatch(ProcessDataFailure(err))
        })
      
      console.log('2')
      await updateDoc(doc(db, "UserChat", user.id), {
        [chatID + ".lastMessage"]: {
          text,
        },
        [chatID + ".date"]: serverTimestamp(),
      }).catch((err) => {
        dispatch(ProcessDataFailure(err))
      })
      console.log('3')
      await updateDoc(doc(db, "UserChat", id.toString()), {
        [chatID + ".lastMessage"]: {
          text,
        },
        [chatID + ".date"]: serverTimestamp(),
      }).catch((err) => {
        dispatch(ProcessDataFailure(err))
      })
      setText('');
      setImg(null);
      }
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
        <input
            type="file"
            accept="video/*,image/*"
          style={{display:'none'}}
          id="image"
          onChange={(e) => setImg(e.target.files ? e.target.files[0] : null)}
          alt="Кнопка загрузки изображения"
        />
        <label htmlFor="image">
          <img src='https://firebasestorage.googleapis.com/v0/b/messager-react-1753d.appspot.com/o/img.png?alt=media&token=c1afb4e2-be38-4ff5-ad4d-3b029f9efb76' alt="" />
        </label>
        <button 
          onClick={handleSend}
          style={{
            border: 'none', 
            background: 'transparent'
          }}
        >
          <img 
          src='https://firebasestorage.googleapis.com/v0/b/messager-react-1753d.appspot.com/o/send-btn.png?alt=media&token=c4cd439b-c2b3-4a83-8d35-af74b8bc4a67' 
          alt=''
          className='img_send'
          />
        </button>
      </div>
     
      {error && error}
    </div>
  );
};

export {SearchInput, InputSend};

