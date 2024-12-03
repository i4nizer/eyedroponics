<template>
    <v-container class="pa-10">
        <AlertList />
    </v-container>
</template>

<script setup>
import { useAlertStore } from "@/store/alert";
import layout from "@/utils/layout";
import notif from "@/utils/notif";
import { defineAsyncComponent, onBeforeMount } from "vue";

const AlertList = defineAsyncComponent(() => import("@/components/alerts/AlertList.vue"))


const alerts = useAlertStore()

layout.showAppBar.value = true;
layout.showNavDrawer.value = true;


onBeforeMount(async () => {

    await alerts
        .fetchAlerts()
        .then(res => notif.add(res.data?.txt ?? 'Alerts fetched successfully.', 'success'))
        .catch(err => notif.addError(err))

})
</script>
