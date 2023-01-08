<template>
    <v-container>
        <v-row justify="center">
            <v-card width="1200">
                <v-card-title>Panou Administrare Vehicule</v-card-title>
                <v-card-text>
                    <v-row class="mt-4">
                        <v-virtual-scroll height="650" item-height="250" :items="vehicles">
                            <template v-slot:default="{ item }">
                                <v-card class="ma-4">
                                    <v-card-title>{{ item.Marca + " " + item.Model }}</v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="4">
                                                <p><b>Marca:</b> {{ item.Marca }}</p>
                                                <p><b>Model:</b> {{ item.Model }}</p>
                                                <p><b>An Fabricatie:</b> {{ item.AnFabricatie }}</p>
                                                <p><b>Numar Inmatriculare:</b> {{ item.NrInmatriculare }}</p>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-img :src="item.Imagine" aspect-ratio="1.7" height="100"
                                                    class="ma-2"></v-img>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-btn color="error" @click="deleteCar(item)"><v-icon
                                                        class="mr-2">mdi-delete</v-icon>Sterge</v-btn>
                                                <v-btn colors="primary" class="mt-4"
                                                    @click="viewInstructors(item)"><v-icon
                                                        class="mr-2">mdi-account-multiple</v-icon>Instructorii</v-btn>
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
                    <v-btn color="success" @click="addCarDialog = true"><v-icon class="mr-2">mdi-car</v-icon>Adauga
                        Masina</v-btn>
                    <v-btn color="primary" @click="goBack">Inapoi</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
        <v-dialog v-model="viewInstructorsDialog">
            <v-card>
                <v-card-title>Instructorii Cu Access</v-card-title>
                <v-card-text>
                    <v-row justify="center">
                        <v-select label="Adauga Instructori" :items="filteredInstructors" return-object item-text="Nume" multiple v-model="selectedInstructors"></v-select>
                    </v-row>
                    <v-row v-for="instructor in carInstructors" v-bind:key="instructor.IDInstructor">
                        <v-col cols="4">
                            <v-text-field label="Nume" :value="instructor.Nume" readonly></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field label="Prenume" :value="instructor.Prenume" readonly></v-text-field>
                        </v-col>
                        <v-col cols="4" justify="center" align="center">
                            <v-btn class="mt-4" color="error" @click="deleteInstructor(instructor)"><v-icon
                                    class="mr-2">mdi-delete</v-icon>Sterge</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="viewInstructorsDialog = false">Inapoi</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addCarDialog">
            <v-card>
                <v-card-title>Adauga Masina Noua</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field label="Marca" v-model="marca"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field label="Model" v-model="model"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field label="An Fabricatie" v-model="anFabricatie"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field label="Numar Inmatriculare" v-model="nrInmatriculare"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field label="Serie" v-model="serie"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field label="Categorie" v-model="categorie"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4"></v-col>
                        <v-col cols="4">
                            <v-text-field label="Imagine" v-model="imagine"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="addCarDialog = false">Inapoi</v-btn>
                    <v-btn color="success" @click="addCar">Adauga</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface IVehicle {
    AnFabricatie: number;
    Categorie: string;
    IDAutovehicul: number;
    Imagine: string;
    Marca: string;
    Model: string;
    NrInmatriculare: string;
    Serie: string;
}

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
    name: "VehiclesAdmin",
    data() {
        const vehicles: IVehicle[] = [];
        const instructors: IInstructor[] = [];
        const carInstructors: IInstructor[] = [];
        const filteredInstructors: IInstructor[] = [];
        const selectedInstructors: IInstructor[] = [];
        const selectedCar: IVehicle = {
            AnFabricatie: 0,
            Categorie: "",
            IDAutovehicul: 0,
            Imagine: "",
            Marca: "",
            Model: "",
            NrInmatriculare: "",
            Serie: ""
        };

        return {
            name: "",
            vehicles: vehicles,
            viewInstructorsDialog: false,
            instructors: instructors,
            carInstructors: carInstructors,
            selectedCar: selectedCar,
            filteredInstructors: filteredInstructors,
            selectedInstructors: selectedInstructors,
            addCarDialog: false,
            marca: "",
            model: "",
            anFabricatie: 0,
            nrInmatriculare: "",
            serie: "",
            categorie: "",
            imagine: ""
        }
    },
    methods: {
        goBack() {
            this.$router.push("/");
        },
        async getVehicles() {
            const response = await axios.get("http://localhost:3000/vehicles");
            console.log(response.data.data);
            if (response.data.error === 0) {
                this.vehicles = response.data.data;
            }
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
        async deleteInstructor(instructor: IInstructor) {
            const response = await axios.delete("http://localhost:3000/vehicle/" + this.selectedCar.IDAutovehicul + "/instructor/" + instructor.IDInstructor);
            console.log(response.data);

            if (response.data.error === 0) {
                this.viewInstructors(this.selectedCar);
            }
        },
        async viewInstructors(vehicle: IVehicle) {
            this.viewInstructorsDialog = true;
            this.selectedCar = vehicle;

            const response = await axios.get("http://localhost:3000/vehicleInstructors/" + vehicle.IDAutovehicul);
            console.log(response.data.data);

            if (response.data.error === 0) {
                this.carInstructors = response.data.data;

                const instructorsIDs: number[] = [];

                this.carInstructors.forEach((instructor: IInstructor) => {
                    instructorsIDs.push(instructor.IDInstructor);
                });

                this.filteredInstructors = this.instructors.filter((instructor: IInstructor) => {
                    return !instructorsIDs.includes(instructor.IDInstructor);
                });
            }
        },
        async deleteCar(car: IVehicle) {
            const response = await axios.delete("http://localhost:3000/vehicle/" + car.IDAutovehicul);
            console.log(response.data);

            if (response.data.error === 0) {
                this.getVehicles();
            }
        },
        async addCar() {
            const response = await axios.post("http://localhost:3000/vehicle", {
                marca: this.marca,
                model: this.model,
                anFabricatie: this.anFabricatie,
                nrInmatriculare: this.nrInmatriculare,
                serie: this.serie,
                categorie: this.categorie,
                imagine: this.imagine
            });
            console.log(response.data);

            if (response.data.error === 0) {
                this.getVehicles();
                this.addCarDialog = false;
            }
        }
    },
    mounted() {
        this.getVehicles();
        this.getInstructors();
    },
    watch: {
        selectedInstructors() {
            this.selectedInstructors.forEach(async (instructor: IInstructor) => {
                await axios.get("http://localhost:3000/vehicle/" + this.selectedCar.IDAutovehicul + "/instructor/" + instructor.IDInstructor);

                this.viewInstructors(this.selectedCar);
                this.selectedInstructors = [];
            });
        }
    }
});
</script>