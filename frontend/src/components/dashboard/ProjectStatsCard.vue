<template>
    <v-card class="pa-10">
        <v-card-title class="mb-5">{{ proj?.name }}</v-card-title>
        <v-card-text class="d-flex flex-wrap flex-column ga-5 justify-center" >
            
            <Camera 
                v-for="cam in cameras"
                :device-id="cam._id"
                :key="cam._id"
            />
            <NPKChart 
                v-for="npk in NPKs"
                :device-id="npk._id"
                :key="npk._id"
            />
            <PHChart 
                v-for="ph in PHs"
                :device-id="ph._id"
                :key="ph._id"
            />
            
        </v-card-text>
    </v-card>
</template>

<script setup>
import socket from '@/utils/socket';
import { useProjectStore } from '@/store/project';
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue';

const Camera = defineAsyncComponent(() => import("@/components/dashboard/Camera.vue"))
const NPKChart = defineAsyncComponent(() => import("@/components/dashboard/NPKChart.vue"))
const PHChart = defineAsyncComponent(() => import("@/components/dashboard/PHChart.vue"))


// Project
const props = defineProps(['project-id'])
const project = useProjectStore()
const proj = project.getProject(props.projectId)

// Devices
const devices = project.getDevices(props.projectId)

// Sensors
const cameras = devices.filter(d => d.sensors.includes('Camera'))
const NPKs = devices.filter(d => d.sensors.includes('NPK'))
const PHs = devices.filter(d => d.sensors.includes('pH'))


// Connect Socket and Register Devices
onMounted(() => {

    socket.connect()
    devices.forEach(d => socket.emit('register', d.key))

})

// Unregister Devices and Disconnect Socket
onUnmounted(() => {

    devices.forEach(d => socket.emit('unregister', d.key))
    socket.disconnect()

})


</script>