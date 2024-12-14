<template>
    <v-app>
        <v-layout class="rounded rounded-md">
            <AppBar />
            <NavDrawer />
            <v-main>
                <router-view />
            </v-main>
        </v-layout>
        <Notif />
    </v-app>
</template>

<script setup>
import { useTokenStore } from "./store/token";
import { defineAsyncComponent } from "vue";
import AppBar from "./components/layout/AppBar.vue";
import NavDrawer from "./components/layout/NavDrawer.vue";

const Notif = defineAsyncComponent(() => import("@/components/util/Notif.vue"));

const token = useTokenStore();
token.startRotation();
</script>