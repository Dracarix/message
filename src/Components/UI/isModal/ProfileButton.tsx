import { useAuth } from "hooks/use-auth";
import { ReactNode, useEffect, useState } from "react"
import { FC } from "react"
import  {ReactComponent as ProfileArrow} from "../../../svg/profile_arrow.svg";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './isModal.scss';
import { useAppSelector } from "hooks/use-redux";
type Props = {
    children: string | JSX.Element | JSX.Element[] | ReactNode 
  }

const ProfileButton:FC<Props> = ({children}) => {
    const [profileBlock , setProfileBlock] = useState(false);
    const {photoURL, fullName} = useAuth();
    const {isOpen} = useAppSelector((state)=> state.isModalReduser)

    useEffect(()=>{
      if(isOpen){
        setProfileBlock(false)
      }
    },[isOpen])
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
              <img src={photoURL} alt={`Аватар ${fullName}`} loading="eager"/>
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