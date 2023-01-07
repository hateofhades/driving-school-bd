<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center" @click="goHome" style="cursor:pointer">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="/img/logo.png"
          transition="scale-transition"
          width="70"
        />
      </div>

      <v-spacer></v-spacer>
      <v-icon class="mr-4" v-if="isLoggedIn" @click="goToProfile">mdi-account</v-icon>
      <v-icon v-if="isLoggedIn" @click="logOut">mdi-logout</v-icon>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  data: () => ({
    //
  }),
  computed: {
    isLoggedIn() {
      // Return true if the user's ID is not -1, false otherwise
      return this.$store.state.user.id !== -1;
    }
  },
  created () {
    const user = localStorage.getItem("user");
    if (user) {
      // If the user's information exists in localStorage, set it in the store
      this.$store.dispatch("setUser", JSON.parse(user));
      this.$router.push("/");
    }
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    logOut() {
      this.$store.dispatch("clearUser");
      window.location.reload();
    }
  }
});
</script>
