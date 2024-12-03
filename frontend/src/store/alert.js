import api from "@/utils/api"
import { defineStore } from "pinia"
import { ref, watch } from "vue"


export const useAlertStore = defineStore('Alert', () => {

    // ---state
    const alerts = ref(JSON.parse(localStorage.getItem('alerts') || '[]') || [])


    // ---getters
    
    
    // ---watchers
    watch(alerts, (nv) => localStorage.setItem('alerts', JSON.stringify(nv)));



    // ---actions
    const fetchAlerts = async () => {
        const res = await api.get('/user/alert')

        if (res.status < 300 && res.data) alerts.value = res.data.obj
        return res
    }

    const getAlert = (alertId) => alerts.value.find(a => a._id == alertId)

    const updateAlert = async (alertId, dismissed = true) => {
        const data = { _id: alertId, dismissed }
        const res = await api.patch('/user/alert', data)

        if (res.status < 300 && res.data) alerts.value[alerts.value.findIndex(a => a._id == alertId)] = res.data.obj
        return res
    }





    // ---expose
    return {
        alerts,
        fetchAlerts,
        getAlert,
        updateAlert,
    }


})