<template>
  <b-modal hide-footer v-model="modalShow">
    <template #modal-header="">
      <h5>Game Invite</h5>
    </template>
    <h6 class="text-center">{{ sender.nickname }} invited you to play</h6>
    <br />
    <b-container>
      <b-row>
        <b-col
          ><b-button block variant="success" @click="actions.acceptInvite"
            >Accept</b-button
          ></b-col
        >
        <b-col>
          <b-button block variant="danger" @click="actions.toggleModal"
            >Reject</b-button
          ></b-col
        >
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
export default {
  props: ["modalShow", "sender", "actions"],
};
</script>
