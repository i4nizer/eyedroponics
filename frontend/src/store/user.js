import api from "@/utils/api";
import { defineStore } from "pinia";
import { ref, watch } from "vue";


export const useUserStore = defineStore('user', () => {
    
    // ---state
    const id = ref(localStorage.getItem('user-id') || '');
    const name = ref(localStorage.getItem('user-name') || '');
    const email = ref(localStorage.getItem('user-email') || '');
    const verified = ref(localStorage.getItem('user-verified') || '');
    const role = ref(localStorage.getItem('user-role') || '');

    const emailAlerts = ref(localStorage.getItem('user-pref-email-alerts') == "true")
    const emailAlertInterval = ref(localStorage.getItem('user-pref-email-alert-interval') || 60)


    // ---getters



    // ---watchers
    watch(id, (nv) => localStorage.setItem('user-id', nv));
    watch(name, (nv) => localStorage.setItem('user-name', nv));
    watch(email, (nv) => localStorage.setItem('user-email', nv));
    watch(verified, (nv) => localStorage.setItem('user-verified', nv));
    watch(role, (nv) => localStorage.setItem('user-role', nv));
    
    watch(emailAlerts, (nv) => localStorage.setItem('user-pref-email-alerts', nv));
    watch(emailAlertInterval, (nv) => localStorage.setItem('user-pref-email-alert-interval', nv));
    

    

    // ---actions
    const set = (user) => {
        id.value = user?._id
        name.value = user?.name
        email.value = user?.email
        verified.value = user?.verified
        role.value = user?.role
    }

    const setPref = (pref) => {
        emailAlerts.value = pref?.emailAlerts
        emailAlertInterval.value = pref?.emailAlertInterval
    }
    
    const editPref = async (emailAlerts, emailAlertInterval) => {
        const data = { emailAlerts, emailAlertInterval }
        const res = await api.patch(`/user/preference`, data)
        
        if (res.status < 300 && res.data) setPref(res.data.obj)
        return res
    }
    

    // expose
    return {
        id,
        name,
        email,
        verified,
        role,
        
        emailAlerts,
        emailAlertInterval,

        set,
        setPref,
        editPref,
    }
})