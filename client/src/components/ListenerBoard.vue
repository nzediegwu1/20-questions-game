<template>
  <div>
    <div class="login-panel" id="portal">
      <b-card :header="header" class="mt-3 login-card">
        <b-form @submit="onSubmit" class="login-form">
          <b-form-group label="Your Guess">
            <b-input-group class="mb-2">
              <b-input-group-prepend>
                <div class="form-icon text-center">
                  <i class="fa fa-asterisk"></i>
                </div>
              </b-input-group-prepend>
              <b-form-input
                type="text"
                required
                v-model="guessAnswer"
                placeholder="Guess the Czars word"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-button
            :disabled="!guessAnswer || !wordDispatched"
            class="submit-signup"
            type="submit"
            variant="primary"
            >Guess</b-button
          > </b-form
        ><br />
        <h6 v-show="wordDispatched" class="text-center attempts">
          {{ 20 - guessList.length }} Attempts Left
        </h6>
        <b-list-group v-if="wordDispatched">
          <b-list-group-item
            :key="guess + new Date()"
            v-for="guess of guessList"
          >
            {{ capitalize(guess) }}
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </div>
  </div>
</template>

<script>
import { capitalize, notify } from "../helpers";

export default {
  data() {
    return {
      header: "Waiting for the Czar to Think of a Word",
      guessAnswer: "",
      wordDispatched: false,
      questionerSocket: "",
      guessList: [],
    };
  },
  methods: {
    capitalize,
    onSubmit(e) {
      e.preventDefault();
      this.guessList.unshift(this.guessAnswer);
      const payload = {
        questionerSocket: this.questionerSocket,
        guessAnswer: this.guessAnswer,
      };
      this.$socket.client.emit("guessAnswer", payload);
      this.guessAnswer = "";
      this.wordDispatched = false;
      this.header = "Waiting for the Czar to Confirm Your Guess...";
    },
  },
  sockets: {
    wordDispatched({ questionerSocket }) {
      this.header = "Word dispatched, Guess the Czar's word";
      this.wordDispatched = true;
      this.questionerSocket = questionerSocket;
    },
    async wrongGuess(message) {
      if (this.guessList.length > 19) {
        const payload = { to: this.questionerSocket, winner: "czar" };
        this.$socket.client.emit("gameOver", payload);

        const message = "Sorry, You Lost the Game.";
        const msgPayload = { message, style: "text-danger" };

        await this.$store.commit("setEndMessage", msgPayload);
        this.$store.commit("setIsOver", true);
      }
      notify("error", message);
      this.wordDispatched = true;
      this.header = "Try Another Word";
    },
    async gameOver(message) {
      const { receiverAccepted } = !this.$store.state;
      this.$store.commit("setReceiverAccepted", !receiverAccepted);

      const payload = { message, style: "text-success" };
      await this.$store.commit("setEndMessage", payload);
      this.$store.commit("setIsOver", true);
    },
  },
};
</script>
