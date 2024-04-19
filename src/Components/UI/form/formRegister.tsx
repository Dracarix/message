import React, { FC, useState } from 'react';
import { Form } from 'react-router-dom';
import './form.scss';
import { ReactComponent as EyeIcon } from './svg/eye.svg';
import { ReactComponent as NoEyeIcon } from './svg/noeye.svg';

interface FormProps{
    title: string;
    handleForm:(email:string, pass:string, firstName: string, lastName: string) => void;
  }

const FormRegister:FC<FormProps> = ({title, handleForm} ) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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
              type='firstName' 
              maxLength={16}
              value={firstName}
              placeholder=''
              required
              className='input'
              onChange={(e) => setFirstName(e.target.value)}
            />
            <span>First Name</span>
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
            />
            <span>Last Name</span>
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
      onClick={()=>handleForm(email, pass, firstName, lastName)}
    >
      {title}
    </button>
    </Form>
  );
};

export {FormRegister};