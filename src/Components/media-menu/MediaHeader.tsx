import MiniLogo from '../../Images/My-logo-mini.png';
import {ReactComponent as Lupa} from '../../svg/search-lupa.svg';
import './mediaMenu.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MediaHeader = () => {
  const [searchValue , setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.code === "Enter"){ 
      SearchLink()
    }
  };
  const SearchLink = () => {
    navigate(`/message/search/${searchValue}`);
    setSearchValue('');
  };
  const handleBack = () => {
    navigate('/message/');
  }
  return (
    <>
    <div className='mini__logo'>
      <img 
        src={MiniLogo} 
        alt="Logo" 
        style={{width:'100%'}}
        onClick={handleBack}
      />
    </div>
    <div className='transition__input' >
      <input 
        type="text" 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
        className='search__media'
        placeholder=''
        onKeyDown={handleKey}
      />
      <Lupa className='header__lupa'
        onClick={SearchLink}
      />
    </div>
    </>
  );
};

export default MediaHeader;