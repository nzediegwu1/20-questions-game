import Vue from "vue";
import Vuex from "vuex";
import { makeRequest } from "./helpers";

import { notify, onboard } from "./helpers";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loading: false,
    onlineUsers: [],
    listenerSocket: "",
    inviteAccepted: false,
    receiverAccepted: false,
    isOver: false,
    endMessage: {},
    sidebarVisible: false,
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
    setEndMessage(state, payload) {
      state.endMessage = payload;
    },
    setIsOver(state, payload) {
      state.isOver = payload;
    },
    toggleSidebar(state, payload) {
      state.sidebarVisible = payload;
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
      const kwargs = {
        method: "get",
        path: "current-user",
        onSuccess: (data) => (state.user = data.data),
      };
      return makeRequest(kwargs);
    },
    async acceptInvite(_, payload) {
      const kwargs = {
        method: "post",
        path: "accept-invite",
        reqBody: payload,
        onSuccess: (data) => notify("success", data.message),
      };
      return makeRequest(kwargs);
    },
    async logoutBrowsers(_, payload) {
      const kwargs = {
        method: "post",
        path: "logout-browsers",
        reqBody: payload.form,
        onSuccess: (data) => notify("success", data.message),
      };
      makeRequest(kwargs);
      payload.shouldLogout = false;
    },
  },
});
