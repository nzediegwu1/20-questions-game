<template>
  <div>
    <b-button v-b-toggle.sidebar-variant variant="success">
      <i class="fa fa-play"> Play</i>
      <!-- <i class="fa fa-circle"></i> -->
    </b-button>
    <b-sidebar
      id="sidebar-variant"
      title="Online Players"
      bg-variant="dark"
      text-variant="light"
      shadow
    >
      <template slot="footer">
        <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
          <strong class="mr-auto"></strong>
          <b-button size="sm" @click="logout">
            <i class="fa fa-sign-out"></i>
          </b-button>
        </div>
      </template>
      <b-list-group class="online-users">
        <b-list-group-item :key="item._id" v-for="item of onlineUserList"
          ><img
            src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairNotTooLong&accessoriesType=Prescription01&hairColor=BrownDark&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
          />{{ item.user.nickname }}</b-list-group-item
        >
      </b-list-group>
    </b-sidebar>
  </div>
</template>

<script>
import cookie from "js-cookie";
import { notify } from "../helpers";

export default {
  methods: {
    logout() {
      this.$socket.emit("userLeft", this.$store.state.user);
      this.$router.push("/");
      notify("success", "Logout successful");
      cookie.remove("token");
    },
  },
  computed: {
    onlineUserList() {
      return this.$store.state.onlineUsers;
    },
  },
  sockets: {
    onlineUsers: function (users) {
      this.$store.commit("setOnlineUsers", users);
    },
    // customEmit: function (data) {
    //   console.log(
    //     'this method was fired by the socket server. eg: io.emit("customEmit", data)'
    //   );
    // },
  },
};
</script>
