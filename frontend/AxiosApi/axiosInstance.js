import axios from "axios";

export const adminAxios  = axios.create({
  baseURL: 'http://localhost:5005/api/admin', // will use in .env
  timeout: 10000,
  // headers: {'X-Custom-Header': 'foobar'},
  withCredentials:true,
  responseType: "json"
});

