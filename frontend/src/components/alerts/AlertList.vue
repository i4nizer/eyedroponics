<template>
    <v-list class="bg-transparent">
        <AlertCard
            v-for="al in alertsArr"
            :alert-id="al._id"
            :key="al._id"
        />
    </v-list>
</template>

<script setup>
import { useAlertStore } from '@/store/alert';
import { computed, defineAsyncComponent } from 'vue';

const AlertCard = defineAsyncComponent(() => import("@/components/alerts/AlertCard.vue"))


const alerts = useAlertStore()
const alertsArr = computed(() => alerts.alerts.sort((a, b) => a.dismissed - b.dismissed))


</script>