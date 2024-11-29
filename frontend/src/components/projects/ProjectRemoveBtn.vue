<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                elevation="1"
                text="Remove"
                size="large"
                class="bg-red pl-5 pr-5"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Do you want to remove this Project?">
                <v-form class="pa-5 d-flex flex-column align-end" @submit.prevent="removeProject(isActive)">
                    <v-text-field
                        v-model="name"
                        :label="label"
                        hint="Projects aren't totally removed, they are soft deleted"
                        clearable
                        width="100%"
                        variant="outlined"
                    >
                    </v-text-field>
                    <v-btn
                        text="Remove"
                        color="red"
                        size="large"
                        width="fit-content"
                        :disabled="!valid || loading"
                        :loading="loading"
                        @click="removeProject(isActive)"
                    ></v-btn>
                </v-form>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>
import notif from '@/utils/notif';
import { ref, watch } from 'vue';
import { useProjectStore } from '@/store/project';


const props = defineProps(['project-id'])
const project = useProjectStore()

const proj = project.getProject(props.projectId)

const name = ref('')
const label = `Enter "${proj?.name}" to confirm`

const valid = ref(false)
const loading = ref(false)


watch(name, (nv) => valid.value = nv == proj?.name)


const removeProject = async (isActive) => {
    if (!valid.value || loading.value) return;
    loading.value = true

    await project
        .removeProject(props.projectId)
        .then(res => notif.add(res.data.txt, 'success'))
        .then(() => name.value = '')
        .catch(err => notif.addError(err))

    loading.value = false
    isActive.value = false
}



</script>

<style lang="scss" scoped></style>
