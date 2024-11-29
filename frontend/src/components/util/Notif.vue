<template>
    <div class="notif-container">
        <transition-group name="fade-up">
            <v-alert
                v-for="n in notif.all.value "
                :key="n.id"
                :type="n.type"
                :text="n.message"
                closable
                @click:close="notif.remove(n.id)"
                class="notif"
            >
            </v-alert>
        </transition-group>
    </div>
</template>

<script setup>
import notif from "@/utils/notif"

</script>

<style scoped>
.notif-container {
    position: fixed;
    bottom: 10px;
    right: 10px;
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
    z-index: 9999;
}

.notif {
    min-width: 300px;
}

.fade-up-enter-active,
.fade-up-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}
.fade-up-enter-from {
    opacity: 0;
    transform: translateY(20px);
}
.fade-up-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
