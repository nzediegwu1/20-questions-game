import Vue from 'vue';
import Vuex from 'vuex';

import { client, handleErrors, notify, onboard } from './helpers';

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
      onboard(store, payload, 'signup');
    },
    async login(store, payload) {
      onboard(store, payload, 'login');
    },
    async getCurrentUser(store) {
      return client
        .get(`/currentUser`)
        .then(({ data }) => {
          store.state.user = data.data;
        })
        .catch((error) => handleErrors(error));
    },
    async acceptInvite(_, payload) {
      return client
        .post('/acceptInvite', payload)
        .then(({ data }) => {
          notify('success', data.message);
        })
        .catch((error) => handleErrors(error));
    },
  },
});
