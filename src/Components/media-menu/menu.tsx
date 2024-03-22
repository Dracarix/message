import Theme from "Components/Theme/theme";
import { DeleteAcc } from "Components/deleteAcc";
import { useAuth } from "hooks/use-auth";
import { useAppSelector } from "hooks/use-redux";
import { useEffect } from "react";

const MediaMenu = () => {
  const {needMenu} = useAppSelector((state) => state.useMenu);
  const {photoURL, fullName} = useAuth();
  useEffect(()=>{
    document.body.style.overflow = !needMenu ? 'auto' : 'hidden';
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },[needMenu])
  return (
    <div className="menu">
                 <button>Х</button>
                 <div className="profile__block">
                      <img src={photoURL} alt={`Аватар ${fullName}`} loading="eager" />
                      <h4>{fullName}</h4>
                      <span>Настройки аккаунта</span>
                 </div>
                 <Theme/>
    </div>
  );
};

export default MediaMenu;