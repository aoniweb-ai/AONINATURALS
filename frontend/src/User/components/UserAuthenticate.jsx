import React, { useEffect } from 'react'
import useUserBear from '../../../store/user.store'
import { useNavigate } from 'react-router-dom';

const UserAuthenticate = ({children}) => {
    const {user} = useUserBear(state=>state);
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(!user) navigate("/");
    },[user]);
  return (
    user && (children)
  )
}

export default UserAuthenticate