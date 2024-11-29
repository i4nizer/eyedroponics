import api from "@/utils/api"
import { defineStore } from "pinia"
import { ref, watch } from "vue"
import notif from '@/utils/notif'
import router from "@/router"



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

    const clear = () => {
        access.value = ''
        refresh.value = ''
        age.value = 0
    }

    const rotate = async () => {
        
        await api
            .post('/user/token', { token: refresh.value })
            .then(res => {  
                // rotate & log
                access.value = res.data.obj.access
                refresh.value = res.data.obj.refresh
                age.value = Date.now() + expiresIn
                console.log('Refresh Token: ', refresh.value, '\nAccess Token: ', access.value)
            })
            .catch(err => {
                let msg = 'Authentication Error: Kindly sign-in again'
                if (err.response?.data) msg = err.response?.data
                
                // re-auth if invalidated
                clear()
                notif.add(msg, 'error')
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
        clear,
        rotate,
        startRotation,
    }

})