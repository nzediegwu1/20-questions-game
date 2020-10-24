<template>
  <b-modal hide-footer v-model="modalShow">
    <template class="gameover-header" #modal-header>
      <b>Game Over!</b>
      <b-button
        class="gameover-button"
        size="sm"
        variant="outline-danger"
        @click="closeModal"
      >
        x
      </b-button>
    </template>
    <h5 :class="`text-center ${css}`">{{ message }}</h5>
    <h6 v-if="answer" class="text-center">
      The word is: <b class="text-success">{{ capitalize(answer) }}</b>
    </h6>
  </b-modal>
</template>

<script>
import { capitalize } from "../helpers";

export default {
  props: ["modalShow", "message", "css", "answer"],
  methods: {
    capitalize,
    closeModal() {
      this.$store.commit("setIsOver", false);
      this.$store.commit("setEndMessage", {});
    },
  },
};
</script>
