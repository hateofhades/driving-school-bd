<template>
    <v-container>
        <v-row justify="center">
            <v-card width="900">
                <v-card-title>Elevii Mei</v-card-title>
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
                                            <v-col cols="3">
                                                <v-text-field readonly label="Adresa"
                                                    v-model="item.Adresa"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field readonly label="Sex"
                                                    v-model="item.Sex"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-btn class="mt-3" color="success" @click="showProgramari(item)"><v-icon class="mr-2">mdi-clipboard</v-icon>Programari</v-btn>
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
        <v-dialog v-model="showProgramariDialog">
            <v-card>
                <v-card-title>Urmatoarele programari a lui {{ selectedStudent.Nume + " " + selectedStudent.Prenume }}</v-card-title>
                <v-card-text>
                    <v-row v-for="programare in programari" v-bind:key="programare.NrInmatriculare">
                        <v-col cols="3">
                            <v-text-field readonly label="Data si ora"
                                v-model="programare.DataOra"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field readonly label="Marca"
                                v-model="programare.Marca"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field readonly label="Model"
                                v-model="programare.Model"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field readonly label="Nr. Inmatriculare"
                                v-model="programare.NrInmatriculare"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="showProgramariDialog = false">Inapoi</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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

interface IProgramare {
    Nume: string;
    Prenume: string;
    Adresa: string;
    Sex: string;
    DataOra: string;
    Marca: string;
    Model: string;
    NrInmatriculare: string;
}

export default Vue.extend({
    name: "StudentsAdmin",
    data() {
        const students: IStudent[] = [];
        const programari: IProgramare[] = [];
        const selectedStudent: IStudent = {
            Adresa: "",
            CNP: 0,
            DataNastere: "",
            IDCont: 0,
            IDElev: 0,
            IDInstructor: 0,
            Nume: "",
            Prenume: "",
            OreTotale: 0,
            Sex: "m"
        };

        return {
            name: "",
            students: students,
            showProgramariDialog: false,
            programari: programari,
            selectedStudent: selectedStudent
        }
    },
    methods: {
        goBack() {
            this.$router.push("/");
        },
        async getStudents() {
            const response = await axios.get("http://localhost:3000/instructor/" + this.$store.getters.getUser.IDCont + "/students");
            console.log(response.data.data);
            if (response.data.error === 0) {
                this.students = response.data.data;

                this.students.forEach((user: IStudent) => {
                    user.DataNastere = new Date(user.DataNastere).toLocaleDateString();
                    user.Sex = user.Sex === "m" ? "Masculin" : "Feminin";
                });
            }
        },
        async showProgramari(student: IStudent) {
            this.showProgramariDialog = true;
            this.selectedStudent = student;

            const response = await axios.get("http://localhost:3000/instructor/" + this.$store.getters.getUser.IDCont + "/student/" + student.IDElev + "/programari");
            console.log(response);

            if (response.data.error === 0) {
                this.programari = response.data.data;

                this.programari.forEach((programare: IProgramare) => {
                    programare.DataOra = new Date(programare.DataOra).toLocaleString();
                });

                console.log(this.programari);
            }
        }
    },
    mounted() {
        this.getStudents();
    }
});
</script>