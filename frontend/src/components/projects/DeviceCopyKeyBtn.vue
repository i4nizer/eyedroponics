<template>
    <v-btn 
        class="bg-green mr-2" 
        elevation="1" 
        @click="copyKey" 
        :disabled="!device?.key"
    >Copy Key</v-btn>
</template>

<script setup>
import { useProjectStore } from '@/store/project';
import notif from '@/utils/notif';


const props = defineProps(['device-id'])
const project = useProjectStore()

const device = project.getDevice(props.deviceId)


const copyKey = () => {
    navigator.clipboard.writeText(device?.key)
    notif.add('Device API Key copied to clipboard.', 'success')
}

</script>

<style lang="scss" scoped>

</style>