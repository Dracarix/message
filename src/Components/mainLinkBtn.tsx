import { useNavigate } from "react-router-dom";
import MyLogoMini from '../Images/My-logo-mini.png';


const MainLinkBtn = () => {
    const navigate = useNavigate();

    const handleBack = () => {
      navigate('/');
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