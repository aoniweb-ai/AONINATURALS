if (import.meta.env.VITE_META_ID) {
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', import.meta.env.VITE_META_ID);
  window.fbq('track', 'PageView');

  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${import.meta.env.VITE_META_ID}&ev=PageView&noscript=1" />`;
  document.body.appendChild(noscript);
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Admin from './Admin.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

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
import AdminBlogs from './Admin/pages/AdminBlogs.jsx';
import AdminCoupons from './Admin/pages/AdminCoupons.jsx';
import AdminUsers from './Admin/pages/AdminUsers.jsx';
import AdminUserDetails from './Admin/pages/AdminUserDetails.jsx';
import AdminReviews from './Admin/pages/AdminReviews.jsx';
import AdminProductDetails from './Admin/components/AdminProductDetails.jsx';
import UserAccount from './User/pages/UserAccount.jsx';
import OrderDetails from '../components/OrderDetails.jsx';
import ForgetPassword from './User/components/ForgetPassword.jsx';
import NotFound from '../components/NotFound.jsx';
import UserBlogs from './User/pages/UserBlogs.jsx';
import BlogDetails from './User/components/BlogDetails.jsx';

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
        <Route path='blogs' element={<UserBlogs/>}/>
        <Route path='blogs/:identifier' element={<BlogDetails/>}/>
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
        <Route path='blogs' element={<AdminAuthenticate><AdminBlogs/></AdminAuthenticate>}/>
        <Route path='coupons' element={<AdminAuthenticate><AdminCoupons/></AdminAuthenticate>}/>
        <Route path='users' element={<AdminAuthenticate><AdminUsers/></AdminAuthenticate>}/>
        <Route path='users/:id' element={<AdminAuthenticate><AdminUserDetails/></AdminAuthenticate>}/>
        <Route path='reviews' element={<AdminAuthenticate><AdminReviews/></AdminAuthenticate>}/>
        <Route path='*' element={<NotFound/>}/>
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <RouterProvider router={router} />
    <Analytics />
    <SpeedInsights />
  </>
  // </StrictMode>,
)
