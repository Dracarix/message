import { useAuth } from "hooks/use-auth";
import { useEffect, useState } from "react";
import { ChatObject } from "types/user";
import { DeleteChat } from "./deleteChat";
import useDynamicSoundNotification from '../sound/uvedomlenie-o-poluchennoy-pochte.ogg';
import { useAppSelector } from "hooks/use-redux";


type messNotification = {
    userLastMess: ChatObject
    numNotif?: number
}
const NotificationsMess = ({userLastMess, numNotif}:messNotification) => {
    const [isVisible, setIsVisible] = useState(false);
    const {id} = useAuth();
    const {activeUser} = useAppSelector((state) => state.activeUser);
    const [numberMess , setNumberMess] = useState(1)
  
    useEffect(() => {
      const interval = setInterval(() => {
        setIsVisible(prev => !prev);
      }, 2000); 
  
      return () => clearInterval(interval);
    }, []);
    useEffect(()=>{
      if(activeUser){
        if(numberMess && numberMess > 0){
          setNumberMess(numberMess - 1)
          const audioNotification = new Audio(useDynamicSoundNotification);
          audioNotification.play()
        }
      }
    },[isVisible])
    return (
      <div className='info__user_mess'>
        
        {userLastMess.lastMessage?.for === id.toString() && isVisible ? (
            <>
            <h3>{userLastMess.UserInfo.fullName}</h3>
             <p>
                 <span className='LastMessage'>Не прочитанные сообщения</span>
             </p>
            </>
                 
        ) : (
          <>
            <h3>{userLastMess.UserInfo.fullName}</h3>
            <p>{userLastMess.lastMessage?.from === id.toString()
              ? (<>Вы: <span className='LastMessage'> {userLastMess.lastMessage?.text} </span></>)
              : (<span className='LastMessage'>{userLastMess.lastMessage?.text}</span>)}
            </p>
            <DeleteChat chat={userLastMess} />
          </>
        )}
      </div>
    );
  }
  const DefaultLastMess = ({userLastMess}:messNotification) => {
    const {id} = useAuth()
    return(
      <div className='info__user_mess'>
        <h3>{userLastMess.UserInfo.fullName}</h3>
        <p>{userLastMess.lastMessage?.from === id.toString() 
        ? (<>Вы: <span className='LastMessage'> {userLastMess.lastMessage?.text} </span></>) 
        : (<span className='LastMessage'>{userLastMess.lastMessage?.text}</span>)
        }</p>
        <DeleteChat chat={userLastMess} />
      </div>
    )
  }
  export {NotificationsMess, DefaultLastMess};
  