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
import { ReactComponent as Lupa } from '../../../svg/search-lupa.svg';
import { ReactComponent as CloseBtn } from '../../../svg/close.svg';


const SearchInput = () => {
 
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { id, fullName, photoURL} = useAuth();
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const {error} = useAppSelector((state)=> state.process);
  const userSearchData: SearchUserState[] = useAppSelector((state)=> state.setSearchUsers.users);
  const [neverSearch, setNeverSearch] = useState<SearchUserState[]>([]);
  const [navValue, setNavValue] = useState('')
  const [boolSearchValue, setBoolSearchValue ] = useState(false);
  const [boolSearchNever, setBoolSearchNever ] = useState(false);
  const {need} = useAppSelector((state) => state.needMainInput)

  useEffect(()=> {
    if(searchValue !== ''){
      setBoolSearchValue(true)
    }else{
      setBoolSearchValue(false)
    }
  }, [searchValue])
  useEffect(()=> {
    if(userSearchData.length){
      setBoolSearchNever(true)
    }else{
      setBoolSearchNever(false)
    }
  },[userSearchData])
  
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
          [combinedId + ".date"]: serverTimestamp(),
          
        });
        
        await updateDoc(doc(db,"UserChat", user.id.toString()), {
          [combinedId + ".UserInfo"]: {
            id: id,
            fullName: fullName,
            photoURL: photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
          
        })
        
        navigate(`/chat/${user.id}`);
      }else{
        navigate(`/chat/${user.id}`);
      }
    }catch(err: any){
      dispatch(setGlobalError(err))
      dispatch(setSearchUserData([]))
    }
    dispatch(setSearchUserData([]));
    setSearchValue('');
  } 
  
  const SearchUsers = async () => {
      setNavValue(searchValue);
      dispatch(ProcessDataStart());
      const querySnapshot = await getDocs(collection(db, "users"));
      if(!querySnapshot.empty){
         const usersSearch: SearchUserState[] = [];
          querySnapshot.forEach((doc) => {
            const userData = doc.data() as SearchUserState;
            usersSearch.push(userData);
          })
          const res = usersSearch
          .filter(user => user.fullName && user.fullName.toLowerCase()
          .includes(searchValue.toLowerCase()));
          setNeverSearch(res)

          dispatch(ProcessDataSuccess())
          dispatch(setSearchUserData(res.slice(0, 5)))

      }else{
        dispatch(ProcessDataFailure('нет таких пользователей'));
        dispatch(setSearchUserData([]))
      console.log('нет таких пользователей')

      }
      
    
  }
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.code === "Enter"){ 
      SearchUsers()
    }else if (e.code === "Escape"){
      handleClose();
    }
  };

  const fullSearch = () => {
    handleClose();
    setSearchUserData([]);
    setSearchValue('');
    navigate(`/search/${navValue}`);
  }
  const handleClose = () => {
    setSearchValue('');
    dispatch(ProcessDataFailure(null));
    setBoolSearchNever(false);
    setTimeout(()=>{
      dispatch(setSearchUserData([]))
    },500)
    
  }
  return (
    <div style={{width: '50%' , position: 'relative', display: 'flex', justifyContent: 'center'}}>
      <Lupa className='lupa' onClick={SearchUsers} />
      <input 
        type="text"
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder='Поиск'
        disabled = {need ? false : true}
        className='inputSearch'
        />
                {userSearchData.length >= 1 ? (
                  <div className="modal__mini"
                  onClick={handleClose}>
                  <TransitionGroup
                  style={{zIndex:2}}>
                    {boolSearchNever && (

                    <CSSTransition 
                    timeout={100} 
                    
                    classNames="search" unmountOnExit 
                    in={boolSearchNever}
                    >
                      

                      
                          <div className='user-list'>
                          {userSearchData.map((user) => (
                            user.id !== id && (
                                <button 
                                style={{cursor: 'pointer'}}
                                key={user.id} 
                                className="user-item"
                                onClick={() => handleSelect(user)}
                                >
                                <img src={user.photoURL} alt={user.fullName} />
                                <div className='nameUsersSearch'>
                                  <p>{user.fullName}</p>
                                </div>
                              </button>
                            )
                            ))}
                            {neverSearch.length > 5 && 
                              <button
                              className='allSearchBtn'
                              onClick={fullSearch}
                              >Показать все</button>
                            }
                        </div>
                        
                    </CSSTransition>
                    )}
                  </TransitionGroup>
                  </div>
        ) : (
            ''
            )}
            {error && <div style={{position: 'absolute', top: '10%', backgroundColor: 'grey'}}><span>{error}</span>
        </div>}
        <TransitionGroup>
          {boolSearchValue &&( 
              <CSSTransition 
              timeout={500} 
              classNames="close" unmountOnExit 
              in={boolSearchValue}
              >

          
              <CloseBtn 
                onClick={handleClose} 
                className='closebtn'
              />
                
              </CSSTransition>
            )}
          </TransitionGroup>
    </div>
  );
};


