import React from 'react'
import useAdminBear from '../../../store/admin.store'
const AdminAuthenticate = ({children}) => {
    const {admin} = useAdminBear(state=>state);

    return admin && <>{children}</> 
}

export default AdminAuthenticate