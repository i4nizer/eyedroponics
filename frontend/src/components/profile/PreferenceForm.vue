<template>
    <v-card class="pa-10 mt-2">
        <v-card-title class="text-h6">Preferences</v-card-title>
        <v-switch
            label="Email Alerts"
            v-model="user.emailAlerts"
            prepend-icon="mdi-bell-alert"
            :loading="loading"
            :disabled="loading"
            @change="updatePreference"
        />
        <v-text-field
            label="Alert Interval (Minutes)"
            v-model.number="user.emailAlertInterval"
            type="number"
            min="1"
            prepend-icon="mdi-timer"
            :loading="loading"
            :disabled="loading"
            @change="updatePreference"
        />
    </v-card>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import notif from '@/utils/notif';
import { ref } from 'vue';

//
const user = useUserStore()

const loading = ref(false)


const updatePreference = async () => { 

    await user.editPref(user.emailAlerts, user.emailAlertInterval)
        .then(res => notif.add(res.data?.txt ?? "Preference updated successfully.", "success"))
        .catch(err => notif.addError(err))
    
}


</script>