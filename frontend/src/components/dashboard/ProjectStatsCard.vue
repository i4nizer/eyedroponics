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
                :project-id="props.projectId"
                :key="npk._id"
            />
            <PHChart 
                v-for="ph in PHs"
                :project-id="props.projectId"
                :key="ph._id"
            />
            
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useProjectStore } from '@/store/project';
import { defineAsyncComponent } from 'vue';

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



</script>

<style lang="scss" scoped>

</style>