<template>
    <v-card class="border pa-5">
        <v-card-title>pH Level Chart</v-card-title>
        <Line v-if="data.PHs.length > 0" :data="chartData" :options="options" />
        <v-card-text v-else class="text-center pa-10">No Data Yet</v-card-text>
    </v-card>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { computed } from 'vue'
import { useDataStore } from '@/store/data';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'


ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const data = useDataStore()
const props = defineProps(['project-id'])

const chartData = computed(() => data.getPHChartData(props.projectId))

const options = { responsive: true, maintainAspectRatio: true }


</script>
