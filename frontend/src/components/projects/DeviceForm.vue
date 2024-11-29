<template>
    <v-form class="d-flex flex-row ga-2 pa-5 border rounded" v-model="valid" @submit.prevent="addDevice">
        <v-text-field 
            prepend-inner-icon="mdi-devices"
            v-model="name"
            label="Add Device To Get API Key"
            hint="Enter your device name"
            density="compact"
            variant="outlined"
            width="50%"
            clearable
            :rules="[rules.required, rules.min3]"
        ></v-text-field>
        <v-select
            prepend-inner-icon="mdi-radar"
            v-model="sensors"
            label="Select Sensors"
            variant="outlined"
            density="compact"
            width="30%"
            chips
            multiple
            clearable
            :items="['NPK', 'pH', 'Camera']"
        ></v-select>
        <v-btn 
            @click="addDevice"
            class="bg-success"
            :loading="loading"
            :disabled="!valid || loading"
        >Add</v-btn>
    </v-form>
</template>

<script setup>
import notif from '@/utils/notif';
import rules from '@/utils/rules';
import { ref } from 'vue';
import { useProjectStore } from '@/store/project';


const project = useProjectStore()
const props = defineProps(['project-id'])

const name = ref('')
const sensors = ref([])
const valid = ref(false)
const loading = ref(false)


const addDevice = async () => {
    if (!valid.value || loading.value) return
    loading.value = true

    await project
        .addDevice(props.projectId, name.value, sensors.value)
        .then(res => notif.add(res.data.txt, 'success'))
        .then(() => name.value = '')
        .then(() => sensors.value = [])
        .catch(err => notif.addError(err))

    loading.value = false
}

</script>

<style lang="scss" scoped>

</style>