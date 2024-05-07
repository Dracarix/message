import { useAppDispatch, useAppSelector } from "hooks/use-redux";
import { ReactComponent as Trash } from "../../../svg/trash.svg";
import { removeSelectMess } from "store/users/deleteMess";
import { openConfirmDelMess } from "store/processes/isModal";

const CheckedMess = () => {

  const {words} = useAppSelector(state => state.selectedMess);
  const dispatch = useAppDispatch()  

  const handleCloseSelect = () => {
    dispatch(removeSelectMess())
  }
  const handleDeleteSelect = () => {
    // if(overUserID){
    //   const chatID = generateChatId(overUserID , id.toString())
    //   words.forEach(async (i) => {
        
    //     await updateDoc(doc(db, "chats", chatID), {
    //       messages: arrayRemove({
    //         id: i.id ,
    //         text: i.text,
    //         senderId: i.senderId,
    //         date: i.date,
    //         img: i.img, 
    //       }),
    //     });
    //   })
    //   dispatch(removeSelectMess())
    // }
    dispatch(openConfirmDelMess())
    
  }

return (
    <div className='chatInfo selected__message'>
        <button className="default__btn close__select__btn"
          onClick={handleCloseSelect}
        >{words.length >= 1 && words.length} {''} <span className="Close__select"> Отменить</span></button>
        <button
          className="default__btn delete__select__btn"
          onClick={handleDeleteSelect}
        >
          <Trash width="35" height="35" className='trash__svg'/>Удалить
        </button>
    </div>
);
};
export default CheckedMess;