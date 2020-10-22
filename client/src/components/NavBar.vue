<template>
  <b-navbar :sticky="true" toggleable="sm" type="dark">
    <Sidebar />
    <b-navbar-brand href="#"> 20 Questions game</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template #button-content>
            <b class="text-white">{{
              currentUser && currentUser.user.nickname
            }}</b>
          </template>
          <b-dropdown-item class="text-center" @click="logout" href="#">
            <i class="fa fa-sign-out"> Logout</i></b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
    <invite-modal
      :modalShow="modalShow"
      :sender="sender"
      :actions="{ toggleModal, acceptInvite }"
    />
  </b-navbar>
</template>

<script>
import { currentUser, notify, signOut } from "../helpers";
import { Sidebar, InviteModal } from "../components";

export default {
  data() {
    return {
      modalShow: false,
      sender: {},
    };
  },
  components: { Sidebar, InviteModal },
  computed: {
    currentUser() {
      const { user: me, onlineUsers } = this.$store.state;
      return currentUser(me, onlineUsers);
    },
  },
  methods: {
    logout() {
      return signOut(this);
    },
    toggleModal() {
      this.modalShow = !this.modalShow;
    },
    async acceptInvite() {
      const { onlineUsers } = this.$store.state;
      const sender = onlineUsers.find(
        (user) => user._id.toString() === this.sender._id.toString()
      );
      if (!sender || sender.status === "playing") {
        return notify("warning", "Sorry, invite has expired!");
      }
      await this.$store.dispatch("acceptInvite", { sender: sender._id });
      this.modalShow = !this.modalShow;
      this.$store.commit("setInviteAccepted", true);
      this.$store.commit("setReceiverAccepted", false);
      this.$store.commit("setListnerSocket", this.sender.socketId);
    },
  },
  sockets: {
    inviteToPlay(sender) {
      const { user: me, onlineUsers } = this.$store.state;
      const user = currentUser(me, onlineUsers);
      if (user.status === "online") {
        this.modalShow = true;
        this.sender = sender;
      }
    },
  },
};
</script>
