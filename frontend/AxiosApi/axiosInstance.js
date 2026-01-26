import axios from "axios";

export const adminAxios  = axios.create({
  baseURL: `http://localhost:5005/api/admin`, // will use in .env
  timeout: 30000,
  // headers: {
  //   "Content-Type":["application/json","multipart/form-data"]
  // },
  withCredentials:true,
  responseType: "json"
});
export const userAxios  = axios.create({
  baseURL: "http://localhost:5005/api", // will use in .env
  timeout: 30000,
  headers: {
    "Content-Type":"application/json"
  },
  withCredentials:true,
  responseType: "json"
});

