<template>
    <tr>
        <td>{{ device?.name }}</td>
        <td>{{ device?.key ? '...' + device?.key.substring(device?.key.length - 10) : 'No Key' }}</td>
        <td>
            <v-chip v-for="(sensor, index) in device?.sensors" :key="index" >{{ sensor }}</v-chip>
        </td>
        <td>
            <DeviceEditBtn :device-id="device?._id" />
            <DeviceCopyKeyBtn :device-id="device?._id" />
            <DeviceRemoveBtn :device-id="device?._id" />
        </td>
    </tr>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';


const DeviceEditBtn = defineAsyncComponent(() => import("@/components/projects/DeviceEditBtn.vue"))
const DeviceRemoveBtn = defineAsyncComponent(() => import("@/components/projects/DeviceRemoveBtn.vue"))
const DeviceCopyKeyBtn = defineAsyncComponent(() => import("@/components/projects/DeviceCopyKeyBtn.vue"))


const props = defineProps(['device'])




</script>

<style lang="scss" scoped>

</style>