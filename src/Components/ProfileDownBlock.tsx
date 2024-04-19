import { SearchInput } from "./UI/Input/SearchInput"
import { ProfileButton } from "./UI/isModal/ProfileButton"
import { DeleteAcc } from "./deleteAcc"
import { IsLoadingMini } from "./UI/isLoading/isLoading";
import { useAppSelector } from "hooks/use-redux";
import { useMatch } from "react-router-dom";
import Theme from "./Theme/theme";
import '../styles/menu.scss';
import { QuitAccBtn } from "./quitAcc";
import ProfileSettingLink from "./profileLink";

const ProfileDownBlock = () => {
    const {loading, error} = useAppSelector((state)=> state.process);
    const match = useMatch("/search/:value");





    return(
        <>{!match && 
        
         <SearchInput/>
        }
        {loading && <div style={{position: 'absolute', top: '10%',left: '50%'}}><IsLoadingMini/>
        </div>}
      {error && <div style={{position: 'absolute', top: '10%', backgroundColor: 'grey'}}><span>{error}</span>
        </div>}
        <ProfileButton>
        <ul className="profileButton" >

        <li className="list_menu">
            < ProfileSettingLink icon/>
          </li>
          <li className="list_menu">
            <DeleteAcc />
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