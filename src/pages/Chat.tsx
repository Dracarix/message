import { InputSend } from 'Components/UI/Input/SearchInput';
import { Message } from 'Components/UI/message/Message';
import { useAppSelector } from 'hooks/use-redux';
import React from 'react';

const Chats = () => {
  const {user} = useAppSelector((state) => state.chat)
  return (
    <div className='chat'>
      <div className='chatInfo'>
        <span>{user.fullName}</span>
        {/* <div className='chatIcons'>
          <img src={} alt="" />
        </div> */}
      
      </div>
      
      <Message/>
      <InputSend/>
    </div>
  );
};

export {Chats};