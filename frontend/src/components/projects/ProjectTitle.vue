<template>
    <v-form v-model="valid" @submit.prevent="renameProject">
        <v-text-field
            v-model="text"
            variant="plain"
            append-icon="mdi-chip"
            :disabled="loading"
            :loading="loading"
            :rules="[rules.required, rules.min3]"
            @blur="renameProject"
        ></v-text-field>
    </v-form>
</template>

<script setup>
import notif from '@/utils/notif';
import rules from '@/utils/rules';
import { ref } from 'vue';
import { useProjectStore } from '@/store/project';


const props = defineProps(['project-id'])

const project = useProjectStore()
const proj = project.getProject(props.projectId)

const text = ref(proj?.name || '')
const valid = ref(false)
const loading = ref(false)


const renameProject = async () => {
    if (!valid.value || loading.value || proj?.name == text.value) return text.value = proj?.name
    loading.value = true

    await project
        .editProject(props.projectId, text.value)
        .then(res => notif.add(res.data.txt, 'success'))
        .catch(err => notif.addError(err))

    loading.value = false
}


</script>

<style scoped>

.v-text-field >>> input {
    font-size: 1.5em;
}

</style>