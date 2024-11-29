<template>
    <v-form class="border rounded pa-5" @submit.prevent="saveChanges">
        <v-card-title class="text-center">Threshold</v-card-title>
        <v-card-text class="d-flex flex-row align-center pa-0">
            <v-range-slider 
                prepend-icon="mdi-molecule"
                v-model="nitrogen" 
                thumb-label="always"
                label="Nitrogen"
                color="blue"
                direction="vertical"
                strict
            ></v-range-slider>
            <v-range-slider 
                prepend-icon="mdi-flask-outline"
                v-model="phosphorus" 
                thumb-label="always"
                label="Phosphorus"
                color="purple"
                direction="vertical"
                strict
            ></v-range-slider>
            <v-range-slider 
                prepend-icon="mdi-atom"
                v-model="potassium" 
                thumb-label="always"
                label="Potassium"
                color="orange"
                direction="vertical"
                strict
            ></v-range-slider>
            <v-range-slider 
                prepend-icon="mdi-water"
                v-model="ph" 
                thumb-label="always"
                label="pH"
                color="green"
                direction="vertical"
                strict
            ></v-range-slider>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                :disabled="!changed || loading"
                :loading="loading"
                elevation="1"
                class="bg-blue pl-4 pr-4"
                @click="saveChanges"
            >Save Changes</v-btn>
        </v-card-actions>
    </v-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProjectStore } from '@/store/project'
import notif from '@/utils/notif';


const project = useProjectStore()
const props = defineProps(['project-id'])

const changed = ref(false)
const loading = ref(false)
const threshold = project.getThreshold(props.projectId)

const initialNitrogen = [threshold.nitrogen.min, threshold.nitrogen.max] || [0, 0]
const initialPhosphorus = [threshold.phosphorus.min, threshold.phosphorus.max] || [0, 0]
const initialPotassium = [threshold.potassium.min, threshold.potassium.max] || [0, 0]
const initialPh = [threshold.ph.min, threshold.ph.max] || [0, 0]

const nitrogen = ref([...initialNitrogen])
const phosphorus = ref([...initialPhosphorus])
const potassium = ref([...initialPotassium])
const ph = ref([...initialPh])


const checkChanges = () => {
    changed.value = (
        nitrogen.value[0] !== initialNitrogen[0] || nitrogen.value[1] !== initialNitrogen[1] ||
        phosphorus.value[0] !== initialPhosphorus[0] || phosphorus.value[1] !== initialPhosphorus[1] ||
        potassium.value[0] !== initialPotassium[0] || potassium.value[1] !== initialPotassium[1] ||
        ph.value[0] !== initialPh[0] || ph.value[1] !== initialPh[1]
    )
}

const saveChanges = async () => {
    loading.value = true
    let saved = false

    const N = { min: nitrogen.value[0], max: nitrogen.value[1] }
    const P = { min: phosphorus.value[0], max: phosphorus.value[1] }
    const K = { min: potassium.value[0], max: potassium.value[1] }
    const pH = { min: ph.value[0], max: ph.value[1] }
    
    await project
        .editThreshold(props.projectId, threshold._id, N, P, K, pH)
        .then(res => notif.add(res.data.txt, 'success'))
        .then(() => saved = true)
        .catch(err => notif.addError(err))
        .finally(() => loading.value = false)

    if (!saved) return

    initialNitrogen[0] = nitrogen.value[0]
    initialNitrogen[1] = nitrogen.value[1]

    initialPhosphorus[0] = phosphorus.value[0]
    initialPhosphorus[1] = phosphorus.value[1]

    initialPotassium[0] = potassium.value[0]
    initialPotassium[1] = potassium.value[1]

    initialPh[0] = ph.value[0]
    initialPh[1] = ph.value[1]

    changed.value = false    
}


watch(nitrogen, checkChanges, { deep: true })
watch(phosphorus, checkChanges, { deep: true })
watch(potassium, checkChanges, { deep: true })
watch(ph, checkChanges, { deep: true })


</script>

<style lang="scss" scoped>

</style>