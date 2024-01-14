import React, { FC, useState } from 'react';
import { Form } from 'react-router-dom';
import './form.scss';

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
    <Form
    className="form">
        <p className="title"> Registration </p>

        <label>
            <input 
              type='name' 
              value={name}
              placeholder=''
              required
              className='input'
              onChange={(e) => setName(e.target.value)}
            />
            <span>Name</span>
        </label>

        <label>
          <input 
              type="email"
              value={email}
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
      onClick={()=>handleForm(email, pass, name)}
    >
      {title}
    </button>
    </Form>
  );
};

export {FormRegister};