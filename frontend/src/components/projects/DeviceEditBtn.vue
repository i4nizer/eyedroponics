<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="primary"
                text="Edit"
                elevation="1"
                class="mr-2"
                ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Edit Device">
                <v-form class="pa-5 d-flex flex-column align-end" v-model="valid" @submit.prevent="editDevice(isActive)">
                    <v-text-field
                        v-model="name"
                        label="Add Device To Get API Key"
                        hint="Enter your device name"
                        clearable
                        width="100%"
                        variant="outlined"
                        :rules="[rules.required, rules.min3]"
                    >
                    </v-text-field>
                    <v-select
                        v-model="sensors"
                        clearable
                        chips
                        label="Select Sensors"
                        multiple
                        width="100%"
                        variant="outlined"
                        :items="['NPK', 'pH', 'Camera']"
                    ></v-select>
                    <v-btn
                        text="Save"
                        color="success"
                        size="large"
                        width="fit-content"
                        :disabled="!valid || loading"
                        :loading="loading"
                        @click="editDevice(isActive)"
                    ></v-btn>
                </v-form>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>
import notif from '@/utils/notif';
import rules from '@/utils/rules';
import { computed, ref } from 'vue';
import { useProjectStore } from '@/store/project';


const props = defineProps(['device-id'])
const project = useProjectStore()

const device = computed(() => project.getDevice(props.deviceId))

const name = ref(device.value.name || '')
const sensors = ref(device.value.sensors || [])

const valid = ref(false)
const loading = ref(false)


const editDevice = async (isActive) => {
    if (!valid.value || loading.value) return
    loading.value = true

    await project
        .editDevice(device?.value.projectId, device?.value._id, name.value, sensors.value)
        .then(res => notif.add(res.data.txt, 'success'))
        .then(() => name.value = '')
        .then(() => sensors.value = [])
        .catch(err => notif.addError(err))

    loading.value = false
    isActive.value = false
}



</script>

<style lang="scss" scoped></style>
