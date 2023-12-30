import './App.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, } from 'react-router-dom';
import {Loyaut} from 'Components/Loyaut';
import {HomePage} from 'pages/homePage';
import {LoginPage} from 'pages/loginPage';
import {RegisterPage} from 'pages/registerPage';
import Masseges from 'pages/Masseges';
import { useUser } from 'hooks/useUser';

function App() {  
  const userHave = useUser();
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Loyaut/>}>
      <Route index element={<LoginPage/>}/>
      <Route path="register" element={<RegisterPage/>}/>
      <Route path='profile' element={<HomePage/>}/>
      <Route path='messages' element={<Masseges/>}/>
    </Route>
  ))
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
