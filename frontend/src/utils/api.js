import axios from "axios";
import notif from "./notif";
import { useTokenStore } from "@/store/token";
import router from "../router";


const api = axios.create({
    baseURL: `http://localhost:4000/api`,
    withCredentials: true
})


api.interceptors.request.use(
    
    async (config) => {
        
        const token = useTokenStore()
        
        // check if needs rotation
        if (!token.access && token.refresh) await token.rotate()
        
        // add access token in headers
        if (token.access) config.headers['Authorization'] = `Bearer ${token.access}`

        return config
    },
)

api.interceptors.response.use(
    (res) => res,
    
    // log errors
    async (error) => {

        if (error.response && error.response.status === 401) {
            
            const token = useTokenStore()
            await token.rotate()
        }
        else if (error.response && error.response.status === 403) {
            
            router.push({ name: 'Sign In' })
            notif.add(error.response.data.toString(), "error", 3000)
        }

        console.log(error)

        return Promise.reject(error);
    }
)


export default api