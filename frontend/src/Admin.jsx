import { Outlet } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast';
import useAdminBear from '../store/admin.store';
import AdminHeader from './Admin/components/AdminHeader';
const Admin = () => {
  const {admin} = useAdminBear(state=>state);
  return (

    <div className="drawer lg:drawer-open min-h-screen bg-base-200">

      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {admin && <AdminHeader/>}
      <Outlet/>
      <Toaster 
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default Admin