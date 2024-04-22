import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useAppSelector } from 'hooks/use-redux';
import { FC, useEffect, useState , useRef} from 'react';
import { MessagesType } from 'types/user';
import './messages.scss'
import { MessageLoader } from '../isLoading/chatLoader';
import { useAuth } from 'hooks/use-auth';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ScrollBottom } from 'Components/scrollTop';

interface chatIDtype  {chatID: string};

const Message:FC<chatIDtype> = ({chatID}) => {
    const [message, setMessage] = useState<MessagesType["word"][]>([]);
    const [fullMessage, setFullMessage] = useState<MessagesType["word"][]>([]);
    const [loading, setLoading] = useState(false);
    const { id} = useAuth()
    const [hasMore, setHasMore] = useState(true);
    const [startIndex, setStartIndex] = useState(0); // Состояние для хранения текущего индекса начала загружаемых элементов
    const itemsPerPage = 100;
    const db = getFirestore();
    const [ignore, setIgnore] = useState(15);
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
                    setLoading(false)
                    setFullMessage(data.reverse());
                    setMessage(data.slice(startIndex, startIndex + itemsPerPage));
                     
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
            {message.slice().map((e: MessagesType["word"]) => {
              if (e) {  
                return <Words key={e.id} word={e} />;
              }
              return null; 
            })}
            
            </>
            )
      }
      </InfiniteScroll>
    </div>
  );
};



const Words:FC<MessagesType> = ({word}) => {
  const {id} = useAppSelector((state) => state.user);
  const wordDate = word.date.toDate();

  const formattedTime = `${wordDate.getHours()}:${(wordDate.getMinutes() < 10 ? '0' : '') + wordDate.getMinutes()}`;

  return (
    <div>

    <div className={word.senderId === id.toString() ? 'messageContent-right' : 'messageContent-left'}>

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