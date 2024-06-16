import { arrayRemove, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuth } from "hooks/use-auth";
import { useAppDispatch, useAppSelector } from "hooks/use-redux";
import {  useState } from "react";
import { useParams } from "react-router-dom";
import { closeModal } from "store/processes/isModal";
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
                     
                      if(i.deleteFor){ // если с галочкой и есть удалено кем то
                        await updateDoc(doc(db, "chats", chatID), {
                          messages: arrayRemove({
                          id: i.id ,
                          text: i.text,
                          senderId: i.senderId,
                          date: i.date,
                          img: i.img, 
                          deleteFor: i.deleteFor,
                          checkedFor:i.checkedFor,
                          
                          }),
                      });
                        
                        if(i.edited){// если с галочкой , удалено кем то так еще и изменялось
                          await updateDoc(doc(db, "chats", chatID), {
                            messages: arrayRemove({
                              id: i.id,
                              text: i.text,
                              senderId: i.senderId,
                              date: i.date,
                              img: i.img,
                              deleteFor: i.deleteFor,
                              checkedFor:i.checkedFor,
                              edited:i.edited,
                            }),
                          });
                        }
                      }else{ // если с галочкой и нет удалено кем то
                        await updateDoc(doc(db, "chats", chatID), {
                          messages: arrayRemove({
                          id: i.id ,
                          text: i.text,
                          senderId: i.senderId,
                          date: i.date,
                          img: i.img, 
                          checkedFor:i.checkedFor,
                          }),
                      });
                        if(i.edited){// если с галочкой , не удалено кем то  и изменялось
                          await updateDoc(doc(db, "chats", chatID), {
                            messages: arrayRemove({
                              id: i.id,
                              text: i.text,
                              senderId: i.senderId,
                              date: i.date,
                              img: i.img,
                              checkedFor:i.checkedFor,
                              edited:i.edited,
                            }),
                          });
                        }
                      }
                    
                    })
                    dispatch(removeSelectMess())
                    setConfirmAllDel(false)
                    closeThisModal()
                
            }else{ // если без галочки
              
                const chatID = generateChatId(overUserID , id.toString())
                for (let i = 0; i < words.length; i++) {
                  const word = words[i];
                  if (word.deleteFor) {// если без галочки , удалялось кем то  
                    
                    await updateDoc(doc(db, "chats", chatID), {
                      messages: arrayRemove({
                        id: word.id,
                        text: word.text,
                        senderId: word.senderId,
                        date: word.date,
                        img: word.img,
                        deleteFor: word.deleteFor,
                        checkedFor:word.checkedFor,
                      }),
                    });
                    if(word.edited){// если без галочки , удалялось кем то  и изменялось
                      await updateDoc(doc(db, "chats", chatID), {
                        messages: arrayRemove({
                          id: word.id,
                          text: word.text,
                          senderId: word.senderId,
                          date: word.date,
                          img: word.img,
                          deleteFor: word.deleteFor,
                          checkedFor:word.checkedFor,
                          edited:word.edited,
                        }),
                      });
                    }
                  } else {// если без галочки и не удаляось никем
                    const messages:MessagesType["word"][] = chatDoc.data().messages.map((message:MessagesType["word"]) => {
                      if (message.id === word.id) {
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
                }
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
        <div className="default__confirm__modal">
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