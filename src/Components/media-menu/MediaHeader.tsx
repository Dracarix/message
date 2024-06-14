import MiniLogo from '../../Images/My-logo-mini.png';
import {ReactComponent as Lupa} from '../../svg/search-lupa.svg';
import './mediaMenu.scss';
import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

const MediaHeader = () => {
  const [searchValue , setSearchValue] = useState('');
  const navigate = useNavigate();
  const match = useMatch("message/search/:value");

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.code === "Enter"){ 
      SearchLink()
    }
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.key === "Enter"){ 
      SearchLink();
    }
  };
  const SearchLink = () => {
    setSearchValue('');
    navigate(`/message/search/${searchValue}`);
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
    {!match && (
          <div className='transition__input' >
          <input 
            type="text" 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)}
            className='search__media'
            placeholder=''
            onKeyDown={handleKey}
            onKeyUp={handleKeyUp}
            enterKeyHint='search'
          />
          <Lupa className='header__lupa'
            onClick={SearchLink}
          />
        </div>
    )}

    </>
  );
};

export default MediaHeader;