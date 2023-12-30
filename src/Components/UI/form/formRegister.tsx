import React, { FC, useState } from 'react';
import { Form } from 'react-router-dom';

interface FormProps{
    title: string;
    handleForm:(email:string, pass:string, name: string) => void;
  }

const FormRegister:FC<FormProps> = ({title, handleForm} ) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
      setShowPassword(!showPassword);
      e.preventDefault();
    };
  return (
    <Form>
        <input 
        type='name' 
        placeholder='Name' 
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
        <input 
            type="email"
            placeholder='Email' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input 
            type="password"
            value={pass}
            placeholder='Password' 
            onChange={(e) => setPass(e.target.value)}
        />
        <button
        onClick={togglePasswordVisibility}
        style={{ cursor: "pointer" }}
        hidden
      >
        <img src={showPassword ? "./svg/noeye.svg" : "./svg/eye.svg"} alt="" />
      </button>

    <button
    onClick={()=>handleForm(email, pass, name)}
    >
      {title}
    </button>
    </Form>
  );
};

export {FormRegister};