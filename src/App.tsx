import React from 'react';
import './App.css';
import Login from './Components/login';
import { useAuth } from 'hooks/use-auth';
import { Route, Router, } from 'react-router-dom';
import {Loyaut} from 'Components/Loyaut';
import {HomePage} from 'pages/homePage';
import {LoginPage} from 'pages/loginPage';
import {RegisterPage} from 'pages/registerPage';

function App() {
  return (
    <Router location={''} navigator={undefined}>
      
      <Route path="/" element={<Loyaut/>}>
        <Route index element={<LoginPage/>}/>
        <Route path="register" element={<RegisterPage/>}/>
      </Route>
    </Router>
  );
}

export default App;
