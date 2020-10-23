<template>
  <div class="text-center" id="portal">
    <b-container>
      <b-row>
        <b-col class="col-md-4"
          ><b-card :header="header" header-tag="header">
            <b-form v-if="!answered" @submit="onSubmit" class="login-form">
              <b-form-group description="Your Listener Will Guess Your Word">
                <b-input-group class="mb-2">
                  <b-input-group-prepend>
                    <div class="form-icon">
                      <i class="fa fa-envelope"></i>
                    </div>
                  </b-input-group-prepend>
                  <b-form-input
                    type="text"
                    required
                    placeholder="Enter your word"
                    v-model="answer"
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
              <b-button
                :disabled="!answer"
                class="submit-signup"
                type="submit"
                variant="primary"
                >Save</b-button
              >
            </b-form>
            <b-jumbotron v-else class lead="For Records, Your Word is:">
              <h4 class="answer-text">{{ capitalize(answer) }}</h4>
            </b-jumbotron>
          </b-card>
        </b-col>
        <b-col class="col-md-8 text-center">
          <b-card :header="guessListHeader" header-tag="header">
            <b-list-group class="guess-list" v-if="guesses.length">
              <b-list-group-item
                :key="guess + new Date()"
                v-for="(guess, index) in guesses"
              >
                <p style="float: left">
                  Is Your Word <b>{{ capitalize(guess) }}?</b>
                </p>
                <b-button-group v-if="index === 0" class="mx-1">
                  <b-button
                    @click="wrongGuess"
                    :disabled="
                      guesses[0].toLowerCase() === answer.toLowerCase() ||
                      marked
                    "
                    variant="danger"
                    >NO</b-button
                  >
                  <b-button
                    @click="youWin"
                    :disabled="
                      guesses[0].toLowerCase() !== answer.toLowerCase()
                    "
                    variant="success"
                    >YES</b-button
                  >
                </b-button-group>
                <b-button style="float: right" v-else disabled variant="primary"
                  ><b>NO</b></b-button
                >
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { capitalize, notify } from "../helpers";
export default {
  data() {
    return {
      answer: "",
      header: "Think of a Word",
      answered: false,
      guesses: [],
      marked: false,
    };
  },
  computed: {
    guessListHeader() {
      return this.marked
        ? "Waiting for Your Listener to Try Again..."
        : "Your Listener's Guesses Go Here";
    },
  },
  methods: {
    youWin() {
      notify("error", "The Listner Won, You Lost!");
      this.$store.commit("setInviteAccepted", false);
      const { listenerSocket } = this.$store.state;
      this.$socket.client.emit("gameOver", {
        to: listenerSocket,
        winner: "listner",
      });
    },
    wrongGuess() {
      const { listenerSocket } = this.$store.state;
      this.$socket.client.emit("wrongGuess", { listenerSocket });
      this.marked = true;
    },
    onSubmit(e) {
      e.preventDefault();
      this.header = "Waiting for the Listner to Guess Your Word...";
      this.answered = true;
      this.header = "You're the Czar";
      const { listenerSocket } = this.$store.state;
      this.$socket.client.emit("wordDispatched", { listenerSocket });
    },
    capitalize,
  },
  sockets: {
    guessAnswer(guess) {
      this.guesses.unshift(guess);
      this.marked = false;
    },
    gameOver(message) {
      this.$store.commit("setInviteAccepted", false);
      notify("success", message);
    },
  },
};
</script>
