<template>
  <v-container>
    <v-row justify="center" align="center" v-if="$store.getters.getUser.TipCont === 'U'">
      <v-col cols="10">
        <v-card>
          <v-card-title class="headline">Bine ai venit, {{ name }}! Pregatit pentru o noua lectie?</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-btn color="primary" to="/myInstructor"><v-icon class="mr-2">mdi-account-supervisor</v-icon>
                  Instructorul meu</v-btn>
              </v-col>
              <v-col>
                <v-btn color="primary" to="/myTrips"><v-icon class="mr-2">mdi-clipboard-text-clock</v-icon> Istoric Ore
                  Condus</v-btn>
              </v-col>
              <v-col>
                <v-btn color="primary" to="/bookLesson"><v-icon class="mr-2">mdi-calendar-plus</v-icon> Programeaza Ora
                  de Condus</v-btn>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col>
                <v-btn color="primary" to="/myLessons"><v-icon class="mr-2">mdi-calendar</v-icon> Programarile
                  Mele</v-btn>
              </v-col>
              <v-col></v-col>
              <v-col>
                <v-btn color="primary" to="/profile"><v-icon class="mr-2">mdi-account</v-icon> Profilul meu</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" v-if="$store.getters.getUser.TipCont === 'A'">
      <v-col cols="10">
        <v-card>
          <v-card-title>Panou Administrator</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-btn color="primary" to="/admin/users"><v-icon class="mr-2">mdi-account-multiple</v-icon>
                  Utilizatori</v-btn>
              </v-col>
              <v-col>
                <v-btn color="primary" to="/admin/instructors"><v-icon class="mr-2">mdi-account-supervisor</v-icon>
                  Instructori</v-btn>
              </v-col>
              <v-col>
                <v-btn color="primary" to="/admin/students"><v-icon class="mr-2">mdi-account-multiple-outline</v-icon>
                  Elevi</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col></v-col>
              <v-col>
                <v-btn color="primary" to="/admin/vehicles"><v-icon class="mr-2">mdi-car</v-icon>
                  Autovehicule</v-btn>
              </v-col>
              <v-col></v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "HomeView",
  data() {
    return {
      name: "",
    }
  },
  methods: {
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
    }
  },
  mounted() {
    this.getUser();
  }
});
</script>
