/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, useState } from 'react';
import { Form } from 'react-router-dom';

interface FormProps{
  title: string;
  handleForm:(email:string, pass:string) => void;
}
const FormLogin:FC<FormProps> = ({title,handleForm }) => {
    const [email, useEmail] = useState('');
    const [pass, usePass] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
      setShowPassword(!showPassword);
      e.preventDefault();
    };
  return (
    <Form>
              <input 
            type="email"
            placeholder='Email' 
            value={email}
            onChange={(e) => useEmail(e.target.value)}
        />
        <input 
            type="password"
            value={pass}
            placeholder='Email' 
            onChange={(e) => usePass(e.target.value)}
        />
        <button
        onClick={togglePasswordVisibility}
        style={{ cursor: "pointer" }}
        hidden
      >
        <img src={showPassword ? "./svg/noeye.svg" : "./svg/eye.svg"} alt="" />
      </button>

    <button
    onClick={()=>handleForm(email, pass)}
    >
      {title}
    </button>
    </Form>

  );
};

export default FormLogin;