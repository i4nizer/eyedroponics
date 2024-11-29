<template>
    <v-container class="pa-10">
        <ProjectStatsCard 
            v-for="proj in project.projects" 
            :key="proj?._id"
            :project-id="proj?._id"
        />
    </v-container>
</template>

<script setup>
import { useProjectStore } from "@/store/project";
import layout from "@/utils/layout";
import { defineAsyncComponent } from "vue";

const ProjectStatsCard = defineAsyncComponent(() => import("@/components/dashboard/ProjectStatsCard.vue"))


const project = useProjectStore()



layout.showAppBar.value = true;
layout.showNavDrawer.value = true;  

</script>
