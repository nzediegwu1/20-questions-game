<template>
  <div>
    <NavBar />
    <ListenerBoard
      v-if="receiverAccepted && currentUser.status === 'playing'"
    />
    <CzarBoard v-else-if="inviteAccepted && currentUser.status === 'playing'" />
    <Instructions v-else />
  </div>
</template>

<script>
import cookie from "js-cookie";
import { Instructions, CzarBoard, ListenerBoard, NavBar } from "../components";
import { currentUser } from "../helpers";

export default {
  components: {
    Instructions,
    CzarBoard,
    ListenerBoard,
    NavBar,
  },
  data() {
    return {
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
    inviteAccepted() {
      return this.$store.state.inviteAccepted;
    },
    receiverAccepted() {
      return this.$store.state.receiverAccepted;
    },
  },
  sockets: {
    receiverAccepted(status) {
      this.$store.commit("setReceiverAccepted", status);
    },
    playerLeft(leftPlayer) {
      const { user } = this.$store.state;
      if (user._id == leftPlayer._id) this.$router.push("/");
    },
  },
};
</script>
