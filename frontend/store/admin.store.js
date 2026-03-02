import { create } from 'zustand'
import { adminAxios } from '../AxiosApi/axiosInstance'
const useAdminBear = create((set, get) => ({
    checkAdmin:false,
    admin:null,
    editProduct:null,
    product:null,
    products:null,
    orders:null,
    blogs:null,
    editBlog:null,
    onlineUsers:[],
    setCheckAdmin:(value) => set({checkAdmin:value}),
    setProductNull:() => set({product:null}),
    setEditProduct:(value)=> set({editProduct:value}),
    setEditBlog:(value) => set({editBlog:value}),
    adminSignup:async(data)=>{
        try {
            await adminAxios.post("/auth/signup",data);
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminLogin:async(data)=>{
        try {
            const response = await adminAxios.post("/auth/login",data);
            set({admin:response.data?.admin});
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminCodCharges:async(data)=>{
        try {
            const response = await adminAxios.put("/auth/update-cod-charges",data);
            set({admin:response.data?.admin});
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminLogout:async()=>{
        try {
            await adminAxios.post("/auth/logout");
        } catch (error) {
           throw error.response?.data?.message || error.message;
        }
    },
    getAdmin:async()=>{
        try {
            const response = await adminAxios.get('/auth/getadmin');
            set({admin:response.data?.admin})
            set({checkAdmin:true})
        } catch (error){
            throw error.response?.data?.message || error.message;
        }
    },
    adminProduct_addUpdate:async(data)=>{
        try {
            const response = await adminAxios.post("/product/addupdateproduct",data);
            if(response.data?.edit==false){
                let product_arry = get().products;
                product_arry.push(response.data?.product)
                set({products:[...product_arry]})
            }else{
                set({product:response.data?.product})
            }
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminGetproducts:async()=>{
        try {
            const response = await adminAxios.get("/product/getproducts");
            set({products:response.data?.products});
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminGetAproduct:async(id)=>{
        try {
            const response = await adminAxios.get(`/product/getaproduct/${id}`);
            set({product:response.data?.product })
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminUpdateOrderStatus: async(data)=>{
        try {
            const response = await adminAxios.put("/orders/updateorder",data);
            return response.data?.order;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminGetOrders: async(status)=>{
        try {
            const response = await adminAxios.get(`/orders/getorders/${status}`);
            set({orders:response.data?.orders});
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminGetAnOrder: async(order_id)=>{
        try {
            const response = await adminAxios.get(`/orders/getan-order/${order_id}`);
            return response.data?.order
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminSearchOrder: async(search_id)=>{
        try {
            const response = await adminAxios.get(`/orders/search-order/${search_id}`);
            return response.data
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminGetRevenue: async()=>{
        try {
            const response = await adminAxios.get('/orders/total-revenue');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    adminBlog_addUpdate: async(data)=>{
        try {
            const response = await adminAxios.post("/blog/addupdateblog", data);
            if(response.data?.edit === false){
                let blogsArray = get().blogs || [];
                blogsArray.unshift(response.data?.blog);
                set({blogs:[...blogsArray]});
            } else {
                // Update the blog in the list
                let blogsArray = get().blogs || [];
                const idx = blogsArray.findIndex(b => b._id === response.data?.blog?._id);
                if(idx !== -1) blogsArray[idx] = response.data?.blog;
                set({blogs:[...blogsArray]});
            }
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminGetBlogs: async()=>{
        try {
            const response = await adminAxios.get("/blog/getblogs");
            set({blogs: response.data?.blogs});
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminGetABlog: async(id)=>{
        try {
            const response = await adminAxios.get(`/blog/getablog/${id}`);
            return response.data?.blog;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
    adminDeleteBlog: async(id)=>{
        try {
            await adminAxios.delete(`/blog/deleteblog/${id}`);
            let blogsArray = get().blogs || [];
            set({blogs: blogsArray.filter(b => b._id !== id)});
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },
}))

export default useAdminBear;
