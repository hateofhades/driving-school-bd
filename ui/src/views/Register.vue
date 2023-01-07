<template>
    <v-container fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Register</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="login"
                                label="Username"
                                type="text"
                                v-model="username"
                            ></v-text-field>
                            <v-text-field
                                id="password"
                                prepend-icon="mdi-lock"
                                name="password"
                                label="Password"
                                :type="showPassword ? 'text' : 'password'"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="showPassword = !showPassword"
                                v-model="password"
                            ></v-text-field>
                            <v-text-field
                                id="email"
                                prepend-icon="mdi-email"
                                name="email"
                                label="Email"
                                type="email"
                                v-model="email"
                            ></v-text-field>
                            <v-row>
                                <v-text-field
                                    id="name"
                                    prepend-icon="mdi-account"
                                    name="name"
                                    label="Nume"
                                    type="text"
                                    v-model="nume"
                                    class="ml-3 mr-2"
                                ></v-text-field>
                                <v-text-field
                                    id="prenume"
                                    name="prenume"
                                    label="Prenume"
                                    type="text"
                                    v-model="prenume"
                                    class="mr-3"
                                ></v-text-field>
                            </v-row>
                            <v-text-field
                                id="adresa"
                                prepend-icon="mdi-map-marker"
                                name="adresa"
                                label="Adresa"
                                type="text"
                                v-model="adresa"
                            ></v-text-field>
                            <v-text-field
                                id="cnp"
                                prepend-icon="mdi-numeric"
                                name="cnp"
                                label="CNP"
                                type="text"
                                v-model="cnp"
                            ></v-text-field>
                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="date"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date"
                                    label="Data de nastere"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="date"
                                no-title
                                scrollable
                                >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu.save(date)"
                                >
                                    OK
                                </v-btn>
                                </v-date-picker>
                            </v-menu>
                            <v-row justify="center">
                                <v-switch
                                    v-model="sex"
                                    prepend-icon="mdi-gender-male"
                                    append-icon="mdi-gender-female"
                                    class="ml-3"
                                ></v-switch>
                            </v-row>
                            <v-text-field
                                id="instructor"
                                prepend-icon="mdi-account-supervisor"
                                name="instructor"
                                label="Instructor"
                                type="text"
                                v-model="instructor"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="login" color="secondary">Login</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="register" color="primary">Register</v-btn>
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
	data () {
		return {
			username: "",
			password: "",
            email: "",
            nume: "",
            prenume: "",
            sex: false,
            date: "",
            cnp: "",
            adresa: "",
			inc: false,
			loading: true,
			showPassword: false,
            snackbar: false,
            message: "",
            timeout: 3000,
            color: "error",
            menu: false,
            instructor: 1
		};
	},
	methods: {
		async register () {
            const jsonBody = {
                username: this.username,
                password: this.password,
                email: this.email,
                nume: this.nume,
                prenume: this.prenume,
                sex: !this.sex ? "m" : "f",
                datanastere: this.date,
                cnp: this.cnp,
                adresa: this.adresa,
                idinstructor: this.instructor
            };

            console.log(jsonBody);

            try {
                const response = await axios.post("http://localhost:3000/register", jsonBody);

                console.log(response);

                if (response.data.error === 0) {
                    this.$router.push("/login");
                } else {
                    this.message = "An error occured";
                    this.snackbar = true;
                }
            } catch (error) {
                console.log(error);
            }
		},
		stopLoading () {
			this.loading = false;
		},
		resetPassword () {
			this.$router.push("/reset-password");
        },
        login () {
            this.$router.push("/login");
        }
    },
});
</script>
