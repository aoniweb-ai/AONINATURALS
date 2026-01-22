import React from 'react'
import useAdminBear from '../../../store/admin.store'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AdminAuthenticate = ({children}) => {
    const navigate = useNavigate()
    const {admin} = useAdminBear(state=>state);
    useEffect(()=>{
        if(!admin){
            navigate('/')
        }   
    },[admin])
    return admin && <>{children}</> 
}

export default AdminAuthenticate