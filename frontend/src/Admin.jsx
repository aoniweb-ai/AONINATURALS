import { Outlet } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast';
import Header from './Admin/components/Header';
const Admin = () => {
  
  return (

    <div className="drawer lg:drawer-open min-h-screen bg-base-200">

      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <Header/>
      <Outlet/>
      <Toaster 
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default Admin