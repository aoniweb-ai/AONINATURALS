import React, {useEffect, useState } from 'react'
import useAdminBear from '../../../store/admin.store';
import CenterLoader from '../../../components/CenterLoader';
import toast from "react-hot-toast"
const AdminProtected = ({children}) => {
    const {checkAdmin, setCheckAdmin, getAdmin} = useAdminBear(state=>state);
    const [inputValue, setInputValue] = useState("");
    const [loader, setLoader] = useState(false);
    useEffect(()=>{
      async function run() {
        try {
          setLoader(true);
          await getAdmin()
        }catch(error){
          toast.error(error.data?.message)
        }
        finally{
          setLoader(false);
        }
      }
      run();

    },[getAdmin])

    useEffect(()=>{
        if(import.meta.env.VITE_ADMIN_KEY==inputValue) setCheckAdmin(true);
    },[inputValue,setCheckAdmin])
    
    return !loader ? (checkAdmin || import.meta.env.VITE_SOME_KEY==inputValue) ? (<>{children}</>) : (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-2">
      <div className="w-full flex flex-col items-center gap-4">
        <input
        type="text"
        placeholder="Enter something..."
        className="input input-bordered w-[95%] md:w-[80%]"
        onChange={(e)=>setInputValue(e.target.value)}
        />
      </div>
    </div>
  ) : <CenterLoader/>

  
}

export default AdminProtected