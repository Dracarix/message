/* eslint-disable react-hooks/exhaustive-deps */
import { doc, getDoc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import { FC, useEffect, useState , useRef} from 'react';
import { ChatObject, MessagesType } from 'types/user';
import './messages.scss'
import { MessageLoader } from '../isLoading/chatLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ScrollBottom } from 'Components/scrollTop';
import {ReactComponent as CheckboxLabel} from '../../../svg/checkbox__message.svg'
import { removeSelectMess, setSelectMess } from 'store/users/deleteMess';
import React from 'react';
import { useParams } from 'react-router-dom';
import { generChatID } from 'hooks/generateChatID';
import CheckIcon from './CheckIcon';
import { removeEditMess } from 'store/users/editMess.slice';

interface chatIDtype  {chatID: string};

const Message:FC<chatIDtype> = ({chatID}) => {
    const [message, setMessage] = useState<MessagesType["word"][]>([]);
    const [fullMessage, setFullMessage] = useState<MessagesType["word"][]>([]);
    const [loading, setLoading] = useState(false);
  const {id} = useAppSelector((state) => state.user);
    const [hasMore, setHasMore] = useState(true);
    const [startIndex, setStartIndex] = useState(0); // Состояние для хранения текущего индекса начала загружаемых элементов
    const itemsPerPage = 30;
    const db = getFirestore();
    // const [ignore, setIgnore] = useState(15);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //   if (messagesEndRef.current ) {
    //     messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    //   }
    //   console.log(fullMessage);
      
    // }, [message]);
   
    useEffect(() => {
      
        const unSub = onSnapshot(doc(db,"chats", chatID), (doc)=>{
          setFullMessage([])
          setMessage([])
          setHasMore(true)
          setStartIndex(0)
            setLoading(true)

            if (doc.exists()) {
                const data = doc.data()?.messages as MessagesType["word"][];

                if (data) {
                  const filteredData = data.reverse().filter(i => {
                      return !(i.deleteFor && i.deleteFor === id.toString());
                  })
                    setLoading(false)
                    setFullMessage(filteredData);
                    setMessage(filteredData.slice(startIndex, startIndex + itemsPerPage));
                     
                }else{
                    setLoading(false)
                   
                }
            }
        })

        return () => unSub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[chatID])
    const nextMess = () => {

      const newItems = fullMessage.slice(startIndex +  startIndex +  itemsPerPage);
      console.log(newItems);

    
      setMessage(prevItems => {
            const filteredNewItems = newItems.filter(newItem => {
              
            return !prevItems.some(prevItem => prevItem.id === newItem.id);
          });
          return [ ...prevItems ,...filteredNewItems ];
        });
        setStartIndex(prevIndex => prevIndex + itemsPerPage);
      if (startIndex + itemsPerPage >= fullMessage.length) {
        setHasMore(false);
      }
    }

  return (
    <div className='soobsheniya' id='soobsheniya'>
      <InfiniteScroll 
      next={nextMess} 
      hasMore={hasMore} 
      loader={''} 
      dataLength={message.length}
      inverse={true}
      scrollThreshold={0.1}
      scrollableTarget="soobsheniya"
      style={{ display: "flex", flexDirection: "column-reverse", overflow: "visible" }}

      >
        
        {loading 
          ? <MessageLoader/>
          :( <>
          <ScrollBottom 
          />
              <div id='bottom__message' ref={messagesEndRef} />
            {/* {message.slice().map((e: MessagesType["word"]) => {
              if (e) {   */}
              <Words  message={message} />
              {/* }
              return null; 
            })} */}
            
            </>
            )
      }
      </InfiniteScroll>
    </div>
  );
};


const Words = ({ message }: { message: MessagesType["word"][] }) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<MessagesType["word"][] >([]);
  const { overUserID } = useParams();
  const {id} = useAppSelector((state) => state.user);
  const db = getFirestore()
  const dispatch = useAppDispatch();
  const {words} = useAppSelector(state => state.selectedMess);



  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, wordInfo: MessagesType['word']) => {
    
      if (event.target.checked) {
        setSelectedCheckboxes((prevState) => [...prevState, wordInfo]);
      } else {
        setSelectedCheckboxes((prevState) => prevState.filter((e) => e.id !== wordInfo.id));
      }
    
  };
  useEffect(() => {
    // заполнение массива обьектами каждого сообщения

      
      const refs: {[key: string]: {ref: React.RefObject<HTMLInputElement>, word: MessagesType['word']}} = {};
      message.forEach(word => {
        refs[word.id] = {
          // ненужный реф
          ref: React.createRef<HTMLInputElement>(),
          // сами сообщения
          word: word
        };
      });
      const refArr = Object.values(refs);
      
      const editLastMess = async (item: MessagesType['word']) =>{
        if(overUserID){
          const chatID = generChatID(id.toString(), overUserID);
          const thisUser = await getDoc(doc(db, 'UserChat', id.toString()));
          const data1 = thisUser.data();
          if (data1) {
            const datathisUser: ChatObject[] = Object.values(data1);
            let thisUserInfo = {} as ChatObject;
            datathisUser.forEach((item) => {
              if (item.UserInfo && item.UserInfo.id === overUserID) {
                thisUserInfo = item;
              }
            });

            if (item.id === thisUserInfo?.lastMessage?.messID && item.senderId === overUserID) {
              console.log('1');
              await updateDoc(doc(db, "UserChat", id.toString()), {
                [chatID + ".lastMessage"]: {
                  text: thisUserInfo?.lastMessage?.text,
                  date: thisUserInfo?.lastMessage?.date,
                  from: thisUserInfo?.lastMessage?.from,
                  for: thisUserInfo?.lastMessage?.for,
                  messID: thisUserInfo?.lastMessage?.messID,
                  checked: true,
                },
              });
            }
          }
        }

      }
      
      async function CheckFunc() {
        if(overUserID){
          const chatID = generChatID(id.toString(), overUserID);
          const DocSnap = await getDoc(doc(db, "chats", chatID));
          
          
          const dataChat = DocSnap.data()?.messages as MessagesType['word'][];
          if (dataChat) {
            for (const item of refArr) {
              const IChecked = item.word.checkedFor;
              if (IChecked && IChecked.length >= 1) {
                let messageChecked = false;
                // если массив чека имеет что либо
                for (const thisMess of IChecked) {
                  if (thisMess.id === id.toString()) {
                    messageChecked = true;
                    break;
                  }
                }
                if (!messageChecked) {
                  const deleteChatMe = dataChat.map((i) => {
                    const newCheck = [...IChecked, { id: id.toString() }];
                    if (i.deleteFor) {
                      return {
                        id: i.id,
                        text: i.text,
                        senderId: i.senderId,
                        date: i.date,
                        img: i.img,
                        checkedFor: newCheck,
                        deleteFor: i.deleteFor,
                      };
                    } else {
                      return {
                        id: i.id,
                        text: i.text,
                        senderId: i.senderId,
                        date: i.date,
                        img: i.img,
                        checkedFor: newCheck,
                      };
                    }
                  });
    
                  await updateDoc(doc(db, "chats", chatID), { messages: deleteChatMe });
    
                  // если ластовое сообщение в массиве то меняем ласт месс
  
                  editLastMess(item.word)
               
                }
              }
            }
          }
        }
          // если есть айди челика в чате ???? как потом сделать беседу???

        
      }
    
      CheckFunc();

 
  
  }, [message]);
  


  useEffect(()=>{
    if(selectedCheckboxes.length !== 0){
      dispatch(setSelectMess(selectedCheckboxes))
    }else(
      dispatch(removeSelectMess())
    )
  },[selectedCheckboxes])
  useEffect(()=>{

    if(words.length === 0 && selectedCheckboxes.length !== 0){
      const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

      checkboxes.forEach(function(checkbox) {
          checkbox.checked = false;
      });
      dispatch(removeEditMess())
      setSelectedCheckboxes([])
      
    }
  },[words])
  return (
    <>
    {message.slice().map((word:MessagesType["word"])=>{
      return(

        <div>

    <input 
      type='checkbox' 
      id={`checkMess ${word.id}`}
      key={word.id}  
      className='checkMessInput'
      onChange={(event) => handleCheckboxChange(event, word)}

    />
    <label htmlFor={`checkMess ${word.id}`} className={`messageContent-main ${word.senderId === id.toString() ? 'messageContent-right' : 'messageContent-left'}`}>
    <label htmlFor={`checkMess ${word.id}`} className="customCheckMess"><CheckboxLabel width="35" height="35"/></label>
      <div className='block_mess'>

        <div className='img-mess' style={{
          display: word.img !== null ? 'block' : 'none'
        }}>

          {word.img !== null && 
            <img src={word.img} alt={word.img}/>
          }
        </div>

        <p style={{display: word.text === "" ? 'none' : 'block'}}>{word.text}</p>
        {word.edited && <p>
        Изменено
        </p>}
        {word.senderId === id.toString() ?(
          overUserID && word.checkedFor?.some((e)=> e.id === overUserID) 
          ? ( <CheckIcon cheeeeeck={true} />)
          : (<CheckIcon cheeeeeck={false}/>)
        ):(<></>)}
        
        
        <div className="messageInfo">
           <span>{`${word.date && word.date.toDate().getHours()}:${(word.date && word.date.toDate().getMinutes() < 10 ? '0' : '') + (word.date && word.date.toDate().getMinutes())}`}</span>
        </div>
      </div>
      
    </label>
    </div>
      )
      })}
      </>
  );
};
export {Message, Words};