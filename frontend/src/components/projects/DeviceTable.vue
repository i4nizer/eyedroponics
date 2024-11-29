<template>
    <v-table class="border">
        <thead> 
            <tr> 
                <th>Device</th> 
                <th>Api Key</th> 
                <th>Sensors</th> 
                <th>Actions</th> 
            </tr> 
        </thead>
        <tbody>
            <!-- List of Devices -->
            <DeviceRow v-for="device in devices" v-if="devices.length > 0" :device="device" :key="device?._id" />
            <tr v-else> <td class="text-center" colspan="4">No Devices Yet</td> </tr>
        </tbody>
    </v-table>
</template>

<script setup>
import { useProjectStore } from '@/store/project';
import { computed, defineAsyncComponent } from 'vue';

const DeviceRow = defineAsyncComponent(() => import("@/components/projects/DeviceRow.vue"))


const props = defineProps(['project-id'])
const project = useProjectStore()

const devices = computed(() => project.getDevices(props.projectId))


</script>

<style lang="scss" scoped>

</style>