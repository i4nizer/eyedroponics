<template>
    <v-container class="pa-10">
        <ProjectForm />
        <ProjectList class="mb-5" />
    </v-container>
</template>

<script setup>
import notif from '@/utils/notif';
import layout from '@/utils/layout';
import { useProjectStore } from '@/store/project';
import { defineAsyncComponent, onBeforeMount } from 'vue';

const ProjectForm = defineAsyncComponent(() => import('@/components/projects/ProjectForm.vue'))
const ProjectList = defineAsyncComponent(() => import('@/components/projects/ProjectList.vue'))


const project = useProjectStore()

layout.showAppBar.value = true
layout.showNavDrawer.value = true


onBeforeMount(async () => {

    await project
        .fetchProjects()
        .then(res => notif.add('Projects fetched successfully', 'success'))
        .catch(err => notif.addError(err))

    await project
        .fetchDevices()
        .then(res => notif.add('Project devices fetched successfully', 'success'))
        .catch(err => notif.addError(err))

    await project
        .fetchThresholds()
        .then(res => notif.add('Project thresholds fetched successfully', 'success'))
        .catch(err => notif.addError(err))

})


</script>
