<template>
  <div>
    <Sidebar />
    <div
      v-if="receiverAccepted && currentUser.status === 'playing'"
      class="text-center"
    >
      Game dashboard for Inviter
    </div>
    <div
      v-else-if="inviteAccepted && currentUser.status === 'playing'"
      class="text-center"
    >
      Game dashboard for Invitee
    </div>
    <div class="text-center instructions" v-else>
      <h2>Game Instructions</h2>
      <p>
        <i class="fa fa-star"></i> Click <b> Play</b> button at the top left
        <b-button variant="success" size="sm"
          ><i class="fa fa-play"> Play</i></b-button
        >
      </p>
      <p><i class="fa fa-star"></i> Invite a player to play with you</p>
      <p><i class="fa fa-star"></i> Guess what the player thinks</p>
      <p>
        <i class="fa fa-star"></i> If you guess right? <b>You win!</b
        ><i class="fa fa-smile-o"></i>
      </p>
      <p>
        <i class="fa fa-star"></i> If you don't guess right after 20 attempts,
        <b>You Loose</b><i class="fa fa-frown-o"></i>
      </p>
      <h5>Game over!</h5>
    </div>
    <invite-modal
      :modalShow="modalShow"
      :sender="sender"
      :actions="{ toggleModal, acceptInvite }"
    />
  </div>
</template>

<script>
import cookie from "js-cookie";
import { Sidebar, InviteModal } from "../components";
import { currentUser, notify } from "../helpers";

export default {
  components: { Sidebar, InviteModal },
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
  },
};
</script>
