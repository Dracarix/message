import React from 'react';
import './App.css';
import Login from './Components/login';
import { useAuth } from 'hooks/use-auth';

function App() {
  const {isAuth, email} = useAuth();
  const authtest = () => {
    if(isAuth){
      return(
        <span>${email}</span>
      )
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        1
      </header>
      <Login />
      {authtest()}
    </div>
  );
}

export default App;
