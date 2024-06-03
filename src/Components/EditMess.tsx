import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import {ReactComponent as EditPen} from '../svg/edit-pen.svg'
import { setEditMess } from 'store/users/editMess.slice';
import { useAuth } from 'hooks/use-auth';

const EditMess = () => {
    const dispatch = useAppDispatch();
    const {words} = useAppSelector(state => state.selectedMess);
    const {id} = useAuth()

    const handleEditMess = () => {
        if(words.length === 1 ){
            const oldMess = words[0]
            if(oldMess.senderId === id.toString()){
                dispatch(setEditMess(oldMess))
            }
        }
    }
    return (
        <EditPen 
            width="30" 
            height="30" 
            onClick={handleEditMess}
            className='edit__message__pen'
        />
    );
};
export {EditMess};