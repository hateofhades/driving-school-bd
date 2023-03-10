<template>
    <v-container>
        <v-row class="mt-4">
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        <h3>Schimba parola</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" class="pb-2">
                            <v-text-field v-model="oldPassword" label="Parola Veche" type="password"
                                aria-required="true"></v-text-field>
                            <v-text-field v-model="newPassword" label="Parola Noua" type="password"
                                aria-required="true"></v-text-field>
                            <v-text-field v-model="confirmPassword" label="Confirma Parola Noua" type="password"
                                aria-required="true"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="changePassword" :disabled="!valid">Salveaza</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        <h3>Profil</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item>
                                <v-list-item-title>Nume de Utilizator: {{ username }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>Email: {{ email }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>Nume: {{ name }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>Adresa: {{ adresa }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>Data Nastere: {{ nastere }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>CNP: {{ CNP }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>Sex: {{ sex? "Masculin": "Feminin" }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title v-if="$store.getters.getUser.TipCont === 'U'">Instructor: {{ numeInstructor }}</v-list-item-title>
                                <v-list-item-title v-else>Salariu: {{ salariu }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="showWarning = true">Sterge Contul</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="showWarning" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Atentie!</v-card-title>
                <v-card-text>Sunteti pe cale sa va stergeti contul. Actiunea nu poate fi anulata.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="showWarning = false">Anuleaza</v-btn>
                    <v-btn color="error" text @click="deleteAccount">Confirma</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="showError" :timeout="3000">
            {{ errorMessage }}
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
    name: "ProfilePage",
    data() {
        return {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            valid: false,
            showError: false,
            errorMessage: "",
            showWarning: false,
            username: "",
            name: "",
            email: "",
            CNP: 0,
            nastere: "",
            adresa: "",
            sex: true,
            numeInstructor: "",
            salariu: 0
        };
    },
    methods: {
        async changePassword() {
            if (this.oldPassword === "" || this.newPassword === "" || this.confirmPassword === "") {
                this.showError = true;
                this.errorMessage = "Please fill in all fields";
                return;
            }

            try {
                const response = await axios.post("http://localhost:3000/changePassword", {
                    username: this.$store.getters.getUser.Username,
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword,
                });
                console.log(response);
                if (response.data.error === 0) {
                    this.$store.dispatch("clearUser");
                    window.location.reload();
                } else {
                    this.showError = true;
                    this.errorMessage = "Invalid password";
                }
            } catch (error) {
                console.error(error);
            }
        },
        async deleteAccount() {
            try {
                const response = await axios.post("http://localhost:3000/deleteAccount", {
                    username: this.$store.getters.getUser.Username,
                    password: this.$store.getters.getUser.Parola
                });
                if (response.data.error === 0) {
                    this.$store.dispatch("clearUser");
                    window.location.reload();
                } else {
                    this.showError = true;
                    this.errorMessage = "Invalid password";
                }
            } catch (error) {
                console.error(error);
            }
        },
        getUser() {
            if (this.$store.getters.getUser.TipCont === 'U')
                this.getElevProfile();
            else this.getInstructorProfile();
        },
        async getElevProfile() {
            try {
                const response = await axios.get("http://localhost:3000/infoElev/" + this.$store.getters.getUser.Username);

                if (response.data.error === 0) {
                    console.log(response.data.data);

                    this.name = response.data.data.Nume + " " + response.data.data.Prenume;
                    this.CNP = response.data.data.CNP;
                    this.adresa = response.data.data.Adresa;
                    this.nastere = response.data.data.DataNastere.substring(0, 10);
                    this.sex = response.data.data.Sex === "m";
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getInstructorProfile() {
            try {
                const response = await axios.get("http://localhost:3000/infoInstructor/" + this.$store.getters.getUser.Username);

                if (response.data.error === 0) {
                    console.log(response.data.data);

                    this.name = response.data.data.Nume + " " + response.data.data.Prenume;
                    this.CNP = response.data.data.CNP;
                    this.adresa = response.data.data.Adresa;
                    this.nastere = response.data.data.DataNastere.substring(0, 10);
                    this.sex = response.data.data.Sex === "m";
                    this.salariu = response.data.data.Salariu;
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getInstructor() {
            try {
                const response = await axios.get("http://localhost:3000/infoInstructorElev/" + this.$store.getters.getUser.Username);

                if (response.data.error === 0) {
                    console.log(response.data.data);

                    this.numeInstructor = response.data.data.Nume + " " + response.data.data.Prenume;
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    created() {
        this.username = this.$store.getters.getUser.Username;
        this.email = this.$store.getters.getUser.Email;
    },
    mounted() {
        this.getUser();
        this.getInstructor();
    }
});
</script>
                
