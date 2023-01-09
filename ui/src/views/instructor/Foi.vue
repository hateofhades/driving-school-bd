<template>
    <v-container>
        <v-card>
            <v-card-title>Foi de Parcurs</v-card-title>
            <v-card-text>
                <v-card v-for="foaie in foi" v-bind:key="foaie.IDFoaie" class="ma-4">
                    <v-card-title>{{ foaie.Nume }}</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="3">
                                <v-text-field readonly label="Data" v-model="foaie.Data"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field readonly label="Masina" v-model="foaie.Marca"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field readonly label="Nr Inmatriculare"
                                    v-model="foaie.NrInmatriculare"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field readonly label="Km Parcursi" v-model="foaie.KmParcursi"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="foaieParcursDialog = true"><v-icon
                        class="mr-2">mdi-clipboard</v-icon>Adauga</v-btn>
                <v-btn color="primary" @click="goBack">Inapoi</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="foaieParcursDialog">
            <v-card>
                <v-card-title>Adauga Foaie Parcurs</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-select :items="masini" item-text="Marca" return-object label="Masina" v-model="masinaSelect"></v-select>
                    </v-row>
                    <v-row>
                        <v-select :items="students" item-text="Nume" return-object label="Student" v-model="studentSelect"></v-select>
                    </v-row>
                    <v-row>
                        <v-text-field type="number" v-model="kmParcursi" label="Km Parcursi"></v-text-field>
                    </v-row>
                    <v-row>
                        <v-text-field type="date" v-model="datee" label="Data"></v-text-field>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="addFoaieParcurs"><v-icon class="mr-2">mdi-plus</v-icon>Adauga</v-btn>
                    <v-btn color="primary" @click="foaieParcursDialog = false">Inapoi</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import axios from 'axios';
import Vue from 'vue';

interface IFoaie {
    IDFoaie: number;
    Data: string;
    Imagine: string;
    KmParcursi: number;
    Marca: string;
    Model: string;
    NrInmatriculare: string;
    Nume: string;
    Prenume: string;
}

interface IMasina {
    IDAutovehicul: number;
    Marca: string;
    Model: string;
    NrInmatriculare: string;
    Imagine: string;
}

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
    name: "InstructorFoi",
    data() {
        const foi: IFoaie[] = [];
        const masini: IMasina[] = [];
        const studenti: IStudent[] = [];
        const masinaSelect: IMasina = {
            IDAutovehicul: 0,
            Marca: "",
            Model: "",
            NrInmatriculare: "",
            Imagine: ""
        };
        const studentSelect: IStudent = {
            Adresa: "",
            CNP: 0,
            DataNastere: "",
            IDCont: 0,
            IDElev: 0,
            IDInstructor: 0,
            Nume: "",
            Prenume: "",
            OreTotale: 0,
            Sex: "",
        };

        return {
            foi: foi,
            foaieParcursDialog: false,
            masini: masini,
            students: studenti,
            masinaSelect: masinaSelect,
            studentSelect: studentSelect,
            kmParcursi: 0,
            datee: ""
        }
    },
    methods: {
        goBack() {
            this.$router.push('/');
        },
        async getFoiParcurs() {
            try {
                const response = await axios.get("http://localhost:3000/foiParcurs/" + this.$store.getters.getUser.IDCont);
                console.log(response.data.data);

                if (response.data.error === 0) {
                    this.foi = response.data.data;

                    this.foi.forEach((foaie: IFoaie) => {
                        foaie.Data = foaie.Data.split("T")[0];
                        foaie.Marca = foaie.Marca + " " + foaie.Model;
                        foaie.Nume = foaie.Nume + " " + foaie.Prenume;
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
        async addFoaieParcurs() {
            if (this.masinaSelect.IDAutovehicul === 0 || this.studentSelect.IDElev === 0 || this.kmParcursi === 0 || this.datee === "") {
                alert("Completati toate campurile!");
                return;
            }

            const data = {
                IDElev: this.studentSelect.IDElev,
                IDAutovehicul: this.masinaSelect.IDAutovehicul,
                KmParcursi: this.kmParcursi,
                Data: this.datee
            };

            try {
                const response = await axios.post("http://localhost:3000/foiParcurs", data);
                console.log(response.data);

                if (response.data.error === 0) {
                    this.foaieParcursDialog = false;
                    this.getFoiParcurs();
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getMasini() {
            try {
                const response = await axios.get("http://localhost:3000/instructor/" + this.$store.getters.getUser.IDCont + "/vehicles");
                console.log(response.data.data);

                if (response.data.error === 0) {
                    this.masini = response.data.data;

                    this.masini.forEach((masina: IMasina) => {
                        masina.Marca = masina.Marca + " " + masina.Model + " - " + masina.NrInmatriculare;
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getElevi() {
            const response = await axios.get("http://localhost:3000/instructor/" + this.$store.getters.getUser.IDCont + "/students");
            console.log(response.data.data);
            if (response.data.error === 0) {
                this.students = response.data.data;

                this.students.forEach((user: IStudent) => {
                    user.Nume = user.Nume + " " + user.Prenume;
                });
            }
        }
    },
    mounted() {
        this.getFoiParcurs();
        this.getElevi();
        this.getMasini();
    }
});
</script>