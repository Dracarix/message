import React, { FC, useEffect, useState } from 'react';
import { Form } from 'react-router-dom';
import './form.scss';
import { ReactComponent as EyeIcon } from './svg/eye.svg';
import { ReactComponent as NoEyeIcon } from './svg/noeye.svg';
import useHandlerErr from 'hooks/useHandlerErr';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface FormProps{
    title: string;
    handleForm:(email:string, pass:string, firstName: string, lastName: string) => void;
    error: string;
  }

const FormRegister:FC<FormProps> = ({title, handleForm, error} ) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const valideErr = useHandlerErr(error);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      if (error) {
        setHasError(true);
      }
    }, [error]);
    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
      setShowPassword(!showPassword);
      e.preventDefault();
    };  
    const isFormValide = () => {
      return email.length >= 4 && pass.length >= 6 && firstName.length >= 2 ;
    }
  return (
    <Form
    className="form">
        <p className="title"> Регистрация </p>

        <label>
            <input 
              type='firstName' 
              maxLength={16}
              value={firstName}
              placeholder=''
              required
              className='input'
              onChange={(e) => setFirstName(e.target.value)}
              enterKeyHint='go'
            />
            <span>Имя</span>
        </label>
        <label>
            <input 
              type='lastName' 
              maxLength={16}
              value={lastName}
              placeholder=''
              required
              className='input'
              onChange={(e) => setLastName(e.target.value)}
              enterKeyHint='go'
            />
            <span>Фамилия</span>
        </label>

        <label>
          <input 
              type="email"
              minLength={4}
              value={email}
              className='input'
              placeholder=''
              required
              onChange={(e) => setEmail(e.target.value)}
              enterKeyHint='go'
          />
          <span>Email</span>
        </label> 
        <label>
          <input 
              type={!showPassword ? 'password' : 'text'}
              value={pass}
              className='input'
              placeholder=''
              required
              onChange={(e) => setPass(e.target.value)}
              enterKeyHint='go'
          />
          <span>Пароль</span>
          <button
            onClick={togglePasswordVisibility}
            className='eye__btn'
            title='hide or not hide password'
            style={!showPassword ? {margin: '0 4px 0 0'} : {}}
          >
            {showPassword 
            ? <NoEyeIcon
                width='32.5px'
                height='32.5px'
              /> 
            : <EyeIcon
                width='25px'
                height='25px'
              />}
          </button>
      </label>

        

    <button
      className="submit"
      disabled={!isFormValide()}
      onClick={()=>handleForm(email, pass, firstName, lastName)}
    >
      {title}
    </button>
    <TransitionGroup>
          {hasError && (
            <CSSTransition 
              timeout={500} 
              classNames="slide" unmountOnExit 
              in={hasError}
            >
              <div style={{display: 'flex', flexDirection: 'column',
              color: 'black'
              }}>
              {valideErr && valideErr }
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>   
    </Form>
  );
};

export {FormRegister};