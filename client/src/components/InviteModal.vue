<template>
  <b-modal title="Game Invite" hide-footer v-model="modalShow">
    <h6 class="text-center">
      You have been invited to play by {{ sender.nickname }}
    </h6>
    <br />
    <b-container>
      <b-row>
        <b-col
          ><b-button block variant="success" @click="toggleModal"
            >Accept</b-button
          ></b-col
        >
        <b-col>
          <b-button block variant="danger" @click="toggleModal"
            >Reject</b-button
          ></b-col
        >
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
export default {
  props: ["modalShow", "sender", "toggleModal"],
};
</script>
