<template>
    <v-container
        class="d-flex align-center justify-center"
        style="min-height: 100vh"
    >
        <v-card max-width="500" width="100%" class="pa-8">
            <v-card-title class="text-center mb-5"
                >Eyedroponics | Sign Up</v-card-title
            >

            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                        v-model="user.name"
                        label="Username"
                        prepend-inner-icon="mdi-account"
                        :rules="[rules.required, rules.min3]"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="user.email"
                        label="Email"
                        prepend-inner-icon="mdi-email"
                        :rules="[rules.required, rules.min3, rules.email]"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="password"
                        label="Password"
                        prepend-inner-icon="mdi-lock"
                        :rules="[rules.required, rules.min8]"
                        type="password"
                        required
                    ></v-text-field>

                    <router-link
                        :to="{ name: 'Sign In' }"
                        class="center text-center mb-4"
                    >
                        Already have an account? Sign In
                    </router-link>

                    <v-btn
                        :disabled="!valid || loading"
                        :loading="loading"
                        @click="submitSignUpForm"
                        color="primary"
                        block
                        class="pa-7 mt-5"
                    >
                        Sign Up
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import axios from "axios";
import rules from "@/utils/rules";
import notif from "@/utils/notif";
import layout from "@/utils/layout";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";

const user = useUserStore();
const router = useRouter();

const valid = ref(false);
const loading = ref(false);
const password = ref("");

// hide layouts
layout.showAppBar.value = false;
layout.showNavDrawer.value = false;

const submitSignUpForm = async () => {
    if (valid.value && !loading.value) {
        // send credentials
        const credentials = {
            name: user.name,
            email: user.email,
            password: password.value,
        };

        // on ok
        const onOk = (res) => {
            // sync store
            user.set(res.data.obj);

            // notify & redirect
            notif.add(res.data.txt ?? "Signed-Up", "success");
            router.push({ name: "Sign In" });
        };

        // send without tokens
        loading.value = true;
        await axios
            .post("http://localhost:4000/api/user/sign-up", credentials)
            .then(onOk)
            .catch((err) => notif.addError(err))
            .finally(() => (loading.value = false));
    }
};
</script>

<style scoped></style>
