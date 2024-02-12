import { useAuth } from "hooks/use-auth";
import React, { ReactNode, useState } from "react"
import { FC } from "react"
type Props = {
    children: string | JSX.Element | JSX.Element[] | ReactNode 
  }

const ProfileButton:FC<Props> = ({children}) => {
    const [profileBlock , setProfileBlock] = useState(false);
    const {photoURL, fullName} = useAuth();
    const handleOverlay = (e:React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          
          setProfileBlock(false)
        }
      };
    return (
        <>
        <button className="btnProfileImg" onClick={()=> {
            profileBlock ? setProfileBlock(false) :setProfileBlock(true);
        }}><img src={photoURL} alt={fullName}/></button>
            {profileBlock &&(
                <div className="modal-overlay-profile" onClick={handleOverlay}>
                        {children}
                </div>
                )
            }
        
    </>
    )
};

export {ProfileButton};