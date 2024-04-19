import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { FC } from 'react';
import { closeModal } from 'store/processes/isModal';
import './isModal.scss'
import { ReAuthenticationForm } from 'Components/ReAuthentication';
import { ProcessDataSuccess } from 'store/processes/process';
import { QuitAccSystem } from 'Components/quitAcc';
import { NodeChildren } from 'types/user';
import { SettingCompletedProfile } from 'pages/ProfileSetting';

const IsModal:FC<NodeChildren> = ({children}) => {
  const dispatch = useAppDispatch();
  const {needReAuth, needQuit, openCompletSet} = useAppSelector((state) => state.isModalReduser);



  const handleOverlayClick = (e:React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeThisModal();
    }
  };
  const handleESCClick = (e:React.KeyboardEvent<HTMLElement>) => {
    e.code === "Escape" && closeThisModal()
  } 
  const closeThisModal = () => {
    dispatch(closeModal());
    dispatch(ProcessDataSuccess());
  };
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick} onKeyDown={handleESCClick}>
      <div className="modal-content">
        <span className="close-btn" onClick={closeThisModal}>&times;</span>
        {needReAuth && <ReAuthenticationForm/>}
        {needQuit && <QuitAccSystem/>}
        {openCompletSet && <SettingCompletedProfile/>}
      </div>
    </div>
  );
};


export {IsModal};