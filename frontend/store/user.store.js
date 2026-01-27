import { create } from "zustand";
import { userAxios } from "../AxiosApi/axiosInstance";

const useUserBear = create((set)=>({
    user:null,
    orders:null,
    product:null,
    products:null,
    setProduct: val=>set({product:val}),
    userSignup : async(data)=>{
        try {
            await userAxios.post("/auth/signup",data);     
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userLogin : async(data)=>{
        try {
            const response = await userAxios.post("/auth/login",data);
            set({user:response.data?.user}); 
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userGet : async()=>{
        try {
            const response = await userAxios.get("/auth/getuser",);
            set({user:response.data?.user}); 
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userProfileUpdate : async(data)=>{
        try {
            const response = await userAxios.put("/auth/edit-profile",data);
            set({user:response.data?.user}); 
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userAddressUpdate : async(data)=>{
        try {
            const response = await userAxios.put("/auth/edit-address",data);
            set({user:response.data?.user}); 
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userLogout : async()=>{
        try {
            await userAxios.post("/auth/logout");
            set({user:null});
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userGetProduct : async()=>{
        try {
            const response = await userAxios.get("/product/product");
            set({products:response.data?.products})
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userGetaProduct : async(id)=>{
        try {
            const response = await userAxios.get(`/product/product/${id}`);
            set({product:response.data?.product})
            return response.data?.product
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userAddToCart: async(data)=>{
        try {
            const response = await userAxios.put(`/product/updatecart/${data.id}/${data.quantity}`)
            set({user:response.data?.user});
            return response.data?.user
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userCreateOrder: async(data)=>{
        try {
            const response = await userAxios.post(`/orders/createorder`,data);
            if(response.data?.user){
                set({user:response.data?.user});
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userVerifyPayment: async(res)=>{
        try {
            const response = await userAxios.post(`/orders/verify-payment`,{
          razorpay_order_id: res.razorpay_order_id,
          razorpay_payment_id: res.razorpay_payment_id,
          razorpay_signature: res.razorpay_signature,
        });
            set({user:response.data?.user});
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userGetOrders : async()=>{
        try {
            const response = await userAxios.get(`/orders/getorders`);
            set({orders:response.data?.orders})
            return response.data?.orders
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userGetOrder : async(order_id)=>{
        try {
            const response = await userAxios.get(`/orders/getan-order/${order_id}`);
            set({orders:response.data?.orders})
            return response.data?.order
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    userRemoveCartItem : async(id)=>{
        try {
            const response = await userAxios.put(`/product/remove-product/${id}`);
            set({user:response.data?.user});
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    }
}))

export default useUserBear;