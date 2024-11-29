<template>
    <v-card class="pa-10 pt-5">
        <ProjectTitle :project-id="project?._id" />
        <DeviceForm class="mt-5" :project-id="project?._id" />
        <DeviceTable class="mt-5" :project-id="project?._id" />
        <ProjectThreshold class="mt-5" :project-id="project?._id" />
        <v-card-actions class="mt-5">
            <v-spacer></v-spacer>
            <ProjectRemoveBtn :project-id="project?._id" />
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const ProjectTitle = defineAsyncComponent(() => import('@/components/projects/ProjectTitle.vue'))
const DeviceForm = defineAsyncComponent(() => import('@/components/projects/DeviceForm.vue'))
const DeviceTable = defineAsyncComponent(() => import('@/components/projects/DeviceTable.vue'))
const ProjectThreshold = defineAsyncComponent(() => import('@/components/projects/ProjectThreshold.vue'))
const ProjectRemoveBtn = defineAsyncComponent(() => import('@/components/projects/ProjectRemoveBtn.vue'))


const props = defineProps(['project'])


</script>

<style lang="scss" scoped>

</style>