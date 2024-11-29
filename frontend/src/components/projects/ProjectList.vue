<template>
    <v-list class="d-flex flex-row ga-5 flex-wrap justify-start align-start bg-transparent">
        
        <!-- List Project Cards -->
        <ProjectCard 
            v-for="proj in project.projects" 
            :project="proj" 
            :key="proj?._id"
            width="100%"
        />

    </v-list>
</template>

<script setup>
import { useProjectStore } from '@/store/project';
import { defineAsyncComponent } from 'vue';

const ProjectCard = defineAsyncComponent(() => import('@/components/projects/ProjectCard.vue'))


const project = useProjectStore()


</script>

<style lang="scss" scoped>

</style>