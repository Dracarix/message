import { InputSend } from 'Components/UI/Input/SearchInput';
import { Message } from 'Components/UI/message/Message';
import { useAppSelector } from 'hooks/use-redux';
import React from 'react';
import '../styles/chat.scss'
import { LeftUsers } from 'Components/leftColumnUsers';

const Chats = () => {
  const {user} = useAppSelector((state) => state.chat)
  return (
    <div className='chat'>
      <LeftUsers thisID={user.id} />
      <section className='chat_section'>
        <div className='chatInfo'>
          <div className='chatIcons'>
            <img src={user.photoURL} alt="" />
          </div>
          <span>{user.fullName}</span>

        
        </div>
        
        <Message/>
        <InputSend/>
      </section>
    </div>
  );
};

export {Chats};