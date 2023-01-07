<template>
  <div class="about">
    <h1>Salut {{ getUsername() }}!</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HomeView",
  methods: {
    getUsername() {
      console.log(this.$store.getters.getUser);
      return this.$store.getters.getUser.Username;
    }
  }
});
</script>
