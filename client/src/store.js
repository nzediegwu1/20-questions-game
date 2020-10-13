import Vue from "vue";
import Vuex from "vuex";
import { onboard } from "./helpers";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loading: false
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    async signup(store, payload) {
      onboard(store, payload, "signup");
    },
    async login(store, payload) {
      onboard(store, payload, "login");
    }
  }
});
