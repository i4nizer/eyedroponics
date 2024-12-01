<template>
    <v-card class="border pa-5 w-100">
        <v-card-title>Camera</v-card-title>
        <v-card-text>
            <img
                v-if="src"
                :src="src"
                alt="Live Camera Feed"
            />
            <v-card-text v-else class="text-center">
                Camera Inactive
            </v-card-text>
            <v-card-text v-if="src" class="text-center">
                FPS: {{ fps }}
            </v-card-text>
            <v-card-text v-if="prediction" class="text-center">
                Prediction: <strong>{{ prediction.predictedClass }}</strong>
            </v-card-text>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";
import { useProjectStore } from "@/store/project";


// Props
const props = defineProps(['device-id'])
const project = useProjectStore()
const device = project.getDevice(props.deviceId)


// Socket connection
const socket = io("http://localhost:4000");

// Reactive states
const src = ref("");
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
    // Register
    socket.emit('register', device.key)

    // Listen for 'image' events
    socket.on(`image-${device.key}`, onImage);

    // Start inactivity check interval
    inactivityCheck = setInterval(checkInactivity, 2500);
});

onUnmounted(() => {
    // Unregister, cleanup WebSocket, and intervals
    if (socket) socket.emit('unregister', device.key)
    if (socket) socket.disconnect();
    if (inactivityCheck) clearInterval(inactivityCheck);

});
</script>

<style scoped>
/* Ensure the image scales to fit the container width while maintaining the aspect ratio */
img {
    display: block;
    width: 100%; /* Expand to fit the container width */
    height: auto; /* Maintain aspect ratio */
    object-fit: contain; /* Ensure the image is not cropped */
}
</style>