const inputSearchHaveUsers = () => {

}


type Disabled = {disabled: boolean};
const InputSend = ({disabled}: Disabled) => {
  const storage = getStorage();
  const db = getFirestore();
  const [text, setText] = useState('');
  const [img, setImg] = useState<File | null>(null);
  const { overUserID } = useParams();
  const {user} = useAppSelector((state) => state.chat);
  const [chatID, setChatID] = useState('');
  const { id } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {error} = useAppSelector((state) => state.process);
  const generateChatID = (id1: string, id2: string) => {
    const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
    const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
    return (`${firstId}${secondId}`);
};
useEffect(()=>{
  if(overUserID){
    setChatID(generateChatID(id.toString(),overUserID))
  }
},[overUserID])
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
        if(chatID !== ''){

          await updateDoc(doc(db, "chats", chatID), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: user.id,
              date: Timestamp.now(),
              img: imageUrl, 
            }),
          });
          if(text !== ''){

            await updateDoc(doc(db, "UserChat", user.id), {
              [chatID + ".lastMessage"]: {
                text,
                date:Timestamp.now(),
                from: id.toString(),
              },
              [chatID + ".date"]: serverTimestamp(),
            }).catch((err) => {
              dispatch(ProcessDataFailure(err));
            });
    
            await updateDoc(doc(db, "UserChat", id.toString()), {
              [chatID + ".lastMessage"]: {
                text,
                date:Timestamp.now(),
                from: id.toString(),
              },
              [chatID + ".date"]: serverTimestamp(),
            }).catch((err) => {
              dispatch(ProcessDataFailure(err));
            });
          }else{
            await updateDoc(doc(db, "UserChat", user.id), {
              [chatID + ".lastMessage"]: {
                text: 'Изображение',
                date:Timestamp.now(),
                from: id.toString(),
              },
              [chatID + ".date"]: serverTimestamp(),
            }).catch((err) => {
              dispatch(ProcessDataFailure(err));
            });
    
            await updateDoc(doc(db, "UserChat", id.toString()), {
              [chatID + ".lastMessage"]: {
                text: 'Изображение',
                date:Timestamp.now(),
                from: id.toString(),
              },
              [chatID + ".date"]: serverTimestamp(),
            }).catch((err) => {
              dispatch(ProcessDataFailure(err));
            });
          }

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
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              // Обновляем состояние вашего компонента с процентами
              setUploadProgress(progress);
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
              if(chatID !== ''){

                await updateDoc(doc(db, "chats", chatID), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: user.id,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
                if(text !== ''){

                  await updateDoc(doc(db, "UserChat", user.id), {
                    [chatID + ".lastMessage"]: {
                      text,
                      date:Timestamp.now(),
                      from: id.toString(),
                    },
                    [chatID + ".date"]: serverTimestamp(),
                  }).catch((err) => {
                    dispatch(ProcessDataFailure(err));
                  });
          
                  await updateDoc(doc(db, "UserChat", id.toString()), {
                    [chatID + ".lastMessage"]: {
                      text,
                      date:Timestamp.now(),
                      from: id.toString(),
                    },
                    [chatID + ".date"]: serverTimestamp(),
                  }).catch((err) => {
                    dispatch(ProcessDataFailure(err));
                  });
                }else{
                  await updateDoc(doc(db, "UserChat", user.id), {
                    [chatID + ".lastMessage"]: {
                      text: 'Изображение',
                      date:Timestamp.now(),
                      from: id.toString(),
                    },
                    [chatID + ".date"]: serverTimestamp(),
                  }).catch((err) => {
                    dispatch(ProcessDataFailure(err));
                  });
          
                  await updateDoc(doc(db, "UserChat", id.toString()), {
                    [chatID + ".lastMessage"]: {
                      text: 'Изображение',
                      date:Timestamp.now(),
                      from: id.toString(),
                    },
                    [chatID + ".date"]: serverTimestamp(),
                  }).catch((err) => {
                    dispatch(ProcessDataFailure(err));
                  });
                }
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
      if(chatID !== ''){

        if (text !== '') {
          
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
          dispatch(ProcessDataFailure(err));
        });
        
        await updateDoc(doc(db, "UserChat", user.id), {
          [chatID + ".lastMessage"]: {
            text,
            date:Timestamp.now(),
            from: id.toString(),
          },
          [chatID + ".date"]: serverTimestamp(),
        }).catch((err) => {
          dispatch(ProcessDataFailure(err));
        });
        await updateDoc(doc(db, "UserChat", id.toString()), {
          [chatID + ".lastMessage"]: {
            text,
            date:Timestamp.now(),
            from: id.toString(),
          },
          [chatID + ".date"]: serverTimestamp(),
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
        disabled={disabled}
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
