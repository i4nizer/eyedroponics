<template>
    <v-card class="mt-2 pa-5">
        <v-card-title :class="[(alert.dismissed ? '':'text-warning')]">{{ alert.title }}</v-card-title>
        <v-card-text class="text-body-1">{{ alert.body }}</v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
                :class="[(alert.dismissed ? '':'bg-blue'), 'px-5']"
                size="large"
                @click="toggleDismiss"
            >{{ alert.dismissed ? 'Undismiss' : 'Dismiss' }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { useAlertStore } from '@/store/alert';
import notif from '@/utils/notif';
import { computed } from 'vue';


const props = defineProps(['alert-id'])
const alerts = useAlertStore()

const alert = computed(() => alerts.getAlert(props.alertId))


const toggleDismiss = async () => {

    await alerts
        .updateAlert(alert.value._id, !alert.value.dismissed)
        .then(res => notif.add(res.data?.txt ?? 'Alert updated successfully.', 'success'))
        .catch(err => notif.addError(err))

}


</script>

<style scoped>

</style>