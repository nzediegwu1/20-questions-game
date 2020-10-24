<template>
  <div>
    <NavBar />
    <ListenerBoard
      v-if="receiverAccepted && currentUser.status === 'playing'"
    />
    <CzarBoard v-else-if="inviteAccepted && currentUser.status === 'playing'" />
    <Instructions v-else />
    <GameOver
      :css="endMessage.style"
      :message="endMessage.message"
      :modalShow="isOver"
    />
  </div>
</template>

<script>
import {
  Instructions,
  CzarBoard,
  ListenerBoard,
  NavBar,
  GameOver,
} from "../components";
import { currentUser } from "../helpers";

export default {
  components: {
    Instructions,
    CzarBoard,
    ListenerBoard,
    NavBar,
    GameOver,
  },
  data() {
    return {
      listenerSocket: "",
    };
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
    isOver() {
      return this.$store.state.isOver;
    },
    endMessage() {
      return this.$store.state.endMessage;
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
