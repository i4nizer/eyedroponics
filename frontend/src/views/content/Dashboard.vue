<template>
    <v-container class="pa-10">
        <ProjectStatsCard 
            class="mt-2"
            v-for="proj in project.projects" 
            :key="proj?._id"
            :project-id="proj?._id"
        />
    </v-container>
</template>

<script setup>
import { useDataStore } from "@/store/data";
import { useProjectStore } from "@/store/project";
import layout from "@/utils/layout";
import notif from "@/utils/notif";
import { defineAsyncComponent, onBeforeMount } from "vue";

const ProjectStatsCard = defineAsyncComponent(() => import("@/components/dashboard/ProjectStatsCard.vue"))


const data = useDataStore()
const project = useProjectStore()

layout.showAppBar.value = true;
layout.showNavDrawer.value = true;  


onBeforeMount(async () => {

    await project
        .fetchProjects()
        .then(res => notif.add('Projects fetched successfully', 'success'))
        .catch(err => notif.addError(err))

    await data
        .fetchNPKs()
        .then(res => notif.add('NPK data fetched successfully', 'success'))
        .catch(err => notif.addError(err))

    await data
        .fetchPHs()
        .then(res => notif.add('pH data fetched successfully', 'success'))
        .catch(err => notif.addError(err))
        
})



</script>
