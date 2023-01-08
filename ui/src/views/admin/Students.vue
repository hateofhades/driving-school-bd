<template>
    <v-container>
        <v-row justify="center">
            <v-card width="900">
                <v-card-title>Panou Administrare Elevi</v-card-title>
                <v-card-text>
                    <v-row class="mt-4">
                        <v-virtual-scroll height="650" item-height="120" :items="students">
                            <template v-slot:default="{ item }">
                                <v-card elevation="2" class="ma-4">
                                    <v-card-text>
                                        <v-row class="ml-2 mb--2">
                                            <v-col cols="2">
                                                <v-text-field readonly label="Nume"
                                                    v-model="item.Nume"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="Prenume"
                                                    v-model="item.Prenume"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="CNP"
                                                    v-model="item.CNP"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="Data Nastere"
                                                    v-model="item.DataNastere"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="Adresa"
                                                    v-model="item.Adresa"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="Sex"
                                                    v-model="item.Sex"></v-text-field>
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
                    <v-btn color="primary" @click="goBack">Inapoi</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface IStudent {
    Adresa: string;
    CNP: number;
    DataNastere: string;
    IDCont: number;
    IDElev: number;
    IDInstructor: number;
    Nume: string;
    Prenume: string;
    OreTotale: number;
    Sex: string;
}

export default Vue.extend({
    name: "StudentsAdmin",
    data() {
        const students: IStudent[] = [];

        return {
            name: "",
            students: students
        }
    },
    methods: {
        goBack() {
            this.$router.push("/");
        },
        async getStudents() {
            const response = await axios.get("http://localhost:3000/students");
            console.log(response.data.data);
            if (response.data.error === 0) {
                this.students = response.data.data;

                this.students.forEach((user: IStudent) => {
                    user.DataNastere = new Date(user.DataNastere).toLocaleDateString();
                    user.Sex = user.Sex === "m" ? "Masculin" : "Feminin";
                });
            }
        }
    },
    mounted() {
        this.getStudents();
    }
});
</script>