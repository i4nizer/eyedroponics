<template>
    <v-card class="pa-10">
        <v-card-title class="mb-5">{{ proj?.name }}</v-card-title>
        <v-card-text class="d-flex flex-wrap flex-column ga-5 justify-center" >
            <Camera :project-id="props?.projectId" />
            <NPKChart :project-id="props?.projectId" />
            <PHChart :project-id="props?.projectId" />
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useProjectStore } from '@/store/project';
import { defineAsyncComponent } from 'vue';

const Camera = defineAsyncComponent(() => import("@/components/dashboard/Camera.vue"))
const NPKChart = defineAsyncComponent(() => import("@/components/dashboard/NPKChart.vue"))
const PHChart = defineAsyncComponent(() => import("@/components/dashboard/PHChart.vue"))


const props = defineProps(['project-id'])

const project = useProjectStore()
const proj = project.getProject(props.projectId)


</script>

<style lang="scss" scoped>

</style>