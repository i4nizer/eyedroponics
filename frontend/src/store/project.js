import api from "@/utils/api";
import { defineStore } from "pinia";
import { ref, watch } from "vue";



export const useProjectStore = defineStore('Project', () => {

    // ---state
    const devices = ref(JSON.parse(localStorage.getItem('devices')) || [])
    const projects = ref(JSON.parse(localStorage.getItem('projects')) || [])
    const thresholds = ref(JSON.parse(localStorage.getItem('thresholds')) || [])

    
    // ---getters


    // ---watchers
    watch(devices, (nv) => localStorage.setItem('devices', JSON.stringify(nv)), { deep: true })
    watch(projects, (nv) => localStorage.setItem('projects', JSON.stringify(nv)), { deep: true })
    watch(thresholds, (nv) => localStorage.setItem('thresholds', JSON.stringify(nv)), { deep: true })


    // ---actions

    // ------devices
    const fetchDevices = async () => {
        const res = await api.get(`/user/project/device`)

        if (res.status < 300 && res.data) devices.value = res.data.obj
        return res
    }

    const getDevice = (deviceId) => devices.value.find(d => d._id == deviceId)
    const getDevices = (projectId) => devices.value.filter(d => d.projectId == projectId)
    
    const addDevice = async (projectId, name, sensors = []) => {
        const data = { name, sensors }
        const res = await api.post(`/user/project/${projectId}/device`, data)
        
        if (res.status < 300 && res.data) devices.value.push(res.data.obj)
        return res
    }

    const editDevice = async (projectId, deviceId, name, sensors = []) => {
        const data = { name, sensors }
        const res = await api.patch(`/user/project/${projectId}/device/${deviceId}`, data)
        
        if (res.status < 300 && res.data) devices.value[devices.value.findIndex(d => d._id == deviceId)] = res.data.obj
        return res
    }

    const removeDevice = async (projectId, deviceId) => {
        const res = await api.delete(`/user/project/${projectId}/device/${deviceId}`)
        
        if (res.status < 300) devices.value = devices.value.filter(d => d._id != deviceId)
        return res
    }

    // ------projects
    const fetchProjects = async () => {
        const res = await api.get(`/user/project`)

        if (res.status < 300 && res.data) projects.value = res.data.obj
        return res
    }

    const getProject = (projectId) => projects.value.find(p => p._id == projectId)

    const createProject = async (name) => {
        const data = { name }
        const res = await api.post(`/user/project`, data)

        if (res.status < 300 && res.data) {
            projects.value.push(res.data.obj.project)
            thresholds.value.push(res.data.obj.threshold)
        }

        return res
    }

    const editProject = async (projectId, name) => {
        const data = { name }
        const res = await api.patch(`/user/project/${projectId}`, data)

        if (res.status < 300 && res.data) projects.value[projects.value.findIndex(p => p._id == projectId)] = res.data.obj
        return res
    }

    const removeProject = async (projectId) => {
        const res = await api.delete(`/user/project/${projectId}`)

        if (res.status < 300) {
            projects.value = projects.value.filter(p => p._id != projectId)
            thresholds.value = thresholds.value.filter(t => t.projectId != projectId)
        }
        
        return res
    }
    
    // ------thresholds
    const fetchThresholds = async () => {
        const res = await api.get(`/user/project/threshold`)

        if (res.status < 300 && res.data) thresholds.value = res.data.obj
        return res
    }

    const getThreshold = (projectId) => thresholds.value.find(t => t.projectId == projectId)

    const editThreshold = async (projectId, thresholdId, nitrogen, phosphorus, potassium, ph) => {
        const data = { nitrogen, phosphorus, potassium, ph }
        const res = await api.patch(`/user/project/${projectId}/threshold/${thresholdId}`, data)

        if (res.status < 300 && res.data) thresholds.value[thresholds.value.findIndex(t => t._id == thresholdId)] = res.data.obj
        return res
    }





    // ---expose
    return {
        devices,
        projects,
        thresholds,
        
        fetchDevices,
        getDevice,
        getDevices,
        addDevice,
        editDevice,
        removeDevice,

        getProject,
        fetchProjects,
        createProject,
        editProject,
        removeProject,

        fetchThresholds,
        getThreshold,
        editThreshold,
    }

})