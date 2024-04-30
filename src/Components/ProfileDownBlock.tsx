import { SearchInput } from "./UI/Input/SearchInput"
import { ProfileButton } from "./UI/isModal/ProfileButton"
import { useMatch } from "react-router-dom";
import Theme from "./Theme/theme";
import '../styles/menu.scss';
import { QuitAccBtn } from "./quitAcc";
import ProfileSettingLink from "./profileLink";

const ProfileDownBlock = () => {
    const match = useMatch("message/search/:value");

    return(
        <>{!match && 
        
         <SearchInput/>
        }
        <ProfileButton>
        <ul className="profileButton" >

        <li className="list_menu">
            < ProfileSettingLink icon/>
          </li>
          <li className="list_menu">
            <Theme icon={false}/>
          </li>
          <li className="list_menu">
            <QuitAccBtn color={'#71aaeb'} icon />
          </li>
          
        </ul>   
        </ProfileButton>
            </>
    )
}

export {ProfileDownBlock}