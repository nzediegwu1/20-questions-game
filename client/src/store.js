import Vue from "vue";
import Vuex from "vuex";
import cookie from "js-cookie";
import jwt from "jsonwebtoken";

import { client, handleErrors, onboard } from "./helpers";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loading: false,
    onlineUsers: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setOnlineUsers(state, payload) {
      state.onlineUsers = payload;
    },
  },
  actions: {
    async signup(store, payload) {
      onboard(store, payload, "signup");
    },
    async login(store, payload) {
      onboard(store, payload, "login");
    },
    async getCurrentUser(store) {
      const token = cookie.get("token");
      if (!token) return;
      const { _id: userId } = jwt.decode(token);
      client
        .get(`/users/${userId}`)
        .then(({ data }) => {
          store.state.user = data.data;
        })
        .catch((error) => handleErrors(error));
    },
  },
});
