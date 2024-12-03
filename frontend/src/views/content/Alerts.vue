<template>
    <v-container class="pa-10">
        <AlertList />
    </v-container>
</template>

<script setup>
import layout from "@/utils/layout";
import { defineAsyncComponent } from "vue";

const AlertList = defineAsyncComponent(() => import("@/components/alerts/AlertList.vue"))


layout.showAppBar.value = true;
layout.showNavDrawer.value = true;
</script>
