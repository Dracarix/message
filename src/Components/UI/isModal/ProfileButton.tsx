import { useAuth } from "hooks/use-auth";
import React, { ReactNode, useState } from "react"
import { FC } from "react"
import  {ReactComponent as ProfileArrow} from "../../../svg/profile_arrow.svg";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './isModal.scss';
type Props = {
    children: string | JSX.Element | JSX.Element[] | ReactNode 
  }

const ProfileButton:FC<Props> = ({children}) => {
    const [profileBlock , setProfileBlock] = useState(false);
    const {photoURL, fullName} = useAuth();
    const handleOverlay = (e:React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          
          setProfileBlock(false)
          e.stopPropagation()
        }
      };
    return (
      <TransitionGroup style={{zIndex:2}}>
        <button 
            className="btnProfileImg" 
            onClick={()=> {
                profileBlock 
                  ? setProfileBlock(false) 
                  :setProfileBlock(true);
            }}>
              <img src={photoURL} alt={fullName}/>
              <div className={!profileBlock ? 'arrow-profile-wrapper' : ' arrow-profile-wrapper active'}>
                  <ProfileArrow className="arrow-profile" />
              </div>
        </button> 
                    {profileBlock &&(
                        <CSSTransition 
                        timeout={100} 
                        
                        classNames="ProfileClose" unmountOnExit 
                        in={profileBlock}
                        >
                            <div className="modal-overlay-profile" onClick={handleOverlay}>
                                    {children}
                            </div>
                        </CSSTransition>
                    )}
                  
        
    </TransitionGroup>
    )
};

export {ProfileButton};