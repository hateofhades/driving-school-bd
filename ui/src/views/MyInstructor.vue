<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="10">
        <v-card>
          <v-card-title class="headline">Instructorul Meu, {{ numeInstructor }}</v-card-title>
          <v-card-text>
            <v-row class="ma-2">
              <h2>Masinile Instructorului</h2>
            </v-row>
            <v-row class="ma-2">
              <v-col v-for="car in carsInstructor" :key="car.IDAutovehicul">
                <v-card>
                  <v-card-title class="headline">{{ car.Marca }} {{ car.Model }}</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <p>Numar Inmatriculare: <b>{{ car.NrInmatriculare }}</b></p>
                        <p>Serie Sasiu: <b>{{ car.Serie }}</b></p>
                        <p>An Fabricatie: <b>{{ car.AnFabricatie }}</b></p>
                      </v-col>
                      <v-col>
                        <v-img :src="car.Imagine" aspect-ratio="1.7"></v-img>
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
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "MyInstructor",
  data() {
    const carsInstructor: {
      IDAutovehicul: number,
      AnFabricatie: number,
      Marca: string,
      Model: string,
      NrInmatriculare: string,
      Serie: string
      Imagine: string
    }[] = [];

    return {
      numeInstructor: "",
      usernameInstructor: "",
      carsInstructor: carsInstructor
    }
  },
  methods: {
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
    }
  },
  async mounted() {
    await this.getInstructor();
    await this.getInstructorCars();
  }
});
</script>
