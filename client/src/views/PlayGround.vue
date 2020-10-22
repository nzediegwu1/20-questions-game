<template>
  <div>
    <GameNav />
    <inviter-board
      v-if="receiverAccepted && currentUser.status === 'playing'"
    />
    <InviteeBoard
      v-else-if="inviteAccepted && currentUser.status === 'playing'"
    />
    <Instructions v-else />
  </div>
</template>

<script>
import cookie from "js-cookie";
import {
  Instructions,
  InviteeBoard,
  InviterBoard,
  GameNav,
} from "../components";
import { currentUser } from "../helpers";

export default {
  components: {
    Instructions,
    InviteeBoard,
    InviterBoard,
    GameNav,
  },
  data() {
    return {
      receiverAccepted: false,
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
  },
  methods: {},
  sockets: {
    receiverAccepted(status) {
      this.receiverAccepted = status;
    },
    playerLeft(leftPlayer) {
      const { user } = this.$store.state;
      if (user._id == leftPlayer._id) this.$router.push("/");
    },
  },
};
</script>
