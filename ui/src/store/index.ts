import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

//User login state vuex store
const store = new Vuex.Store({
  state: {
    user: {
      id: -1,
      username: "",
      email: "",
      nume: "",
      prenume: "",
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    }
  }
});

export default store;