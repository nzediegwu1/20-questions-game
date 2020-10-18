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
      :toggleModal="toggleModal"
    />
  </div>
</template>

<script>
import cookie from "js-cookie";
import { Sidebar, InviteModal } from "../components";

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
      // set current user.status to invited
      // set current user.inviter to sender._id
    },
  },
};
</script>
