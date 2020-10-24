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
  </b-modal>
</template>

<script>
export default {
  props: ["modalShow", "message", "css"],
  methods: {
    closeModal() {
      this.$store.commit("setIsOver", false);
      this.$store.commit("setEndMessage", {});
    },
  },
};
</script>
