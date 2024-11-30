<template>
    <v-card class="border pa-5 width-100">
        <v-card-title>Camera</v-card-title>
        <v-card-text>
            <img
                v-if="src"
                class="responsive-img"
                :src="src"
                alt="Live Camera Feed"
            />
            <v-card-text v-else class="text-center pa-10">
                Camera Inactive
            </v-card-text>
            <v-card-text v-if="fps > 0" class="text-center mt-3">
                FPS: {{ fps }}
            </v-card-text>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";

// Reactive states
const src = ref("");
const fps = ref(0);
const lastFrameTime = ref(0);
let socket;
let fpsInterval;

// Time threshold for inactivity (in milliseconds)
const inactivityThreshold = 2000; // 2 seconds

onMounted(() => {
    // Connect to WebSocket server
    socket = io("http://localhost:PORT"); // Replace PORT with your server's port

    // Listen for 'image' events
    socket.on("image", (imageBuffer) => {
        // Update the last frame time
        lastFrameTime.value = Date.now();

        // Convert image buffer to Blob and create an object URL
        const blob = new Blob([imageBuffer], { type: "image/jpeg" });
        src.value = URL.createObjectURL(blob);
    });

    // Monitor FPS
    fpsInterval = setInterval(() => {
        const currentTime = Date.now();

        // Calculate FPS
        if (lastFrameTime.value) {
            const deltaTime = currentTime - lastFrameTime.value;
            if (deltaTime < 1000) {
                fps.value = Math.round(1000 / deltaTime);
            } else {
                fps.value = 0; // Too slow, reset FPS
            }
        }

        // Check for inactivity
        if (currentTime - lastFrameTime.value > inactivityThreshold) {
            src.value = ""; // Reset image source
            fps.value = 0; // Reset FPS
        }
    }, 100);
});

onUnmounted(() => {
    // Cleanup WebSocket and intervals
    if (socket) socket.disconnect();
    if (fpsInterval) clearInterval(fpsInterval);
});
</script>

<style scoped>
/* Ensure the image scales to fit the container width while maintaining the aspect ratio */
.responsive-img {
    display: block;
    width: 100%; /* Expand to fit the container width */
    height: auto; /* Maintain aspect ratio */
    object-fit: contain; /* Ensure the image is not cropped */
}
</style>
