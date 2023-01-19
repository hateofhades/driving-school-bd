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
              <v-col>
                <v-btn color="primary" to="/admin/vehicles"><v-icon class="mr-2">mdi-car</v-icon>
                  Autovehicule</v-btn>
              </v-col>
              <v-col></v-col>
              <v-col>
                <v-btn color="primary" @click="showStatistics"><v-icon class="mr-2">mdi-google-spreadsheet</v-icon>
                  Statistici</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" v-if="$store.getters.getUser.TipCont === 'I'">
      <v-col cols="10">
        <v-card>
          <v-card-title>Bine ai venit, {{ name }}!</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-btn color="primary" to="/myStudents"><v-icon class="mr-2">mdi-account-multiple-outline</v-icon>
                  Elevii mei</v-btn>
              </v-col>
              <v-col>
                <v-btn color="primary" to="/myFoi"><v-icon class="mr-2">mdi-clipboard</v-icon>Foi de parcurs</v-btn>
              </v-col>
              <v-col>
                <v-btn color="primary" to="/profile"><v-icon class="mr-2">mdi-account</v-icon>Profilul meu</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showStatisticsDialog">
      <v-card>
        <v-card-title>Statistici</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field type="number" v-model="salariu" label="Salariu"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field type="number" v-model="masini" label="Masini"></v-text-field>
            </v-col>
          </v-row>
          <v-row v-for="statistica in statistics" v-bind:key="statistica.IDCont">
            <v-col cols="4">
              <v-text-field readonly v-model="statistica.Nume" label="Nume"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field readonly v-model="statistica.Salariu" label="Salariu"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field readonly v-model="statistica.OreEfectuate" label="Ore Efectuate"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showStatisticsDialog = false">Inchide</v-btn>
        </v-card-actions>
      </v-card>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field type="number" v-model="km" label="KM"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field type="number" v-model="caunt" label="Count"></v-text-field>
            </v-col>
          </v-row>
          <v-row v-for="statisticsCar in statisticsCars" v-bind:key="statisticsCar.NrInmatriculare">
            <v-col cols="12">
              <v-text-field readonly v-model="statisticsCar.NrInmatriculare" label="Nr Inmatriculare"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface IStatistics {
  IDCont: number;
  Nume: string;
  Prenume: string;
  Salariu: number;
  OreEfectuate: number;
}

interface IStatisticsCar {
  NrInmatriculare: string;
}

export default Vue.extend({
  name: "HomeView",
  data() {
    const statistici: IStatistics[] = [];
    const statisticsCars: IStatisticsCar[] = [];

    return {
      name: "",
      showStatisticsDialog: false,
      salariu: 3000,
      masini: 2,
      statistics: statistici,
      statisticsCars: statisticsCars,
      km: 10,
      caunt: 2
    }
  },
  methods: {
    getUser() {
      if (this.$store.getters.getUser.TipCont === 'U')
        this.getInfoElev();
      else if (this.$store.getters.getUser.TipCont === 'I')
        this.getInfoInstructor();
    },
    async getInfoElev() {
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
    async getInfoInstructor() {
      try {
        const response = await axios.get("http://localhost:3000/infoInstructor/" + this.$store.getters.getUser.Username);

        if (response.data.error === 0) {
          console.log(response.data.data);

          this.name = response.data.data.Nume + " " + response.data.data.Prenume;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async showStatistics() {
      this.showStatisticsDialog = true;

      try {
        const response = await axios.get("http://localhost:3000/salariu/" + this.salariu + "/masini/" + this.masini);
        console.log(response.data.data);

        if (response.data.error === 0) {
          this.statistics = response.data.data;

          this.statistics.forEach((statistica: IStatistics) => {
            statistica.Nume = statistica.Nume + " " + statistica.Prenume;
          });
        }
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await axios.get("http://localhost:3000/foiTraseuComplex/" + this.km + "/" + this.caunt);
        console.log(response.data.data);
        
        if (response.data.error === 0) {
          this.statisticsCars = response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.getUser();
  },
  watch: {
    salariu () {
      this.showStatistics();
    },
    masini () {
      this.showStatistics();
    },
    km () {
      this.showStatistics();
    },
    caunt () {
      this.showStatistics();
    }
  }
});
</script>
