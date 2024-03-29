import { useAppDispatch, useAppSelector } from 'hooks/use-redux';
import React, { FC } from 'react';
import { closeModal } from 'store/processes/isModal';
import './isModal.scss'
import { ReAuthenticationForm } from 'Components/ReAuthentication';
import { ProcessDataSuccess } from 'store/processes/process';

const IsModal:FC = () => {
  const dispatch = useAppDispatch();
  const {needReAuth} = useAppSelector((state) => state.isModalReduser)

  const handleOverlayClick = (e:React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(closeModal());
    }
  };
  const closeThisModal = () => {
    dispatch(closeModal());
    dispatch(ProcessDataSuccess());
  };
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <span className="close-btn" onClick={closeThisModal}>&times;</span>
        {needReAuth && <ReAuthenticationForm/>}
      </div>
    </div>
  );
};

export {IsModal};