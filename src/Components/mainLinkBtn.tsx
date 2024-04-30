import { useNavigate } from "react-router-dom";
import MyLogoMini from '../Images/My-logo-mini.png';
import { useAppDispatch } from "hooks/use-redux";
import { removeSelectMess } from "store/users/deleteMess";


const MainLinkBtn = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    const handleBack = () => {
      dispatch(removeSelectMess())
      navigate('/message/');
    }
  return (
    <button
    type='button'
    style={{
      backgroundColor: 'transparent',
      border: 'none',
      padding: '20px 20px',
      color: 'inherit',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    }}
    onClick={handleBack}
  >
    
    <img 
      src={MyLogoMini} 
      alt="Main page"
      style={{width:'40px'}}
    />
  </button>
  );
};

export default MainLinkBtn;