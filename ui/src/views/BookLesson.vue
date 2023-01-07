<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="10">
        <v-card>
          <v-card-title class="headline">{{ name }}, programeaza o noua lectie cu instructorul tau, {{
            numeInstructor
          }}</v-card-title>
          <v-card-text>
            <v-row class="ma-2">
              <v-form>
                <v-row justify="center">
                  <v-col cols="12">
                    <v-text-field v-model="dataInceput" label="Data" type="date"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="oraInceput" label="Ora de Inceput" type="time"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="locatie" label="Locatie" type="text"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <p v-if="selectedCar.IDAutovehicul !== -1">Masina Selectata: <b>{{
                      selectedCar.Marca + " " + selectedCar.Model + " ("
                        + selectedCar.NrInmatriculare
                    }})</b></p>
                    <v-dialog v-model="carChooseDialog" width="800">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" v-bind="attrs" v-on="on"><v-icon class="mr-2">mdi-car</v-icon>Selecteaza
                          autovehicul</v-btn>
                      </template>

                      <v-card>
                        <v-card-title>Selecteaza Autovehicul</v-card-title>
                        <v-card-text>
                          <v-col v-for="car in carsInstructor" :key="car.IDAutovehicul">
                            <v-card>
                              <v-card-title class="headline">{{ car.Marca }} {{ car.Model }}</v-card-title>
                              <v-card-text>
                                <v-row>
                                  <v-col>
                                    <p>Numar Inmatriculare: <b>{{ car.NrInmatriculare }}</b></p>
                                    <p>Serie Sasiu: <b>{{ car.Serie }}</b></p>
                                    <p>An Fabricatie: <b>{{ car.AnFabricatie }}</b></p>

                                    <v-btn class="mt-auto" color="primary"
                                      @click="selectCar(car); carChooseDialog = false">Selecteaza</v-btn>
                                  </v-col>
                                  <v-col>
                                    <v-img :src="car.Imagine" aspect-ratio="1.7"></v-img>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-col>
                </v-row>
              </v-form>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="bookLesson">Programeaza</v-btn>
            <v-btn color="primary" to="/">Inapoi</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Inchide
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface ICar {
  IDAutovehicul: number,
  AnFabricatie: number,
  Marca: string,
  Model: string,
  NrInmatriculare: string,
  Serie: string
  Imagine: string
}

export default Vue.extend({
  name: "BookLesson",
  data() {
    const carsInstructor: ICar[] = [];

    const selectedCar: ICar = {
      IDAutovehicul: -1,
      AnFabricatie: 0,
      Marca: "",
      Model: "",
      NrInmatriculare: "",
      Serie: "",
      Imagine: ""
    };

    return {
      numeInstructor: "",
      usernameInstructor: "",
      carsInstructor: carsInstructor,
      name: "",
      carChooseDialog: false,
      selectedCar: selectedCar,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "",
      timeout: 3000,
      locatie: "",
      oraInceput: "08:00",
      dataInceput: new Date().toISOString().substr(0, 10)
    }
  },
  methods: {
    createSnackbar(text: string, color: string) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    bookLesson() {
      console.log(this.dataInceput);

      if (this.selectedCar.IDAutovehicul === -1) {
        this.createSnackbar("Selecteaza un autovehicul!", "error");
        return;
      }

      if (this.locatie === "") {
        this.createSnackbar("Introdu locatia!", "error");
        return;
      }

      const data = {
        IDAutovehicul: this.selectedCar.IDAutovehicul,
        IDElev: this.$store.getters.getUser.IDCont,
        DataOra: this.dataInceput + " " + this.oraInceput + ":00.00",
        Locatie: this.locatie
      };

      axios.post("http://localhost:3000/bookLesson", data)
        .then(response => {
          if (response.data.error === 0) {
            this.createSnackbar("Programare creata cu success!", "success");

            setTimeout(() => {
              this.$router.push("/");
            }, 3000);
          } else {
            this.createSnackbar("A aparut o eroare!", "error");
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    async getInstructor() {
      try {
        const response = await axios.get("http://localhost:3000/infoInstructorElev/" + this.$store.getters.getUser.Username);

        if (response.data.error === 0) {
          console.log(response.data.data);

          this.numeInstructor = response.data.data.Nume + " " + response.data.data.Prenume;
          this.usernameInstructor = response.data.data.Username;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getInstructorCars() {
      try {
        const response = await axios.get("http://localhost:3000/instructorCars/" + this.usernameInstructor);

        if (response.data.error === 0) {
          console.log(response.data.data);

          this.carsInstructor = response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getUser() {
      try {
        const response = await axios.get("http://localhost:3000/infoElev/" + this.$store.getters.getUser.Username);

        if (response.data.error === 0) {
          console.log(response.data.data);

          this.name = response.data.data.Nume + " " + response.data.data.Prenume;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async selectCar(car: ICar) {
      this.selectedCar = car;
    }
  },
  async mounted() {
    await this.getUser();
    await this.getInstructor();
    await this.getInstructorCars();
  }
});
</script>
