import { IsLoadingBig } from 'Components/UI/isLoading/isLoading';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotPages = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/message/login')
    })
  return (
    <IsLoadingBig/>
  );
};

export {NotPages};