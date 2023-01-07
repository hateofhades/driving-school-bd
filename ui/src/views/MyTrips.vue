<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="10">
        <v-card>
          <v-card-title class="headline">Foile Mele de Parcurs</v-card-title>
          <v-card-text>
            <v-row v-for="trip in trips" :key="trip.IDFoaie">
              <v-col cols="12">
                <v-card>
                  <v-card-title class="headline">Ora de Scoala pe {{ trip.Marca }} {{ trip.Model }}</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <p>Numar Inmatriculare: <b>{{ trip.NrInmatriculare }}</b></p>
                        <p>Parcurs: <b>{{ trip.KmParcursi }} KM</b></p>
                        <p>Data: <b>{{ trip.Data.substring(0, 10) }}</b></p>
                      </v-col>
                      <v-col>
                        <v-img :src="trip.Imagine" aspect-ratio="1.7" class="ma-2"></v-img>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
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

interface ITrip {
  AnFabricatie: number,
  Data: string,
  IDFoaie: number,
  Imagine: string,
  KmParcursi: number,
  Marca: string,
  Model: string,
  NrInmatriculare: string,
  Serie: string
}

export default Vue.extend({
  name: "MyTrips",
  data() {
    const lessons: ITrip[] = [];

    return {
      numeInstructor: "",
      usernameInstructor: "",
      name: "",
      snackbar: false,
      snackbarText: "",
      snackbarColor: "",
      timeout: 3000,
      trips: lessons
    }
  },
  methods: {
    createSnackbar(text: string, color: string) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
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
    async getMyTrips() {
      try {
        const response = await axios.get("http://localhost:3000/tripsElev/" + this.$store.getters.getUser.Username);

        if (response.data.error === 0) {
          console.log(response.data.data);

          this.trips = response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  async mounted() {
    await this.getUser();
    await this.getMyTrips();
  }
});
</script>
