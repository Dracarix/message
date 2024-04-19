import { useAuth } from "hooks/use-auth";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { LinkBtnTypes } from "types/user";
import { ReactComponent as ProfileIcon } from "../svg/profile.svg";
import { useAppDispatch } from "hooks/use-redux";
import { closeMenu } from "store/menu.slice";

const ProfileSettingLink:FC<LinkBtnTypes> = ({icon , className = ''}) => {
    const {id} = useAuth()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const NavSettingProf = () => {
        dispatch(closeMenu());
        navigate(`profile/setting/${id.toString()}`)
    }
return (
    <button className={`btnQuit ${className}`}
        onClick={NavSettingProf}
    >
        {icon && 
        <ProfileIcon
            width='20'
            height='20' 
            className='profile__icon__link'       
        />}
        <span style={{marginLeft:'8px'}}>Профиль</span>
    </button>
);
};
export default ProfileSettingLink;