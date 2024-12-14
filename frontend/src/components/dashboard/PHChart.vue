<template>
    <v-card class="border pa-5 w-100">
        <v-card-title>{{ device.name }} - pH Level Chart</v-card-title>
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
const project = useProjectStore();
const device = project.getDevice(props.deviceId);

// Reactive state
const data = useDataStore();
const chartRef = ref(null)
const chartData = computed(() => data.getPHChartData(device._id));
const options = ref({ responsive: true, maintainAspectRatio: true, scales: { y: { beginAtZero: true } } });


// Function to handle incoming data
const onPH = (args) => {
    // args = { ph }
    chartData.value.datasets[0].data.push(args.ph);
    chartData.value.labels.push(data.formatDate(args.createdAt))

    // reduce if over 30
    if (chartData.value.datasets[0].data.length > 30) chartData.value.datasets[0].data.shift()
    if (chartData.value.labels.length > 30) chartData.value.labels.shift()

    // update visual
    chartRef.value.chart.update()
};

onMounted(() => {
    // Listen for incoming data
    socket.on(`ph-${device.key}`, onPH);
});
</script>
