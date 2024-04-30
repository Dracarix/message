import { arrayRemove, arrayUnion, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuth } from "hooks/use-auth";
import { useAppDispatch, useAppSelector } from "hooks/use-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { closeModal, openConfirmDelMess } from "store/processes/isModal";
import { ProcessDataFailure } from "store/processes/process";
import { removeSelectMess } from "store/users/deleteMess";
import { MessagesType } from "types/user";

const DeleteMessConfirm = () => {
const [confirmAllDel, setConfirmAllDel] = useState(false) 
const dispatch = useAppDispatch()  
const {words} = useAppSelector(state => state.selectedMess);
const { overUserID } = useParams();
const {id } = useAuth()
const db = getFirestore()

const generateChatId = (id1: string , id2: string) => {
  const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
  const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
  return `${firstId}${secondId}`;
};

const handleConfirmAllDell = () => {
    if(confirmAllDel){
        setConfirmAllDel(false)
        
    }else{
        setConfirmAllDel(true)
    }
}

// useEffect(()=>{
//   console.log(confirmAllDel);
// },[confirmAllDel])
    const handleDeleteSelectAll = async () => {
        if(overUserID){
          const chatID = generateChatId(overUserID , id.toString())
          const chatDocRef = doc(db, "chats", chatID);
          const chatDoc = await getDoc(chatDocRef);
          if (chatDoc.exists()) {
            if(confirmAllDel){
            
                   
                    words.forEach(async (i) => {
                      if(i.deleteFor){
                        await updateDoc(doc(db, "chats", chatID), {
                          messages: arrayRemove({
                          id: i.id ,
                          text: i.text,
                          senderId: i.senderId,
                          date: i.date,
                          img: i.img, 
                          deleteFor: i.deleteFor,
                          }),
                      });
                      }else{
                        await updateDoc(doc(db, "chats", chatID), {
                          messages: arrayRemove({
                          id: i.id ,
                          text: i.text,
                          senderId: i.senderId,
                          date: i.date,
                          img: i.img, 
                          }),
                      });
                      }
                    
                    })
                    dispatch(removeSelectMess())
                    setConfirmAllDel(false)
                    closeThisModal()
                
            }else{
                const chatID = generateChatId(overUserID , id.toString())
                words.forEach(async (i) => {
                  if(i.deleteFor){
                    await updateDoc(doc(db, "chats", chatID), {
                      messages: arrayRemove({
                        id: i.id ,
                        text: i.text,
                        senderId: i.senderId,
                        date: i.date,
                        img: i.img, 
                        deleteFor: i.deleteFor,
                      }),
                    });
                  }else{
                    const messages:MessagesType["word"][] = chatDoc.data().messages.map((message: MessagesType["word"]) => {
                      if (message.id === i.id) {
                          return {
                              id: message.id,
                              text: message.text,
                              senderId: message.senderId,
                              date: message.date,
                              img: message.img,
                              deleteFor: id.toString(),
                          };
                      }
                      return message;
                  });
                  await updateDoc(chatDocRef, { messages });
                  }
                  
                })
                dispatch(removeSelectMess())
                setConfirmAllDel(false)
                closeThisModal()
            }
          }
        }
      }
      const closeThisModal = () => {
        dispatch(closeModal());
        dispatch(ProcessDataFailure(null));
      };
return (
    <div
    style={{display:'flex',flexDirection: 'column', alignItems:'center',justifyContent:'center'}}>
        <h3>
            Вы действительно хотите удалить сообщение?
        </h3>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:'100%'}}>
        <label className="checkbox-container">
            <input className="custom-checkbox" checked={confirmAllDel} type="checkbox" onChange={handleConfirmAllDell}/>
            <span className="checkmark">
            </span>
            <p>Удалить у всех?</p>
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
              onClick={handleDeleteSelectAll}
              className="main__btn__del_mess delete"
            >
            Удалить
            </button>
        </div>
            
        </div>
       
    </div>
);
};
export default DeleteMessConfirm;