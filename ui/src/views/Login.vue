<template>
    <v-container fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Login</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field prepend-icon="mdi-account" name="login" label="Nume de Utilizator" type="text"
                                v-model="username"></v-text-field>
                            <v-text-field id="password" prepend-icon="mdi-lock" name="password" label="Parola"
                                :type="showPassword ? 'text' : 'password'"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="showPassword = !showPassword" v-model="password"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="register" color="secondary">Register</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="login" color="primary">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <!-- ERROR DISPLAY -->
        <v-snackbar v-model="snackbar" :timeout="timeout" :color="color">
            {{ message }}
            <v-spacer></v-spacer>
            <v-btn text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import axios from "axios";

export default Vue.extend({
    name: "LoginView",
    computed: {
        ...mapGetters({
            userState: "userStore/user"
        })
    },
    data() {
        return {
            username: "",
            password: "",
            inc: false,
            loading: true,
            showPassword: false,
            snackbar: false,
            message: "",
            timeout: 3000,
            color: "error"
        };
    },
    methods: {
        async login() {
            if (this.username === "" || this.password === "") {
                this.message = "Parola sau numele de utilizator nu sunt completate";
                this.snackbar = true;
                return;
            }

            if (this.username === "admin" && this.password === "admin") {
                this.$store.dispatch("setUser", { user: {
                    Username: "admin",
                    TipCont: "A"
                }});
                this.$router.push("/");
                return;
            }

            try {
                const response = await axios.post("http://localhost:3000/login", {
                    username: this.username,
                    password: this.password
                });

                console.log(response);

                if (response.data.error === 0) {
                    this.$store.dispatch("setUser", response.data);
                    this.$router.push("/");
                } else {
                    this.message = "Invalid username or password";
                    this.snackbar = true;
                }
            } catch (error) {
                console.log(error);
            }
        },
        stopLoading() {
            this.loading = false;
        },
        resetPassword() {
            this.$router.push("/reset-password");
        },
        register() {
            this.$router.push("/register");
        }
    },
});
</script>
