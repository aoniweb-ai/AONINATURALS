import { create } from 'zustand'
import { adminAxios } from '../AxiosApi/axiosInstance'
const useAdminBear = create((set) => ({
    checkAdmin:false,
    admin:null,
    editProduct:null,
    selectedProduct:null,
    products:null,
    setCheckAdmin:(value) => set({checkAdmin:value}),
    setEditProduct:(value)=> set({editProduct:value}),
    adminSignup:async(data)=>{
        try {
            await adminAxios.post("/auth/signup",data);
        } catch (error) {
            throw error?.response
        }
    },
    adminLogin:async(data)=>{
        try {
            const response = await adminAxios.post("/auth/login",data);
            set({admin:response.data?.admin});
        } catch (error) {
            console.log("error while getting admin ",error)
        }
    },
    adminLogout:async()=>{
        try {
            await adminAxios.post("/auth/logout");
            // set({admin:response.data?.admin});
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
    },
    adminProduct_addUpdate:async(data)=>{
        try {
            const response = await adminAxios.post("/product/addupdateproduct",data);
            console.log("product created ",response.data?.product);
        } catch (error) {
            console.log("there is an error while add/update product ",error);
        }
    },
    adminGetproducts:async()=>{
        try {
            const response = await adminAxios.get("product/getproducts");
            set({products:response.data?.products});
        } catch (error) {
            console.log("error while getting products ",error);
        }
    }
}))

export default useAdminBear;
