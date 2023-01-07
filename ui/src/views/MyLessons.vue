<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="10">
        <v-card>
          <v-card-title class="headline">Programarile Mele</v-card-title>
          <v-card-text>
            <v-row v-for="lesson in lessons" :key="lesson.IDProgramare">
              <v-col cols="12">
                <v-card>
                  <v-card-title class="headline">Programare pe {{ lesson.Marca }} {{ lesson.Model }}</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <p>Numar Inmatriculare: <b>{{ lesson.NrInmatriculare }}</b></p>
                        <p>Locatie: <b>{{ lesson.LocatieInceput }}</b></p>
                        <p>Data: <b>{{
                          lesson.DataOra.substring(0, 10) + " " + ((Number(lesson.DataOra.substring(11,
                            13)) + 2) < 10 ? "0" + ((Number(lesson.DataOra.substring(11, 13)) + 2)) :
                            (Number(lesson.DataOra.substring(11, 13)) + 2)) + ":" + lesson.DataOra.substring(14, 16)
                        }}</b>
                        </p>

                        <v-container v-if="new Date(lesson.DataOra).getDate() >= new Date().getDate()">
                          <v-dialog v-model="modifyBooking" width="800">
                            <template v-slot:activator="{ attrs, on }">
                              <v-btn color="primary" class="ma-2" v-bind="attrs" v-on="on" @click="modifyDate = lesson.DataOra.substring(0, 10);
                              modifyHour = ((Number(lesson.DataOra.substring(11, 13)) + 2) < 10 ? '0' + ((Number(lesson.DataOra.substring(11, 13)) + 2)) : (Number(lesson.DataOra.substring(11, 13)) + 2)) + ':' + lesson.DataOra.substring(14, 16);
                              modifyLocatie = lesson.LocatieInceput"><v-icon class="mr-2">mdi-calendar-edit</v-icon>
                                Modifica Programarea</v-btn>
                            </template>

                            <v-card>
                              <v-card-title class="headline">Modifica Programarea</v-card-title>
                              <v-card-text>
                                <v-row class="ma-2">
                                  <v-form>
                                    <v-row justify="center">
                                      <v-col cols="12">
                                        <v-text-field v-model="modifyDate" label="Data" type="date"></v-text-field>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-text-field v-model="modifyHour" label="Ora de Inceput"
                                          type="time"></v-text-field>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-text-field v-model="modifyLocatie" label="Locatie"
                                          type="text"></v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-form>
                                </v-row>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="modifyBooking = false">Inapoi</v-btn>
                                <v-btn color="success" @click="modifyLesson(lesson)">Modifica</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                          <v-btn color="error" class="ma-2" @click="removeBooking(lesson)"><v-icon
                              class="mr-2">mdi-calendar-remove</v-icon>Anuleaza Programarea</v-btn>
                        </v-container>
                      </v-col>
                      <v-col>
                        <v-img :src="lesson.Imagine" aspect-ratio="1.7" class="ma-2"></v-img>
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

interface ILesson {
  AnFabricatie: number,
  DataOra: string,
  IDProgramare: number,
  Imagine: string,
  LocatieInceput: string,
  Marca: string,
  Model: string,
  NrInmatriculare: string,
  Serie: string
}

export default Vue.extend({
  name: "MyLessons",
  data() {
    const lessons: ILesson[] = [];

    return {
      numeInstructor: "",
      usernameInstructor: "",
      name: "",
      snackbar: false,
      snackbarText: "",
      snackbarColor: "",
      timeout: 3000,
      lessons: lessons,
      modifyBooking: false,
      modifyDate: "",
      modifyHour: "",
      modifyLocatie: ""
    }
  },
  methods: {
    async modifyLesson(lesson: ILesson) {
      const data = {
        DataOra: this.modifyDate + " " + this.modifyHour,
        LocatieInceput: this.modifyLocatie,
        IDProgramare: lesson.IDProgramare
      };
      
      try {
        const response = await axios.put("http://localhost:3000/programare", data);

        if (response.data.error === 0) {
          this.createSnackbar("Programarea a fost modificata cu succes!", "success");
          this.modifyBooking = false;
          this.getMyLessons();
        } else {
          this.createSnackbar("A aparut o eroare!", "error");
        }
      } catch (error) {
        console.error(error);
      }
    },
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
    async getMyLessons() {
      try {
        const response = await axios.get("http://localhost:3000/programariElev/" + this.$store.getters.getUser.Username);

        if (response.data.error === 0) {
          console.log(response.data.data);

          this.lessons = response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async removeBooking(lesson: ILesson) {
      try {
        const response = await axios.delete("http://localhost:3000/programare/" + lesson.IDProgramare);

        if (response.data.error === 0) {
          this.createSnackbar("Programarea a fost anulata cu succes!", "success");
          window.location.reload();
        } else {
          this.createSnackbar("A aparut o eroare!", "error");
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  async mounted() {
    await this.getUser();
    await this.getMyLessons();
  }
});
</script>
