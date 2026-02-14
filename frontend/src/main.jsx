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
import UserHome from './User/pages/UserHome.jsx';
import UserAuthenticate from './User/components/UserAuthenticate.jsx';
import UserProduct from './User/pages/UserProduct.jsx';
import ProductDetails from './User/components/ProductDetails.jsx';
import UserCart from './User/pages/UserCart.jsx';
import UserOrders from './User/pages/UserOrders.jsx';
import AdminOrders from './Admin/pages/AdminOrders.jsx';
import AdminProductDetails from './Admin/components/AdminProductDetails.jsx';
import UserAccount from './User/pages/UserAccount.jsx';
import OrderDetails from '../components/OrderDetails.jsx';
import ForgetPassword from './User/components/ForgetPassword.jsx';
import NotFound from '../components/NotFound.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} >
        <Route path='' element={<UserHome/>} />
        <Route path='signup' element={<UserSignup/>}/>
        <Route path='login' element={<UserLogin/>} />
        <Route path='forgot-password' element={<ForgetPassword/>} />
        <Route path='products' element={<UserProduct/>}/>
        <Route path='products/details/:id' element={<ProductDetails/>}/>
        <Route path='cart' element={<UserAuthenticate><UserCart/></UserAuthenticate>}/>
        <Route path='orders' element={<UserAuthenticate><UserOrders/></UserAuthenticate>}/>
        <Route path='account' element={<UserAuthenticate><UserAccount/></UserAuthenticate>}/>
        <Route path='orders/details/:order_id' element={<UserAuthenticate><OrderDetails/></UserAuthenticate>}/>
        <Route path='*' element={<NotFound/>}/>
      </Route>

      <Route path={`/${import.meta.env.VITE_ADMIN_POST_URI}`} element={<AdminProtected><Admin/></AdminProtected>} >
        <Route path='login' element={<AdminLogin/>}/>
        <Route path='signup' element={<AdminSignup/>}/>
        <Route path='dashboard' element={<AdminAuthenticate><AdminDashboard/></AdminAuthenticate>}/>
        <Route path='products' element={<AdminAuthenticate><AdminProduct/></AdminAuthenticate>}/>
        <Route path='products/details/:id' element={<AdminAuthenticate><AdminProductDetails/></AdminAuthenticate>}/>
        <Route path='orders' element={<AdminAuthenticate><AdminOrders/></AdminAuthenticate>}/>
        <Route path='orders/details/:order_id' element={<AdminAuthenticate><OrderDetails/></AdminAuthenticate>}/>
        <Route path='*' element={<NotFound/>}/>
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={router} />
  // </StrictMode>,
)
