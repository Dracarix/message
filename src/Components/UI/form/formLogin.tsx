/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useEffect, useState } from 'react';
import { Form } from 'react-router-dom';
import './form.scss'
import { ReactComponent as EyeIcon } from './svg/eye.svg';
import { ReactComponent as NoEyeIcon } from './svg/noeye.svg';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useHandlerErr from 'hooks/useHandlerErr';

interface FormProps{
  title: string;
  handleForm:(email:string, pass:string) => void;
  error: string ;
}
const FormLogin:FC<FormProps> = ({title,handleForm, error}) => {
    const [email, setEmail] = useState('');
    const [hasError, setHasError] = useState(false);
    const [pass, setPass] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const valideErr = useHandlerErr(error)
    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
      setShowPassword(!showPassword);
      e.preventDefault();
    };
     const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    e.key === "Enter" && handleForm(email, pass);
  };
  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);
  const isFormValide = () => {
    return email.length >= 4 && pass.length >= 6;
  }
  return (
    <Form className="form">
 <p className="title">Авторизация </p>

<label>
  <input 
      type="email"
      value={email}
      name="email"
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
      name="password"
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
    onKeyDown={handleKey}
onClick={()=>handleForm(email, pass)}
disabled={!isFormValide()}
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
              <div style={{display: 'flex', flexDirection: 'column', color: 'black'}}>
              {valideErr && valideErr}
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>  
    </Form>

  );
};


const ReAuthenticate:FC<FormProps> = ({title,handleForm, error }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);  
  const valideErr = useHandlerErr(error);

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowPassword(!showPassword);
    e.preventDefault();
  };
 const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    e.key === "Enter" && handleForm(email, pass);
  };
  const isFormValide = () => {
    return email.length >= 4 && pass.length >= 6;
  }
  return (
    <Form className="form">
       <p className="title">Повторная Авторизация </p>
    <label>
      <input 
          type="email"
          value={email}
          name="email"
          className='input'
          placeholder=''
          required
          minLength={4}
          onChange={(e) => setEmail(e.target.value)}
          enterKeyHint='go'
      />
      <span>Email</span>
    </label> 
    <label>
      <input 
          type={!showPassword ? 'password' : 'text'}
          value={pass}
          name="password"
          className='input'
          placeholder=''
          required
          minLength={6}
          maxLength={32}
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
    style={{marginTop: "20px"}}
    onClick={()=>handleForm(email, pass)}
    onKeyDown={handleKey}
    disabled={!isFormValide()}
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
              <div style={{display: 'flex', flexDirection: 'column', color: 'black'}}>
              {valideErr && valideErr}
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>  
        </Form>
  )
}

export {FormLogin, ReAuthenticate};