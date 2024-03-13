import { useAppSelector } from 'hooks/use-redux';
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './error.scss'

const ErrBlock = () => {
    
    const {error} = useAppSelector(state => state.process)
  return (
    <TransitionGroup>
    {error &&( 
        <CSSTransition 
        timeout={500} 
        classNames="err" unmountOnExit 
        in={error}
        >

    
        <span className='errorBlock'>{error}</span>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

export default ErrBlock;