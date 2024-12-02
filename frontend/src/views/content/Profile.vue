<template>
    <v-container class="pa-10">
        <ProfileCard />
        <PreferenceForm />
    </v-container>
</template>

<script setup>
import layout from "@/utils/layout";
import { defineAsyncComponent } from "vue";

const ProfileCard = defineAsyncComponent(() => import('@/components/profile/ProfileCard.vue'))
const PreferenceForm = defineAsyncComponent(() => import('@/components/profile/PreferenceForm.vue'))


layout.showAppBar.value = true;
layout.showNavDrawer.value = true;
</script>
