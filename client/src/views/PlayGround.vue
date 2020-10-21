<template>
  <div>
    <b-navbar toggleable="sm" type="dark">
      <Sidebar />
      <b-navbar-brand href="#"> 20 Questions game</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <b class="text-white">{{ currentUser.user.nickname }}</b>
            </template>
            <b-dropdown-item class="text-center" @click="logout" href="#">
              <i class="fa fa-sign-out"> Logout</i></b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div
      v-if="receiverAccepted && currentUser.status === 'playing'"
      class="text-center"
    >
      Game dashboard for Inviter
    </div>
    <b-container
      v-else-if="inviteAccepted && currentUser.status === 'playing'"
      class="text-center"
    >
      Game dashboard for Invitee
      <b-row class="text-center">
        <b-col
          ><b-card header="Think of a word" header-tag="header">
            <b-form class="login-form">
              <b-form-group description="Your Listener Will Guess Your Word">
                <b-input-group class="mb-2">
                  <b-input-group-prepend>
                    <div class="form-icon"><i class="fa fa-envelope"></i></div>
                  </b-input-group-prepend>
                  <b-form-input
                    type="text"
                    required
                    placeholder="Enter your word"
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
              <b-button class="submit-signup" type="submit" variant="primary"
                >Save</b-button
              >
            </b-form>
          </b-card>
        </b-col>
        <b-col cols="8">2 of 3 (wider)</b-col>
      </b-row>
    </b-container>
    <Instructions v-else />
    <invite-modal
      :modalShow="modalShow"
      :sender="sender"
      :actions="{ toggleModal, acceptInvite }"
    />
  </div>
</template>

<script>
import cookie from "js-cookie";
import { Sidebar, InviteModal, Instructions } from "../components";
import { currentUser, notify, signOut } from "../helpers";

export default {
  components: { Sidebar, InviteModal, Instructions },
  data() {
    return {
      inviteAccepted: false,
      receiverAccepted: false,
      modalShow: false,
      sender: {},
      listenerSocket: "",
    };
  },
  mounted() {
    if (!cookie.get("token")) return this.$router.push("/");
  },
  computed: {
    currentUser() {
      const { user: me, onlineUsers } = this.$store.state;
      return currentUser(me, onlineUsers);
    },
  },
  methods: {
    toggleModal() {
      this.modalShow = !this.modalShow;
    },
    logout() {
      return signOut(this);
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
      this.inviteAccepted = true;
      // set state to display game dashboard
      //
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
    receiverAccepted(status) {
      this.receiverAccepted = status;
    },
    playerLeft(leftPlayer) {
      const { user } = this.$store.state;
      console.log("me=====", user);
      console.log("leftPlayer=====", leftPlayer);
      if (user._id == leftPlayer._id) this.$router.push("/");
    },
  },
};
</script>
