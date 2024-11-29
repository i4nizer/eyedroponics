<template>
    <v-container
        class="d-flex flex-column align-center justify-center"
        style="min-height: 100vh"
    >
        <v-card max-width="500" width="100%" class="pa-8">
            <v-card-title class="text-center mb-5"
                >Eyedroponics | Sign In</v-card-title
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
                        v-model="password"
                        label="Password"
                        prepend-inner-icon="mdi-lock"
                        :rules="[rules.required, rules.min8]"
                        type="password"
                        required
                    ></v-text-field>

                    <router-link
                        :to="{ name: 'Sign Up' }"
                        class="center text-center mb-4"
                    >
                        Create an account? Sign Up
                    </router-link>

                    <v-btn
                        :disabled="!valid || loading"
                        :loading="loading"
                        @click="submitSignInForm"
                        color="primary"
                        block
                        class="pa-7 mt-5"
                    >
                        Sign In
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
import { useTokenStore } from "@/store/token";

const user = useUserStore();
const token = useTokenStore();
const router = useRouter();

const valid = ref(false);
const loading = ref(false);
const password = ref("");

// hide layouts
layout.showAppBar.value = false;
layout.showNavDrawer.value = false;

const submitSignInForm = async () => {
    if (valid.value && !loading.value) {
        // send credentials
        const credentials = {
            name: user.name,
            password: password.value,
        };

        // onOk receives tokens
        const onOk = (res) => {
            // show ok
            notif.add(res.data.txt, "success");

            // save credentials to store
            user.set(res.data.obj);

            // save token to store
            token.set(res.data.obj.access, res.data.obj.refresh);
            token.startRotation();

            // redirect to home
            router.push({ name: "Dashboard" });
        };

        // authenticate
        loading.value = true;
        await axios
            .post("http://localhost:4000/api/user/sign-in", credentials)
            .then(onOk)
            .catch(notif.addError)
            .finally(() => (loading.value = false));
    }
};
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>
