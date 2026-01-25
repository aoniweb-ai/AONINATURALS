import axios from "axios";

export const adminAxios  = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/admin`, // will use in .env
  timeout: 30000,
  // headers: {
  //   "Content-Type":["application/json","multipart/form-data"]
  // },
  withCredentials:true,
  responseType: "json"
});
export const userAxios  = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // will use in .env
  timeout: 30000,
  headers: {
    "Content-Type":"application/json"
  },
  withCredentials:true,
  responseType: "json"
});

