import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import VueSocketIO from "vue-socket.io";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "font-awesome/css/font-awesome.min.css";
import "./css/main.css";
import "./css/toastr.css";

Vue.use(BootstrapVue);

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: process.env.VUE_APP_BASE_URL,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
