<template>
    <v-card class="border w-100">
        <v-card-text>
            <v-card-actions class="border rounded">
                <v-card-title>{{ device.name }} - Camera</v-card-title>
                <v-spacer></v-spacer>
                <v-btn
                    :text="show ? 'Hide Camera' : 'Show Camera'"
                    :color="src ? 'success' : 'gray'"
                    size="large"
                    prepend-icon="mdi-camera"
                    :disabled="!src"
                    @click="show = !show"
                ></v-btn>
                <CameraCardBtn />
            </v-card-actions>
            <div v-if="src && show" class="border rounded mt-2">
                <img :src="src" alt="Live Camera Feed" class="d-block w-100 mt-2 pa-5 h-auto object-contain"/>
                <div class="d-flex justify-center">
                    <v-card-text>FPS: {{ fps ?? 0 }}</v-card-text>
                    <v-card-text>Prediction: <strong>{{ prediction?.predictedClass ?? "None" }}</strong></v-card-text>
                    <v-card-text>Confidence: {{ prediction?.probabilities[prediction?.predictedIndex] ?? "0" }}%</v-card-text>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import socket from "@/utils/socket";
import { ref, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import { useProjectStore } from "@/store/project";

const CameraCardBtn = defineAsyncComponent(() => import("@/components/dashboard/CameraCardBtn.vue"))

// Props
const props = defineProps(["device-id"]);
const project = useProjectStore();
const device = project.getDevice(props.deviceId);

// Reactive states
const src = ref("");
const show = ref(false);
const prediction = ref(null); // Prediction result

const fps = ref(0);
const lastFrameTime = ref(0); // To calculate delta time for FPS
const inactivityThreshold = 5000; // 5 seconds timeout for inactivity
let inactivityCheck;

/**
 * Handle incoming image and update FPS and predictions.
 * @param {Object} args - The incoming data from the server.
 */
const onImage = (args) => {
    // args = { predictedIndex, predictedClass, probabilities, imageBuffer }
    const { predictedIndex, predictedClass, probabilities, imageBuffer } = args;

    // Calculate delta time and FPS
    const currentTime = Date.now();
    if (lastFrameTime.value > 0) {
        const deltaTime = currentTime - lastFrameTime.value;
        fps.value = Math.round(1000 / deltaTime); // Calculate FPS
    }
    lastFrameTime.value = currentTime; // Update for the next frame

    // Revoke the previous Blob URL to free memory
    if (src.value) {
        URL.revokeObjectURL(src.value);
    }

    // Convert image buffer to Blob and create a new object URL
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    src.value = URL.createObjectURL(blob);

    // Update prediction
    prediction.value = { predictedIndex, predictedClass, probabilities };
};

/**
 * Check for inactivity and reset states if no frames are received.
 */
const checkInactivity = () => {
    const currentTime = Date.now();

    // Check for inactivity
    if (currentTime - lastFrameTime.value > inactivityThreshold) {
        // Revoke the current Blob URL if active
        if (src.value) {
            URL.revokeObjectURL(src.value);
            src.value = ""; // Reset image source
        }
        fps.value = 0; // Reset FPS
        prediction.value = null; // Clear prediction
    }
};

onMounted(() => {
    // Listen for 'image' events
    socket.on(`image-${device.key}`, onImage);

    // Start inactivity check interval
    inactivityCheck = setInterval(checkInactivity, 2500);
});

onUnmounted(() => {
    // Intervals
    if (inactivityCheck) clearInterval(inactivityCheck);
});
</script>