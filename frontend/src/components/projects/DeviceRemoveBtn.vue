<template>
    <v-btn 
        class="bg-red mr-2" 
        elevation="1" 
        :disabled="loading"
        :loading="loading"
        @click="removeDevice"
    >Remove</v-btn>
</template>

<script setup>
import { ref } from 'vue';
import { useProjectStore } from '@/store/project';
import notif from '@/utils/notif';


const props = defineProps(['device-id'])
const project = useProjectStore()

const device = project.getDevice(props.deviceId)
const loading = ref(false)


const removeDevice = async () => {
    if (loading.value) return
    loading.value = true

    await project
        .removeDevice(device?.projectId, device?._id)
        .then(res => notif.add(res.data.txt, 'success'))
        .catch(err => notif.addError(err))

    loading.value = false
}


</script>

<style lang="scss" scoped>

</style>