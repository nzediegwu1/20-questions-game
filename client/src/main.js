import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "font-awesome/css/font-awesome.min.css";
import "./css/main.css";
import "./css/toastr.css";

Vue.use(BootstrapVue);

const ioInstance = io(process.env.VUE_APP_BASE_URL, {
  reconnection: true,
  reconnectionDelay: 500,
  maxReconnectionAttempts: Infinity,
  autoConnect: false,
});
Vue.use(VueSocketIOExt, ioInstance, {
  store,
  actionPrefix: "SOCKET_",
  eventToActionTransformer: (actionName) => actionName,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
