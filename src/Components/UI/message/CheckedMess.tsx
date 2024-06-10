import { useAppDispatch, useAppSelector } from "hooks/use-redux";
import { ReactComponent as Trash } from "../../../svg/trash.svg";
import { removeSelectMess } from "store/users/deleteMess";
import { openConfirmDelMess } from "store/processes/isModal";
import { EditMess } from "Components/EditMess";
import { useAuth } from "hooks/use-auth";
import { ReactComponent as CloseBtn } from '../../../svg/close.svg';
import { removeEditMess } from "store/users/editMess.slice";

const CheckedMess = () => {

  const {words} = useAppSelector(state => state.selectedMess);
  const dispatch = useAppDispatch();
  const {id} = useAuth();
  const {editMess} = useAppSelector((state)=> state.editMess);


  const handleCloseSelect = () => {
    dispatch(removeSelectMess())
    dispatch(removeEditMess())
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
      {editMess 
      ? <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <button className='default__btn' style={{display:'flex', alignItems:'center'}}>  
              <CloseBtn 
                onClick={handleCloseSelect} 
                className='closebtn'
                style={{position:'relative',transform:'translate(0px)'}}
              /></button>
          <span style={{fontSize:'30px'}}>Редактирование</span>
        </div>
      :<>
        <button className="default__btn close__select__btn"
          onClick={handleCloseSelect}
        >{words.length >= 1 && words.length} {''} <span className="Close__select"> Отменить</span></button>
        <div
          style={{
            width: '150px', 
            display: 'flex',
            justifyContent: 'space-around',
            alignItems:'center'

          }}
        >
          {words.length === 1 && 
            words[0].senderId === id.toString() &&
            <button className="default__btn">
              <EditMess/>
            </button>
          }
          <button
            className="default__btn delete__select__btn"
            onClick={handleDeleteSelect}
          >
            <Trash width="35" height="35" className='trash__svg'/>Удалить
          </button>  
        </div>
      </>
      }
        
    </div>
);
};
export default CheckedMess;