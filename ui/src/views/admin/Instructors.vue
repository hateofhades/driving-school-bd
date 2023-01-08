<template>
    <v-container>
        <v-row justify="center">
            <v-card width="1200">
                <v-card-title>Panou Administrare Instructori</v-card-title>
                <v-card-text>
                    <v-row class="mt-4">
                        <v-virtual-scroll height="650" item-height="120" :items="instructors">
                            <template v-slot:default="{ item }">
                                <v-card elevation="2" class="ma-4">
                                    <v-card-text>
                                        <v-row class="ml-2 mb--2">
                                            <v-col cols="1">
                                                <v-text-field readonly label="Nume" v-model="item.Nume"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="Prenume"
                                                    v-model="item.Prenume"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="CNP" v-model="item.CNP"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="Data Nastere"
                                                    v-model="item.DataNastere"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="Adresa"
                                                    v-model="item.Adresa"></v-text-field>
                                            </v-col>
                                            <v-col cols="1">
                                                <v-text-field readonly label="Sex" v-model="item.Sex"></v-text-field>
                                            </v-col>
                                            <v-col cols="1">
                                                <v-text-field readonly label="Salariu"
                                                    v-model="item.Salariu"></v-text-field>
                                            </v-col>
                                            <v-col cols="1" justify="center" align="center">
                                                <v-icon color="error" @click="deleteInstructor(item)" style="cursor:pointer" class="mt-4">mdi-delete</v-icon>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </template>
                        </v-virtual-scroll>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="addInstructor = true">Adauga Instructor</v-btn>
                    <v-btn color="primary" @click="goBack">Inapoi</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
        <v-dialog v-model="addInstructor">
            <v-card>
                <v-card-title>Adauga Instructor</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field label="Username" v-model="username"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field label="Password" :type="showPassword ? 'text' : 'password'" v-model="password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="showPassword = !showPassword"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field label="Email" v-model="email"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field label="Nume" v-model="nume"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Prenume" v-model="prenume"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field label="CNP" type="number" v-model="cnp"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Data Nastere" type="date" v-model="dataNastere"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field label="Adresa" v-model="adresa"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Salariu" type="number" v-model="salariu"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-switch v-model="sex" prepend-icon="mdi-gender-male" append-icon="mdi-gender-female"
                            class="ml-3"></v-switch>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="addInstructorF()">Adauga</v-btn>
                    <v-btn color="primary" @click="addInstructor = false">Inapoi</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface IInstructor {
    Adresa: string;
    CNP: number;
    DataNastere: string;
    IDCont: number;
    IDInstructor: number;
    Nume: string;
    Prenume: string;
    Salariu: number;
    Sex: string;
}

export default Vue.extend({
    name: "InstructorsAdmin",
    data() {
        const instructors: IInstructor[] = [];

        return {
            name: "",
            instructors: instructors,
            addInstructor: false,
            username: "",
            password: "",
            email: "",
            nume: "",
            prenume: "",
            cnp: 0,
            dataNastere: "",
            adresa: "",
            salariu: 0,
            sex: false,
            showPassword: false
        }
    },
    methods: {
        goBack() {
            this.$router.push("/");
        },
        async getInstructors() {
            const response = await axios.get("http://localhost:3000/instructors");
            console.log(response.data.instructors);
            if (response.data.error === 0) {
                this.instructors = response.data.instructors;

                this.instructors.forEach((user: IInstructor) => {
                    user.DataNastere = new Date(user.DataNastere).toLocaleDateString();
                    user.Sex = user.Sex === "m" ? "Masculin" : "Feminin";
                });
            }
        },
        async addInstructorF() {
            if (this.username === "" || this.password === "" || this.email === "" || this.nume === "" || this.prenume === "" || this.cnp === 0 || this.dataNastere === "" || this.adresa === "" || this.salariu === 0) {
                alert("Completati toate campurile!");
                return;
            }

            const data = {
                username: this.username,
                password: this.password,
                email: this.email,
                nume: this.nume,
                prenume: this.prenume,
                sex: !this.sex ? "m" : "f",
                datanastere: this.dataNastere,
                cnp: this.cnp,
                adresa: this.adresa,
                salariu: this.salariu
            };

            console.log(data);

            try {
                const response = await axios.post("http://localhost:3000/addInstructor", data);

                console.log(response);

                if (response.data.error === 0) {
                    this.getInstructors();
                } else {
                    alert("Eroare la adaugare!");
                }
            } catch (error) {
                console.log(error);
            }

            this.addInstructor = false;
        },
        async deleteInstructor(instructor: IInstructor) {
            try {
                const response = await axios.delete("http://localhost:3000/user/" + instructor.IDCont);

                console.log(response);

                if (response.data.error === 0) {
                    this.getInstructors();
                } else {
                    alert("Eroare la stergere!");
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.getInstructors();
    }
});
</script>