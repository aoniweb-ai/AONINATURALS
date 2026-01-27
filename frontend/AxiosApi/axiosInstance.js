import axios from "axios";

export const adminAxios  = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/admin`, // 
  timeout: 30000,
  // headers: {
  //   "Content-Type":["application/json","multipart/form-data"]
  // },
  withCredentials:true,
  responseType: "json"
});
export const userAxios  = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type":"application/json"
  },
  withCredentials:true,
  responseType: "json"
});

