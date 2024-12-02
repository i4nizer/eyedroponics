<template>
    <v-card class="pa-10">
        <v-card-title class="text-h5">Profile</v-card-title>
        <v-card-text>
            <v-card-text>
                <v-icon class="mr-2">mdi-account</v-icon>
                <span>Name: {{ user.name }}</span>
            </v-card-text>
            <v-card-text>
                <v-icon class="mr-2">mdi-email</v-icon>
                <span>Email: {{ user.email }}</span>
            </v-card-text>
            <v-card-text>
                <v-icon class="mr-2">mdi-check-circle</v-icon>
                <span>Verified: {{ user.verified }}</span>
            </v-card-text>
            <v-card-text>
                <v-icon class="mr-2">mdi-account-box</v-icon>
                <span>Role: {{ user.role }}</span>
            </v-card-text>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useUserStore } from '@/store/user';


const user = useUserStore()
</script>
