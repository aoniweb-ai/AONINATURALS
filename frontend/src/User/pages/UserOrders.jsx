import React, { useEffect } from 'react'
import Orders from '../../../components/Orders'
import useUserBear from '../../../store/user.store'
import OrdersSkeleton from '../../../components/OrderSkeleton'

const UserOrders = () => {
  const { userGetOrders, orders } = useUserBear((state) => state);

  useEffect(() => {
    userGetOrders();
  }, [userGetOrders]);

  return orders ? (
    <Orders orders={orders} />
  ) : (
    <>
      <OrdersSkeleton />
    </>
  );
  
}

export default UserOrders