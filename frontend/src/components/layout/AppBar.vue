<template>
    <v-app-bar v-if="layout.showAppBar.value" :elevation="1">
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click="layout.drawer.value = !layout.drawer.value"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Eye    droponics</v-app-bar-title>

        <template v-slot:append>
            <v-btn icon="mdi-alert" to="/alerts"></v-btn>
        </template>
    </v-app-bar>
</template>

<script setup>
import layout from "@/utils/layout";

</script>

<style scoped></style>
