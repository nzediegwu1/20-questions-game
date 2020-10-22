<template>
  <div>
    <b-button class="menu-button" squared v-b-toggle.sidebar-variant>
      <i class="fa fa-bars"></i>
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
    </b-sidebar>
  </div>
</template>

<script>
import { currentUser, notify, signOut } from "../helpers";

export default {
  methods: {
    logout() {
      signOut(this);
    },
    inviteUser(invitee) {
      this.$socket.emit("inviteUser", invitee);
      notify("info", "Game invite sent");
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
  },
  sockets: {
    onlineUsers: function (users) {
      this.$store.commit("setOnlineUsers", users);
    },
  },
  mounted() {
    this.$store.dispatch("getCurrentUser");
  },
};
</script>
