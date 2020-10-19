<template>
  <div>
    <Sidebar />
    <p v-if="inviteMessage" class="text-center">
      {{ inviteMessage }}
    </p>
    <p class="text-center" v-else>
      This is an amazing playground specially made for you
    </p>
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
import { notify } from "../helpers";

export default {
  components: { Sidebar, InviteModal },
  data() {
    return {
      inviteMessage: "",
      modalShow: false,
      sender: {},
    };
  },
  mounted() {
    if (!cookie.get("token")) {
      this.$router.push("/");
    }
  },
  methods: {
    toggleModal() {
      this.modalShow = !this.modalShow;
    },
    acceptInvite() {
      const { onlineUsers } = this.$store.state;
      const sender = onlineUsers.find(
        (user) => user._id.toString() === this.sender._id.toString()
      );
      if (!sender || sender.status === "playing") {
        return notify("warning", "Sorry, invite has expired!");
      }
      this.$store.dispatch("acceptInvite", { sender: sender._id });
      this.modalShow = !this.modalShow;
    },
  },
  sockets: {
    inviteToPlay(sender) {
      const { nickname } = sender;
      this.inviteMessage = `You have been invited to play by ${nickname}`;
      const { user: current, onlineUsers } = this.$store.state;
      const currentUser = onlineUsers.find(
        (user) => user._id.toString() === current._id.toString()
      );
      if (currentUser.status === "online") {
        this.modalShow = true;
        this.sender = sender;
      }
    },
  },
};
</script>
