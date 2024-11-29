<template>
    <v-card class="border pa-5 width-100">
        <v-card-title>Camera</v-card-title>
        <v-card-text>
            <img v-if="src" class="width-100 height-auto" :src="src">
            <v-card-text v-else class="text-center pa-10">Camera Inactive</v-card-text>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';



const props = defineProps(['project-id'])

const src = ref('')


</script>

<style scoped>

</style>
