import api from "@/utils/api"
import { defineStore } from "pinia"
import { ref } from "vue"


export const useDataStore = defineStore('Data', () => {

    // ---state
    const NPKs = ref([])
    const PHs = ref([])


    // ---getters



    // ---actions
    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString)

        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const year = date.getFullYear().toString().slice(2)
        const hour = date.getHours() % 12 || 12
        const minute = date.getMinutes().toString().padStart(2, '0')
        const ampm = date.getHours() >= 12 ? 'pm' : 'am'

        return `${month}/${day}/${year} ${hour}:${minute}${ampm}`
    }

    // ---NPKs
    const fetchNPKs = async () => {
        const res = await api.get(`/user/project/npk`)

        if (res.status < 300 && res.data) NPKs.value = res.data.obj
        return res
    }

    const getNPKChartData = (projectId) => {
        const N = {
            label: 'Nitrogen',
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            data: [],
        }

        const P = {
            label: 'Phosphorus',
            backgroundColor: '#2196F3',
            borderColor: '#2196F3',
            data: [],
        }

        const K = {
            label: 'Potassium',
            backgroundColor: '#FF9800',
            borderColor: '#FF9800',
            data: [],
        }

        const labels = []

        for (const npk of NPKs.value) {
            if (npk.projectId != projectId) continue
            
            N.data.push(npk.nitrogen)
            P.data.push(npk.phosphorus)
            K.data.push(npk.potassium)
            labels.push(formatDate(npk.createdAt))
        }

        return { labels, datasets: [N, P, K] }
    }
    
    // ---PHs
    const fetchPHs = async () => {
        const res = await api.get(`/user/project/ph`)

        if (res.status < 300 && res.data) PHs.value = res.data.obj
        return res
    }

    const getPHChartData = (projectId) => {
        const pH = {
            label: 'pH Level',
            backgroundColor: '#8e44ad',
            borderColor: '#8e44ad',
            data: [],
        }

        const labels = []

        for (const ph of PHs.value) {
            if (ph.projectId != projectId) continue
            
            pH.data.push(ph.ph)
            labels.push(formatDate(ph.createdAt))
        }

        return { labels, datasets: [pH] }
    }





    // ---expose
    return {
        NPKs,
        PHs,

        formatDate,

        fetchNPKs,
        getNPKChartData,

        fetchPHs,
        getPHChartData,
    }


})