import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import cookie from "js-cookie";

import { handleErrors, notify, onboard } from "./helpers";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loading: false,
    onlineUsers: [],
    listenerSocket: "",
    client: axios.create({
      baseURL: process.env.VUE_APP_BASE_URL,
      headers: {
        token: cookie.get("token"),
      },
    }),
    inviteAccepted: false,
    receiverAccepted: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setOnlineUsers(state, payload) {
      state.onlineUsers = payload;
    },
    setInviteAccepted(state, payload) {
      state.inviteAccepted = payload;
    },
    setListnerSocket(state, payload) {
      state.listenerSocket = payload;
    },
    setReceiverAccepted(state, payload) {
      state.receiverAccepted = payload;
    },
  },
  actions: {
    async signup(store, payload) {
      onboard(store, payload, "signup");
    },
    async login(store, payload) {
      onboard(store, payload, "login");
    },
    async getCurrentUser({ state }) {
      return state.client
        .get(`/currentUser`)
        .then(({ data }) => {
          state.user = data.data;
        })
        .catch((error) => handleErrors(error));
    },
    async acceptInvite({ state }, payload) {
      return state.client
        .post("/acceptInvite", payload)
        .then(({ data }) => {
          notify("success", data.message);
        })
        .catch((error) => handleErrors(error));
    },
  },
});
