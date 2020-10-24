<template>
  <div>
    <b-button @click="toggleSidebar" class="menu-button" squared>
      <i class="fa fa-bars"></i>
    </b-button>
    <b-sidebar
      bg-variant="dark"
      text-variant="light"
      shadow
      :visible="sidebarVisible"
      no-header
    >
      <template #default>
        <div>
          <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
            <strong class="mr-auto">Online Players</strong>
            <b-button size="sm" @click="toggleSidebar">x</b-button>
          </div>
          <b-list-group class="online-users">
            <b-list-group-item :key="item._id" v-for="item of onlineUserList"
              ><img
                src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairNotTooLong&accessoriesType=Prescription01&hairColor=BrownDark&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
              />{{ item.user.nickname }}
              <b-button
                class="invite-button"
                size="sm"
                :disabled="
                  item.status === 'playing' || currentUser.status === 'playing'
                "
                @click="() => inviteUser(item._id)"
                >Invite</b-button
              >
            </b-list-group-item>
          </b-list-group>
        </div>
      </template>

      <template slot="footer">
        <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
          <strong class="mr-auto"></strong>
          <b-button size="sm" @click="logout">
            <i class="fa fa-sign-out"></i>
          </b-button>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import cookie from "js-cookie";
import { currentUser, notify, signOut, client } from "../helpers";

export default {
  methods: {
    logout() {
      signOut(this);
    },
    inviteUser(invitee) {
      this.$socket.client.emit("inviteUser", invitee);
      notify("info", "Game invite sent");
    },
    toggleSidebar() {
      const { sidebarVisible } = this.$store.state;
      this.$store.commit("toggleSidebar", !sidebarVisible);
    },
  },
  computed: {
    onlineUserList() {
      const { user, onlineUsers } = this.$store.state;
      return onlineUsers.filter((item) => item._id !== user._id);
    },
    currentUser() {
      const { user: me, onlineUsers } = this.$store.state;
      return currentUser(me, onlineUsers) || {};
    },
    sidebarVisible() {
      return this.$store.state.sidebarVisible;
    },
  },
  sockets: {
    onlineUsers: function (users) {
      this.$store.commit("setOnlineUsers", users);
    },
  },
  mounted() {
    if (!cookie.get("token")) return this.$router.push("/");
    client.defaults.headers = { token: cookie.get("token") };
    this.$socket.client.open();
    this.$store.dispatch("getCurrentUser");
  },
};
</script>
