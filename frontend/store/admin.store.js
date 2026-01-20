import { create } from 'zustand'
import { adminAxios } from '../AxiosApi/axiosInstance'
const useAdminBear = create((set) => ({
    checkAdmin:false,
    admin:null,
    editProduct:false,
    selectedProduct:null,
    setCheckAdmin:(value)=>set({checkAdmin:value}),
    adminSignup:async(data)=>{
        try {
            const response = await adminAxios.post("/auth/signup",data);
        } catch (error) {
            throw error?.response
        }
    },
    adminLogin:async(data)=>{
        try {
            const response = await adminAxios.post("/auth/login",data);
            set({admin:response.data?.admin});
        } catch (error) {
            throw error?.response
        }
    },
    getAdmin:async()=>{
        try {
            const response = await adminAxios.get('/auth/getadmin');
            set({admin:response.data?.admin})
            set({checkAdmin:true})
        } catch (error){
            throw error?.response || error?.message
        }
    }
}))

export default useAdminBear;
