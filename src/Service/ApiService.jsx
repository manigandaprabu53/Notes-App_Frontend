import axios from "axios";
import config from "../utils/config.js";

const api = axios.create(
    {
        baseURL: config.BASE_URL,
        headers: {
            "Content-Type": "application/json"
        }
    }
)

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    console.log(config.authenticate)
    if(config.authenticate === true && token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>Promise.reject(error))

api.interceptors.response.use((response)=>{
    
    return response;
}, (error)=>{
    // toast.error(error.response.data.message) || "Error occured, Please try again"
    return Promise.reject(error)
})

export default api;