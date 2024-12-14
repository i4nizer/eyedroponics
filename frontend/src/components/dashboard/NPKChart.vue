<template>
    <v-card class="border pa-5 w-100">
        <v-card-title>{{ device.name }} - NPK Chart</v-card-title>
        <v-card-text>
            <Line ref="chartRef" v-if="chartData" :data="chartData" :options="options" />
            <v-card-text v-else class="text-center pa-10">No Data Yet</v-card-text>
        </v-card-text>
    </v-card>
</template>

<script setup>
import socket from "@/utils/socket";
import { ref, computed, onMounted } from "vue";
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { useDataStore } from "@/store/data";
import { useProjectStore } from "@/store/project";


// Register Chart.js components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
);

// Props
const props = defineProps(["device-id"]);
const project = useProjectStore()
const device = project.getDevice(props.deviceId)

// Reactive state
const data = useDataStore()
const chartRef = ref(null)
const chartData = computed(() => data.getNPKChartData(device._id));
const options = ref({ responsive: true, maintainAspectRatio: true, scales: { y: { beginAtZero: true } } });


// Function to handle incoming data
const onNPK = (args) => {
    // args = { n, p, k }
    const npk = args    
    chartData.value.datasets[0].data.push(npk.nitrogen)
    chartData.value.datasets[1].data.push(npk.phosphorus)
    chartData.value.datasets[2].data.push(npk.potassium)
    chartData.value.labels.push(data.formatDate(npk.createdAt))

    // reduce if over 30
    if (chartData.value.datasets[0].data.length > 30) chartData.value.datasets[0].data.shift()
    if (chartData.value.datasets[1].data.length > 30) chartData.value.datasets[1].data.shift()
    if (chartData.value.datasets[2].data.length > 30) chartData.value.datasets[2].data.shift()
    if (chartData.value.labels.length > 30) chartData.value.labels.shift()
    
    // update visual
    chartRef.value.chart.update()
};


onMounted(() => {
    // Listen for incoming data
    socket.on(`npk-${device.key}`, onNPK);
});
</script>