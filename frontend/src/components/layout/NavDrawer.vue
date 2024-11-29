<template>
    <div v-if="layout.showNavDrawer.value">
        <v-navigation-drawer v-model="layout.drawer.value">
            <v-list>
                <v-list-item prepend-icon="mdi-chart-bar" :to="{ name: 'Dashboard' }" link>Dashboard</v-list-item>
                <v-list-item prepend-icon="mdi-access-point" :to="{ name: 'Projects' }" link>Projects</v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script setup>
import layout from "@/utils/layout";

</script>

<style scoped></style>
