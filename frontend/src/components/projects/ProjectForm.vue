<template>
    <v-form class="rounded pa-10 bg-grey-darken-4 d-flex ga-5" v-model="valid" @submit.prevent="createProject">
        <v-text-field 
            prepend-inner-icon="mdi-pencil-box"
            v-model="name" 
            label="Create Your Project Here" 
            hint="Enter your project name"
            variant="outlined"
            clearable
            :rules="[rules.required, rules.min3]"
        />
        <v-btn 
            @click="createProject" 
            :disabled="!valid" 
            :loading="loading" 
            size="x-large"
            class="pl-5 pr-5 bg-success"
        >Create</v-btn>
    </v-form>
</template>

<script setup>
import rules from '@/utils/rules';
import { ref } from 'vue';
import { useProjectStore } from '@/store/project';
import notif from '@/utils/notif';


const project = useProjectStore()

const name = ref('')

const valid = ref(false)
const loading = ref(false)


const createProject = async () => {
    if (!valid.value || loading.value) return
    loading.value = true

    await project
        .createProject(name.value)
        .then(res => notif.add(res.data.txt, 'success'))
        .catch(err => notif.addError(err))

    loading.value = false
}

</script>

<style lang="scss" scoped>

</style>