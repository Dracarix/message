import React, {useEffect, useState } from 'react';
import NewButton from './UI/button/NewButton';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ReactComponent as ArrowBottom } from '../svg/arrow__bottom.svg';
import { useMatch } from 'react-router-dom';

const ScrollTop = () => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const match = useMatch("message/chat/:overUserID");
    useEffect(() => {
      const handleScroll = () => {
        const header = document.getElementById('header');
        if (header) {
          const headerRect = header.getBoundingClientRect();
          setIsHeaderVisible(headerRect.top >= 0 && headerRect.bottom <= window.innerHeight);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  return (
<TransitionGroup>
      {!isHeaderVisible && !match && (
        <CSSTransition 
        timeout={500} 
        classNames="close_arrow" 
        unmountOnExit 
        in={isHeaderVisible}
        >
                <NewButton className='scrollTop' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <svg width="32" height="40" viewBox="0 0 16 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="5.5" y1="12" x2="5.5" y2="22" stroke="black"/>
                    <path d="M11 22.5V12.5H15L8.5 1L7.5 2.5L1.5 12.5H5.5V22.5H11Z" stroke="black"/>
                    </svg>
                </NewButton>
            </CSSTransition>
      )}
    </TransitionGroup>
  );
};

const ScrollBottom = () => {
  const [isBottomMessageVisible, setIsBottomMessageVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const soobsheniya = document.getElementById('soobsheniya');
      const bottomMessage = document.getElementById('bottom__message');
      if (soobsheniya && bottomMessage) {
        const soobsheniyaRect = soobsheniya.getBoundingClientRect();
        const bottomMessageRect = bottomMessage.getBoundingClientRect();
        setIsBottomMessageVisible(bottomMessageRect.top >= soobsheniyaRect.top && bottomMessageRect.bottom <= soobsheniyaRect.bottom);
      }
    };

    const soobsheniya = document.getElementById('soobsheniya');
    if (soobsheniya) {
      soobsheniya.addEventListener('scroll', handleScroll);
      return () => {
        soobsheniya.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollToBottom = () => {
    const bottomMessage = document.getElementById('bottom__message');
    if (bottomMessage) {
      bottomMessage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <TransitionGroup>
      {!isBottomMessageVisible && (
        <CSSTransition 
          timeout={500} 
          classNames="close_arrow" 
          unmountOnExit 
          in={!isBottomMessageVisible}
        >
          <NewButton className='scrollBottom' onClick={scrollToBottom}>
            <ArrowBottom
              width="39" height="37"
            />
          </NewButton>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
export {ScrollTop, ScrollBottom};