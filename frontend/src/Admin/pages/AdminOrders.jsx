import React, { useEffect } from 'react'
import Orders from '../../../components/Orders'
import useAdminBear from '../../../store/admin.store'
import OrdersSkeleton from '../../../components/OrderSkeleton';

const AdminOrders = () => {
  
  const {orders, adminGetOrders } = useAdminBear(state=>state);
  useEffect(()=>{
    adminGetOrders();
  },[adminGetOrders])

  return (orders ? <Orders orders={orders}/> :
    <>
        <OrdersSkeleton/>
    </>
  )
}

export default AdminOrders