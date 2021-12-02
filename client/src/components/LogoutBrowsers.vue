<template>
  <b-modal centered hide-footer hide-header v-model="modalShow">
    <h6 class="text-center">{{ message }}</h6>
    <h6 class="text-center">Logout of other browser?</h6>
    <br />
    <b-container class="invite-action">
      <b-row>
        <b-col
          ><b-button block variant="success" @click="actions.logoutBrowser"
            >Yes</b-button
          ></b-col
        >
        <b-col>
          <b-button block variant="danger" @click="actions.toggleModal"
            >No</b-button
          ></b-col
        >
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
export default {
  props: ["modalShow", "actions", "message"],
};
</script>
