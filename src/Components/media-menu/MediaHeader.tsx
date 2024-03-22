import MiniLogo from '../../Images/My-logo-mini.png';
import {ReactComponent as Lupa} from '../../svg/search-lupa.svg';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './mediaMenu.scss';

const MediaHeader = () => {
  return (
    <>
    <div className='mini__logo'>
      <img 
        src={MiniLogo} 
        alt="Logo" 
        style={{width:'100%'}}
      />
    </div>
    <Lupa className='header__lupa'/>
    </>
  );
};

export default MediaHeader;