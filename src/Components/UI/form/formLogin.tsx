/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useState } from 'react';
import { Form } from 'react-router-dom';
import './form.scss'
import { useAppSelector } from 'hooks/use-redux';
import { ReactComponent as EyeIcon } from './svg/eye.svg';
import { ReactComponent as NoEyeIcon } from './svg/noeye.svg';

interface FormProps{
  title: string;
  handleForm:(email:string, pass:string) => void;
}
const FormLogin:FC<FormProps> = ({title,handleForm }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {error} = useAppSelector((state) => state.process)

    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
      setShowPassword(!showPassword);
      e.preventDefault();
    };
     const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    e.key === "Enter" && handleForm(email, pass);
  };
  return (
    <Form className="form">
 <p className="title">Authentication </p>

<label>
  <input 
      type="email"
      value={email}
      name="email"
      className='input'
      placeholder=''
      required
      onChange={(e) => setEmail(e.target.value)}
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
  />
  <span>Password</span>
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
>
{title}
</button>
{error && error}
    </Form>

  );
};


const ReAuthenticate:FC<FormProps> = ({title,handleForm }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {error} = useAppSelector((state) => state.process)

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowPassword(!showPassword);
    e.preventDefault();
  };
 const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    e.key === "Enter" && handleForm(email, pass);
  };
  return (
    <Form className="form">
       <p className="title">ReAuthentication </p>
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
          minLength={8}
          maxLength={32}
          onChange={(e) => setPass(e.target.value)}
      />
      <span>Password</span>
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
    >
    {title}
    </button>
    {error && error}
        </Form>
  )
}

export {FormLogin, ReAuthenticate};