import Theme from "Components/Theme/theme";
import { QuitAccBtn } from "Components/quitAcc";
import { useAppDispatch, useAppSelector } from "hooks/use-redux";
import { FC, useEffect } from "react";
import { closeMenu } from "store/menu.slice";
import ProfileSettingLink from "Components/profileLink";

const MediaMenu:FC = () => {
  const { needMenu } = useAppSelector((state) => state.useMenu);
  const { photoURL, fullName } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    document.body.style.overflow = !needMenu ? "auto" : "hidden";
    window.scrollTo({ top: 0, behavior: "smooth" });

    
  }, [needMenu]);

  return (
    <div className="menu">
      <button 
        className="close__btn__menu"
        onClick={()=> dispatch(closeMenu())}
      >&times;</button>
      <div className="profile__block">
        <img src={photoURL} alt={`Аватар ${fullName}`} loading="eager" />

        <h4>{fullName}</h4>
        <ProfileSettingLink className="setting__profile" icon={false}/>
      </div>
      <Theme className="media__menu__theme" icon={true}/>
        <QuitAccBtn 
          icon={false} 
          color={"#f80707"} 
          className='media__menu__quit' 
        />
      <div></div>
    </div>
  );
};

export default MediaMenu;
