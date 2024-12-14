import { defineStore } from "pinia"
import { ref, watch } from "vue"
import notif from '@/utils/notif'
import router from "@/router"
import axios from "axios"



export const useTokenStore = defineStore('token', () => {

    // ---state
    const age = ref(localStorage.getItem('token-age') || 0)
    const access = ref(localStorage.getItem('token-access') || '')
    const refresh = ref(localStorage.getItem('token-refresh') || '')
    const expiresIn = (15 * 60 * 1000)
    let rotating = false


    // ---getters


    // ---watchers
    watch(age, (nv) => localStorage.setItem('token-age', nv.toString()))
    watch(access, (nv) => localStorage.setItem('token-access', nv))
    watch(refresh, (nv) => localStorage.setItem('token-refresh', nv))


    // ---actions
    const set = (at, rt) => {
        access.value = at
        refresh.value = rt
        age.value = Date.now() + expiresIn
    }

    const rotate = async () => {
        
        await axios
            .post('http://localhost:4000/api/user/token', { token: refresh.value }, { withCredentials: true })
            .then(res => {  
                // rotate & log
                access.value = res.data.obj.access
                refresh.value = res.data.obj.refresh
                age.value = Date.now() + expiresIn
                notif.add("Token Rotated Successfully", 'success')
            })
            .catch(err => {
                let msg = 'Authentication Error: Kindly sign-in again'
                if (err.response?.data) msg = err.response?.data
                
                // re-auth if invalidated
                notif.addError(msg)
                router.push({ name: 'Sign In' })
            })
    }

    const startRotation = () => {
        if (rotating) return
        
        setInterval(() => {
            rotating = true
            if (!refresh.value) return
            
            // rotate on expire
            if (Date.now() > age.value) rotate()
            
        }, 30 * 1000)
    }
    


    // expose
    return {
        age,
        access,
        refresh,
        rotating,
        expiresIn,
        set,
        rotate,
        startRotation,
    }

})