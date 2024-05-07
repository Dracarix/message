import { useAppDispatch, useAppSelector } from "hooks/use-redux";
import { ReactComponent as Trash } from "../svg/trash.svg";
import { closeModal, openConfirmDelChat } from "store/processes/isModal";
import { FC, useEffect, useState } from "react";
import {  ChatObject, ChatObjectItem, MessagesType } from "types/user";
import { ProcessDataFailure } from "store/processes/process";
import { deleteDoc, deleteField, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuth } from "hooks/use-auth";
import { IsLoadingMini } from "./UI/isLoading/isLoading";

const DeleteChat = ({chat , UserID }: ChatObjectItem) => {
    const dispatch = useAppDispatch();
    const db = getFirestore();
    const {id} = useAuth()
    const generateChatId = (id1: string , id2: string) => {
        const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
        const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
        return `${firstId}${secondId}`;
      };
    const handleDeleteChat = async (event: React.MouseEvent<HTMLDivElement>) => {
        if(chat){
            event.stopPropagation()
            dispatch(openConfirmDelChat(chat))
        }else if(UserID){
            await getDoc(doc(db, "UserChat", id.toString())).then((doc)=>{
                const data = doc.data();
                if(data){
                    
                    const chatId = generateChatId(id.toString(), UserID);
                    const selectDelete = data[chatId] as ChatObject;
                    if(selectDelete.UserInfo){
                        event.stopPropagation()
                        dispatch(openConfirmDelChat(selectDelete))
                    }
                }
            })
        }
    }
return (
    <div className='delete__chat' onClick={handleDeleteChat}>
        <Trash className='trash__svg' width='20px' height='20px'/>
    </div>
);
};
interface LoadState {
    load: boolean, 
    setLoad: React.Dispatch<React.SetStateAction<boolean>>,
}
const ModalDelChat:FC<LoadState> = ({load, setLoad}) => {
    const [confirmAllDel, setConfirmAllDel] = useState(false) 
    const {confirmDelChatObj } = useAppSelector(state =>  state.isModalReduser);
    const dispatch = useAppDispatch();
    const {id} = useAuth();
    const db = getFirestore();
    const generateChatId = (id1: string , id2: string) => {
        const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
        const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
        return `${firstId}${secondId}`;
      };

      useEffect(()=>{
        console.log();
      })
    const handleConfirmAllDell = () => {
        
        if(confirmAllDel){
            setConfirmAllDel(false)
            
        }else{
            setConfirmAllDel(true)
        }
    }

    const closeThisModal = () => {
        dispatch(closeModal());
        dispatch(ProcessDataFailure(null));
      };

    const handleAllDeleteChat = async () => {
        setLoad(true)
        if(confirmDelChatObj){
            const otherUserID = confirmDelChatObj?.UserInfo.id;
            console.log(otherUserID);
            const chatID = generateChatId(id.toString(), otherUserID)
            console.log(chatID);
            if(confirmAllDel){
                await deleteDoc(doc(db, "chats", chatID));
                await updateDoc(doc(db, "UserChat", id.toString()),{
                    [chatID]: deleteField(),
                })
                await updateDoc(doc(db, "UserChat", otherUserID),{
                    [chatID]: deleteField(),
                })
                setLoad(false)
            }else{
                console.log('1');
                const DocSnap = await getDoc(doc(db, "chats", chatID));
                const chatDocRef = doc(db, "chats", chatID);
                const data = DocSnap.data()?.messages as MessagesType['word'][];
                if(data){
                    
                        
                        const deleteChatMe = data.map((i)=>{
                           
                                return {
                                    id: i.id,
                                    text: i.text,
                                    senderId: i.senderId,
                                    date: i.date,
                                    img: i.img,
                                    deleteFor: id.toString(),
                                };
                            
                            
                        })
                        await updateDoc(chatDocRef, { messages: deleteChatMe });
                        await updateDoc(doc(db, "UserChat", id.toString()),{
                            [chatID]: deleteField(),
                        })
                        
                  
                        setLoad(false)
                }else{
                    setLoad(false)
                dispatch(ProcessDataFailure('че то не то'));
                }
            }
        }else{
            setLoad(false)
            dispatch(ProcessDataFailure('че то не то'));
        }
            
        
        
    } 
    if(load){
        return(
            <div>
                <IsLoadingMini/>
            </div>
        )
    }
return(
    <div  style={{display:'flex',flexDirection: 'column', alignItems:'center',justifyContent:'center'}}>
        <h3>Удалить чат для {confirmDelChatObj?.UserInfo.fullName}? </h3>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:'100%', gap: '10px'}}>
        <label className="checkbox-container">
            <input className="custom-checkbox" checked={confirmAllDel}  type="checkbox" onChange={handleConfirmAllDell}/>
            <span className="checkmark">
            </span>
            <p>Удалить так же для <br /> {confirmDelChatObj?.UserInfo.fullName}?</p>
        </label>
        <div style={{
          width:'50%',
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          gap:'12px'
        }}>
        <button
              className="main__btn__del_mess"
              onClick={closeThisModal}
            >
            Отменить
            </button>
            <button
              onClick={handleAllDeleteChat}
              className="main__btn__del_mess delete"
            >
            Удалить
            </button>
        </div>
        </div>
    </div>
)
}
export {DeleteChat, ModalDelChat};