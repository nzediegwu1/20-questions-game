<template>
  <b-form class="login-form" @submit="onSubmit">
    <b-form-group label="Email">
      <b-input-group class="mb-2">
        <b-input-group-prepend>
          <div class="form-icon"><i class="fa fa-envelope"></i></div>
        </b-input-group-prepend>
        <b-form-input
          v-model="form.email"
          type="email"
          required
          placeholder="Enter your email"
        ></b-form-input>
      </b-input-group>
    </b-form-group>
    <b-form-group label="Password">
      <b-input-group class="mb-2">
        <b-input-group-prepend>
          <div class="form-icon">
            <i style="font-size: 1.7em" class="fa fa-lock"></i>
          </div>
        </b-input-group-prepend>
        <b-form-input
          v-model="form.password"
          required
          type="password"
          :state="validatePassword"
          aria-describedby="password-feedback"
        ></b-form-input>
        <b-form-invalid-feedback id="password-feedback">
          Enter at least 6 letters
        </b-form-invalid-feedback>
      </b-input-group>
    </b-form-group>

    <b-button
      v-if="!this.state.loading"
      class="submit-signup"
      :disabled="!validatePassword"
      type="submit"
      variant="primary"
      >Login</b-button
    >
    <div v-else class="text-center">
      <i class="fa fa-spinner fa-spin"></i>
    </div>
    <LogoutBrowsers
      :modalShow="shouldLogout"
      :actions="{ logoutBrowser, toggleModal }"
      :message="message"
    />
  </b-form>
</template>

<script>
import { validatePassword } from "../helpers";
import LogoutBrowsers from "./LogoutBrowsers";

export default {
  components: { LogoutBrowsers },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      shouldLogout: false,
      message: "",
    };
  },
  computed: {
    validatePassword() {
      return validatePassword(this.form.password);
    },
    state() {
      return this.$store.state;
    },
  },
  methods: {
    toggleModal() {
      this.shouldLogout = !this.shouldLogout;
    },
    logoutBrowser() {
      this.$store.dispatch("logoutBrowsers", this);
    },
    onSubmit(event) {
      event.preventDefault();
      this.$store.dispatch("login", this);
    },
  },
};
</script>
