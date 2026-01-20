import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Admin from './Admin.jsx';
import Login from './Admin/pages/Login.jsx';
import Signup from './Admin/pages/Signup.jsx';
import AdminProtected from './Admin/components/AdminProtected.jsx';
import Dashboard from './Admin/pages/Dashboard.jsx';
import AdminAuthenticate from './Admin/components/AdminAuthenticate.jsx';
import Header from './Admin/components/Header.jsx';
import Products from './Admin/pages/Product.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} >
        <Route />
        <Route/>
        <Route/>
        <Route/>
        <Route/>
      </Route>

      <Route path="/admin" element={<AdminProtected><Admin/></AdminProtected>} >
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
        <Route path='dashboard' element={<AdminAuthenticate><Dashboard/></AdminAuthenticate>}/>
        <Route path='products' element={<AdminAuthenticate><Products/></AdminAuthenticate>}/>
        <Route />
        <Route />
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
