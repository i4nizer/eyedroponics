import { defineStore } from "pinia";
import { ref, watch } from "vue";


export const useUserStore = defineStore('user', () => {
    
    // ---state
    const id = ref(localStorage.getItem('user-id') || '');
    const name = ref(localStorage.getItem('user-name') || '');
    const email = ref(localStorage.getItem('user-email') || '');
    const verified = ref(localStorage.getItem('user-verified') || '');
    const role = ref(localStorage.getItem('user-role') || '');


    // ---getters



    // ---watchers
    watch(id, (nv) => localStorage.setItem('user-id', nv));
    watch(name, (nv) => localStorage.setItem('user-name', nv));
    watch(email, (nv) => localStorage.setItem('user-email', nv));
    watch(verified, (nv) => localStorage.setItem('user-verified', nv));
    watch(role, (nv) => localStorage.setItem('user-role', nv));
    

    

    // ---actions
    const set = (user) => {
        id.value = user?._id
        name.value = user?.name
        email.value = user?.email
        verified.value = user?.verified
        role.value = user?.role
    }
    
    

    // expose
    return {
        id,
        name,
        email,
        verified,
        role,
        set
    }
})