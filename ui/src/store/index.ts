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
    },
    clearUser(state) {
      state.user = {
        id: -1,
        username: "",
        email: "",
        nume: "",
        prenume: "",
      };
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user.user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    clearUser({ commit }) {
      localStorage.removeItem("user");
      commit("clearUser");
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    }
  }
});

export default store;