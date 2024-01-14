/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useState } from 'react';
import { Form } from 'react-router-dom';
import './form.scss'
import { useAppSelector } from 'hooks/use-redux';

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
      type="password"
      value={pass}
      name="password"
      className='input'
      placeholder=''
      required
      onChange={(e) => setPass(e.target.value)}
  />
  <span>Password</span>
</label>

<button
onClick={togglePasswordVisibility}
style={{ cursor: "pointer" }}
hidden
title='hide or not hide password'
>
<img src={showPassword ? "./svg/noeye.svg" : "./svg/eye.svg"} alt="" />
</button>

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
          onChange={(e) => setEmail(e.target.value)}
      />
      <span>Email</span>
    </label> 
    <label>
      <input 
          type="password"
          value={pass}
          name="password"
          className='input'
          placeholder=''
          required
          onChange={(e) => setPass(e.target.value)}
      />
      <span>Password</span>
    </label>
    
    <button
    onClick={togglePasswordVisibility}
    style={{ cursor: "pointer" }}
    hidden
    title='hide or not hide password'
    >
    <img src={showPassword ? "./svg/noeye.svg" : "./svg/eye.svg"} alt="" />
    </button>
    
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