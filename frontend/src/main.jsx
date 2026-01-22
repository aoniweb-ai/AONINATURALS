import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Admin from './Admin.jsx';

import AdminProtected from './Admin/components/AdminProtected.jsx';

import AdminAuthenticate from './Admin/components/AdminAuthenticate.jsx';

import AdminLogin from './Admin/pages/AdminLogin.jsx';
import AdminSignup from './Admin/pages/AdminSignup.jsx';
import AdminDashboard from './Admin/pages/AdminDashboard.jsx';
import AdminProduct from './Admin/pages/AdminProduct.jsx';
import UserSignup from './User/pages/UserSignup.jsx';
import UserLogin from './User/pages/UserLogin.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} >
        <Route path='signup' element={<UserSignup/>}/>
        <Route path='login' element={<UserLogin/>} />
        <Route/>
        <Route/>
        <Route/>
      </Route>

      <Route path="/admin" element={<AdminProtected><Admin/></AdminProtected>} >
        <Route path='login' element={<AdminLogin/>}/>
        <Route path='signup' element={<AdminSignup/>}/>
        <Route path='dashboard' element={<AdminAuthenticate><AdminDashboard/></AdminAuthenticate>}/>
        <Route path='products' element={<AdminAuthenticate><AdminProduct/></AdminAuthenticate>}/>
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
