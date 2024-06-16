import { Timestamp, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getMetadata, getStorage,  ref,  uploadBytesResumable } from "firebase/storage";
import { useAuth } from 'hooks/use-auth';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { useEffect, useRef, useState } from 'react';
import './input.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from "uuid";
import { ProcessDataFailure, ProcessDataStart, ProcessDataSuccess } from 'store/processes/process';
import CryptoJS from 'crypto-js';
import { setSearchUserData } from 'store/searchUsers/searchUsers';
import { MessagesType, SearchUserState } from 'types/user';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ReactComponent as Lupa } from '../../../svg/search-lupa.svg';
import { ReactComponent as CloseBtn } from '../../../svg/close.svg';
import ImgFile from '../../../Images/img.png';
import SendBtn from '../../../Images/send-btn.png';
import { ReactComponent as SendArrow } from '../../../svg/arrow-send.svg';
import { ReactComponent as Close } from '../../../svg/close.svg';
import { removeEditMess } from 'store/users/editMess.slice';
import { removeSelectMess } from 'store/users/deleteMess';
import { IsLoadingMini } from '../isLoading/isLoading';


const SearchInput = () => {
 
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { id, fullName, photoURL} = useAuth();
  const dispatch = useAppDispatch();
  const db = getFirestore();
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
        
        navigate(`/message/chat/${user.id}`);
      }else{
        navigate(`/message/chat/${user.id}`);
      }
    }catch(err: any){
      dispatch(ProcessDataFailure(err.code));
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

      }
      
    
  }
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.code === "Enter"){ 
      SearchUsers()
    }else if (e.code === "Escape"){
      handleClose();
    }
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.key === "Enter"){ 
      SearchUsers();
    }
  };
  const fullSearch = () => {
    handleClose();
    setSearchUserData([]);
    setSearchValue('');
    navigate(`/message/search/${navValue}`);
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
        onKeyUp={handleKeyUp}
        placeholder='Поиск'
        disabled = {need ? false : true}
        className='inputSearch'
        enterKeyHint='search'
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


type Disabled = {disabled: boolean};
const InputSend = ({disabled}: Disabled) => {
  const storage = getStorage();
  const db = getFirestore();
  const [unprocessedText, setUnprocessedText] = useState('');
  const [loadingSend, setLoadingSend] = useState(false)
  const [img, setImg] = useState<File | null>(null);
  const [saveEditText, setSaveEditText] = useState('')
  const { overUserID } = useParams();
  const {user} = useAppSelector((state) => state.chat);
  const [chatID, setChatID] = useState('');
  const { id } = useAuth();
  const dispatch = useAppDispatch();
  const {editMess} = useAppSelector((state)=> state.editMess);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const generateChatID = (id1: string, id2: string) => {
    const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
    const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
    return (`${firstId}${secondId}`);
};
useEffect(()=>{
  if(overUserID){
    setChatID(generateChatID(id.toString(),overUserID))
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[overUserID])
useEffect(()=>{
  if(editMess && inputRef.current){
    setUnprocessedText(editMess.text);
    inputRef.current.focus()
    setSaveEditText(editMess.text)
  }
},[editMess])
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
      
      dispatch(ProcessDataFailure(error.code))
      return null;
    }
  };

  const handleSend = async () => {
    setLoadingSend(true);
    const text = unprocessedText.trim().replace(/\n+/g, ' ');
    if(text === '' && img === null){
      setLoadingSend(false);
      setUnprocessedText('');
    }
    if(!editMess){
      // Если нет редактирования сообщения
      if (img) {
        //Если есть Картинка 
        if(user){
        const hash = await calculateHash(img);
        const imageUrl = await getImageUrlFromStorage(hash);
        if (imageUrl) {
          if(chatID !== ''){
            const newIdMess = uuid();
            setUnprocessedText('');
            setImg(null);
            await updateDoc(doc(db, "chats", chatID), {
              messages: arrayUnion({
                id: newIdMess,
                text,
                senderId: id,
                date: Timestamp.now(),
                img: imageUrl, 
                checkedFor: [{id: id.toString()}],
              }),
            });
            if(text !== ''){
  
              await updateDoc(doc(db, "UserChat", user.id), {
                [chatID + ".lastMessage"]: {
                  text,
                  date:Timestamp.now(),
                  from: id.toString(),
                  messID: newIdMess,
                  for: overUserID,
                },
                [chatID + ".date"]: serverTimestamp(),
              }).catch((err) => {
                dispatch(ProcessDataFailure(err.code));
              });
      
              await updateDoc(doc(db, "UserChat", id.toString()), {
                [chatID + ".lastMessage"]: {
                  text,
                  date:Timestamp.now(),
                  messID: newIdMess,
                  from: id.toString(),
                  for: overUserID,
                },
                [chatID + ".date"]: serverTimestamp(),
              }).catch((err) => {
                dispatch(ProcessDataFailure(err.code));
              });
              setLoadingSend(false)
            }else{
              await updateDoc(doc(db, "UserChat", user.id), {
                [chatID + ".lastMessage"]: {
                  text: 'Изображение',
                  date:Timestamp.now(),
                  messID: newIdMess,
                  from: id.toString(),
                  for: overUserID,
                  
                },
                [chatID + ".date"]: serverTimestamp(),
              }).catch((err) => {
                dispatch(ProcessDataFailure(err.code));
              });
      
              await updateDoc(doc(db, "UserChat", id.toString()), {
                [chatID + ".lastMessage"]: {
                  text: 'Изображение',
                  date:Timestamp.now(),
                  from: id.toString(),
                  messID: newIdMess,
                  for: overUserID,
                },
                [chatID + ".date"]: serverTimestamp(),
              }).catch((err) => {
                dispatch(ProcessDataFailure(err.code));
              });
              setLoadingSend(false)
            }
  
          }
          
  
        } else {
          const storageRef = ref(storage, hash);
          const uploadTask = uploadBytesResumable(storageRef, img);
  
          uploadTask.on(
            'state_changed',
            // Обработчик прогресса загрузки, если нужно
            (snapshot) => {
               
            },
            (error: any) => {
              
              dispatch(ProcessDataFailure(error.code))
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(storageRef);
                if(chatID !== ''){
                  const newIdMess = uuid()
                  setUnprocessedText('');
                  setImg(null);
                  await updateDoc(doc(db, "chats", chatID), {
                    messages: arrayUnion({
                      id: newIdMess,
                      text,
                      senderId: id,
                      date: Timestamp.now(),
                      img: downloadURL,
                      checkedFor: [{id: id.toString()}],
                    }),
                  });
                  if(text !== ''){
  
                    await updateDoc(doc(db, "UserChat", user.id), {
                      [chatID + ".lastMessage"]: {
                        text,
                        date:Timestamp.now(),
                        from: id.toString(),
                        messID: newIdMess,
                        for: overUserID,
                      },
                      [chatID + ".date"]: serverTimestamp(),
                    }).catch((err) => {
                      dispatch(ProcessDataFailure(err.code));
                    });
            
                    await updateDoc(doc(db, "UserChat", id.toString()), {
                      [chatID + ".lastMessage"]: {
                        text,
                        date:Timestamp.now(),
                        from: id.toString(),
                        messID: newIdMess,
                        for: overUserID,
                      },
                      [chatID + ".date"]: serverTimestamp(),
                    }).catch((err) => {
                      dispatch(ProcessDataFailure(err.code));
                    });
                    setLoadingSend(false)
                  }else{
                    await updateDoc(doc(db, "UserChat", user.id), {
                      [chatID + ".lastMessage"]: {
                        text: 'Изображение',
                        date:Timestamp.now(),
                        messID: newIdMess,
                        from: id.toString(),
                        for: overUserID,
                      },
                      [chatID + ".date"]: serverTimestamp(),
                    }).catch((err) => {
                      dispatch(ProcessDataFailure(err.code));
                    });
            
                    await updateDoc(doc(db, "UserChat", id.toString()), {
                      [chatID + ".lastMessage"]: {
                        text: 'Изображение',
                        date:Timestamp.now(),
                        messID: newIdMess,
                        from: id.toString(),
                        for: overUserID,
                      },
                      [chatID + ".date"]: serverTimestamp(),
                    }).catch((err) => {
                      dispatch(ProcessDataFailure(err.code));
                    });
                    setLoadingSend(false)
                  }
                }
                
                
              } catch (error: any) {
               dispatch(ProcessDataFailure(error.code))
              }
            }
          );
        }
              
      }
      } else {
        // Логика для отправки сообщения без изображения
        if(user){
          
        if(chatID !== ''){
  
          if (text !== '') {
            setUnprocessedText('');
            setImg(null);
            const dataChat = await getDoc(doc(db,"chats", chatID))
            const dataChatHave = dataChat.data()
            if(dataChatHave){
              const newIdMess = uuid();
              const newMessage = {
                id: newIdMess,
                text,
                senderId: id,
                date: Timestamp.now(),
                img: null,
                checkedFor: [{id: id.toString()}],
              };
            await updateDoc(doc(db, "chats", chatID), {
              messages: arrayUnion(newMessage),
            })
            
            console.log(newIdMess);
            await updateDoc(doc(db, "UserChat", user.id), {
              [chatID + ".lastMessage"]: {
                text,
                date:Timestamp.now(),
                messID: newIdMess,
                from: id.toString(),
                for: overUserID,
              },
              [chatID + ".date"]: serverTimestamp(),
            }).catch((err) => {
              dispatch(ProcessDataFailure(err));
            });
            console.log(newIdMess);
            await updateDoc(doc(db, "UserChat", id.toString()), {
              [chatID + ".lastMessage"]: {
                text,
                date:Timestamp.now(),
                from: id.toString(),
                messID: newIdMess,
                for: overUserID,
              },
              [chatID + ".date"]: serverTimestamp(),
            }).catch((err) => {
              dispatch(ProcessDataFailure(err));
            });
            setLoadingSend(false)
            }else{
              await setDoc(doc(db, "chats", chatID), { messages:[] });
              setLoadingSend(false)
            }
           
  
        }
      }
              
    }
      }
    }else{
       // Если есть редактирование сообщения
      if(text !== ''){
        if(text !== saveEditText){
          // Если текст не редачили 
          setUnprocessedText('');
          setImg(null);
          setSaveEditText('')
          const DocSnap = await getDoc(doc(db, "chats", chatID));
          const chatDocRef = doc(db, "chats", chatID);
          const data = DocSnap.data()?.messages as MessagesType['word'][];
          if(data){
            const editThisMess = data.map((i) => {
              if(editMess.id === i.id){
                if(i.deleteFor){
                  return {
                    id: i.id,
                    text: text,
                    senderId: i.senderId,
                    date: i.date,
                    img: i.img,
                    checkedFor:i.checkedFor,
                    edited: true,
                    deleteFor:i.deleteFor
                  }
                }else{
                  return {
                    id: i.id,
                    text: text,
                    senderId: i.senderId,
                    date: i.date,
                    img: i.img,
                    checkedFor:i.checkedFor,
                    edited: true
                  };
                }
  
              }else{
                return i
              }
                       
            })
            await updateDoc(chatDocRef, { messages: editThisMess });
            dispatch(removeEditMess())
            dispatch(removeSelectMess())
            setLoadingSend(false)
          }
        }else{
          setUnprocessedText('');
          setImg(null);
          setSaveEditText('')
          dispatch(removeEditMess())
          setLoadingSend(false)
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
    e.target.value = '';
  };

  return (
    <div className="inputSend">
      {img && (
        <div className='selected__img'>
          <img  src={URL.createObjectURL(img)} alt='Загруженное изображение'/>
          <button 
            style={{border: 'none', background: 'none', padding: 0}}
            onClick={()=> setImg(null)}
          >
            <Close className='Close__selected__img' width='25px' height='25px'/>
          </button>
        </div>

      ) }
      <input
        type='text'
        placeholder="Введите что нибудь..."
        onChange={(e) => setUnprocessedText(e.target.value)}
        value={unprocessedText}
        onKeyDown={handleEnter}
        disabled={disabled}
        ref={inputRef}
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
          <img src={ImgFile} alt="" />
        </label>
        <button 
          onClick={handleSend}
          disabled={loadingSend}
          style={{
            border: 'none', 
            background: 'transparent'
          }}
        >{loadingSend 
          ?<IsLoadingMini/>
          :<SendArrow/>
        }
        </button>
      </div>
     
    </div>
  );
};

export {SearchInput, InputSend }