import { Timestamp, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getMetadata, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { FC, useEffect, useState } from 'react';
import './input.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from "uuid";
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import { setGlobalError } from 'store/error';
import CryptoJS from 'crypto-js';
import { setSearchUserData } from 'store/searchUsers/searchUsers';
import { SearchUserState } from 'types/user';
import { TransitionGroup, CSSTransition } from 'react-transition-group';



const SearchInput = () => {
 
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { id, fullName, photoURL} = useAuth();
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const {error} = useAppSelector((state)=> state.process);
  const userSearchData: SearchUserState[] = useAppSelector((state)=> state.setSearchUsers.users);
  const [boolSearchValue, setBoolSearchValue ] = useState(false);

  useEffect(()=> {
    if(searchValue !== ''){
      setBoolSearchValue(true)
    }else{
      setBoolSearchValue(false)
    }
  }, [searchValue])
  const generateChatId = (id1: string, id2: string) => {
    const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
    const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
    return `${firstId}${secondId}`;
  };
  const handleSelect = async (user: SearchUserState) => {
    const combinedId = generateChatId(id.toString(), user.id.toString());
    try{
      const res = await getDoc(doc(db, "chats",combinedId))
      
      if(!res.exists()){
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db,"UserChat", id.toString()), {
          [combinedId + ".UserInfo"]: {
            id: user.id,
            fullName: user.fullName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp()
        });

        await updateDoc(doc(db,"UserChat", user.id.toString()), {
          [combinedId + ".UserInfo"]: {
            id: id,
            fullName: fullName,
            photoURL: photoURL,
          },
          [combinedId + ".date"]: serverTimestamp()
        })
        navigate(`/chat/${user.id}`);
      }else{
        
      }
    }catch(err: any){
      dispatch(ProcessDataFailure(err))
      dispatch(setSearchUserData([]))
    }
    dispatch(setSearchUserData([]));
    setSearchValue('');
  } 
  
  const SearchUsers = async () => {
    const q = query(
      collection(db, "users"),
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
  return (
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
                {userSearchData.length >= 1 ? (
            <ul className='user-list'>
            {userSearchData.map((user) => (
              user.id !== id && (
                  <li 
                  style={{cursor: 'pointer'}}
                  key={user.id} 
                  className="user-item"
                  onClick={() => handleSelect(user)}
                  >
                  <img src={user.photoURL} alt={user.fullName} />
                  <div>
                    <p>first name: {user.firstName}</p>
                  </div>
                </li>
              )
              ))}
          </ul>
        ) : (
            ''
            )}
            {error && <div style={{position: 'absolute', top: '10%', backgroundColor: 'grey'}}><span>{error}</span>
        </div>}
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
  );
};

const inputSearchHaveUsers = () => {

}

const InputSend = () => {
  const storage = getStorage();
  const db = getFirestore();
  const [text, setText] = useState('');
  const [img, setImg] = useState<File | null>(null);
  const { overUserID } = useParams();
  const {user} = useAppSelector((state) => state.chat);
  const { id } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {error} = useAppSelector((state) => state.process);
  const generateChatID = (id1: string, id2: string) => {
    const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
    const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
    return (`${firstId}${secondId}`);
};

  const calculateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const hash = CryptoJS.SHA256(wordArray);
    return hash.toString(CryptoJS.enc.Hex);
  };
  
  const getImageUrlFromStorage = async (hash: string): Promise<string | null> => {
    try {
      const imageRef = ref(storage, hash);
        await getMetadata(imageRef);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        return null;
      }
      console.error('Ошибка при получении URL-адреса изображения:', error);
      return null;
    }
  };

  const handleSend = async () => {
    if (img) {
      const hash = await calculateHash(img);
      const imageUrl = await getImageUrlFromStorage(hash);
      if (imageUrl) {
        console.log('Изображение уже существует:', imageUrl);
        if(overUserID){

          await updateDoc(doc(db, "chats", generateChatID(id.toString(),overUserID)), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: user.id,
              date: Timestamp.now(),
              img: imageUrl, 
            }),
          });
        }
        setText('');
        setImg(null);
      } else {
        console.log('Изображение не существует в Storage, загружаем новое...');
        const storageRef = ref(storage, hash);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          'state_changed',
          // Обработчик прогресса загрузки, если нужно
          (snapshot) => {
            // Добавьте обработчик прогресса загрузки, если требуется
          },
          (error: any) => {
            if (typeof error === 'string') {
              dispatch(setGlobalError(error));
              navigate('/error');
            } else {
              console.error('Неожиданный тип ошибки:', error);
            }
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(storageRef);
              if(overUserID){

                await updateDoc(doc(db, "chats", generateChatID(id.toString(),overUserID)), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: user.id,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              }
              setText('');
              setImg(null);
            } catch (error) {
              console.error('Ошибка при получении URL-адреса изображения:', error);
            }
          }
        );
      }
    } else {
      // Логика для отправки сообщения без изображения
      if(overUserID){

        if (text !== '') {
          const newMessage = {
            id: uuid(),
            text,
            senderId: user.id,
          date: Timestamp.now(),
          img: null,
        };
        await updateDoc(doc(db, "chats", generateChatID(id.toString(),overUserID)), {
          messages: arrayUnion(newMessage),
        }).catch((err) => {
          dispatch(ProcessDataFailure(err));
        });

        await updateDoc(doc(db, "UserChat", user.id), {
          [generateChatID(id.toString(),overUserID) + ".lastMessage"]: {
            text,
          },
          [generateChatID(id.toString(),overUserID) + ".date"]: serverTimestamp(),
        }).catch((err) => {
          dispatch(ProcessDataFailure(err));
        });

        await updateDoc(doc(db, "UserChat", id.toString()), {
          [generateChatID(id.toString(),overUserID) + ".lastMessage"]: {
            text,
          },
          [generateChatID(id.toString(),overUserID) + ".date"]: serverTimestamp(),
        }).catch((err) => {
          dispatch(ProcessDataFailure(err));
        });
        
        setText('');
        setImg(null);
      }
    }
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget === e.target) {
        handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files ? e.target.files[0] : null;
    setImg(file);
  };

  return (
    <div className="inputSend">
      {img ? (
        <div> ок</div>
      ) :('')}
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
          onChange={handleFileChange}
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

export {SearchInput, InputSend, inputSearchHaveUsers};
