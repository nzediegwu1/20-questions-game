<template>
  <b-form class="login-form" @submit="onSubmit">
    <b-form-group label="Full Name">
      <b-input-group class="mb-2">
        <b-input-group-prepend>
          <div class="form-icon"><i class="fa fa-user-circle"></i></div>
        </b-input-group-prepend>
        <b-form-input
          v-model="form.fullname"
          required
          placeholder="Enter your full name"
        ></b-form-input>
      </b-input-group>
    </b-form-group>

    <b-form-group
      label="Email"
      description="We'll never share your email with anyone else."
    >
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
            <i style="font-size: 1.7em;" class="fa fa-lock"></i>
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

    <b-form-group label="Confirm Password">
      <b-input-group class="mb-2">
        <b-input-group-prepend>
          <div class="form-icon">
            <i style="font-size: 1.7em;" class="fa fa-lock"></i>
          </div>
        </b-input-group-prepend>
        <b-form-input
          v-model="form.confirmPassword"
          required
          type="password"
          :state="confirmPassword"
          aria-describedby="cpassword-feedback"
        ></b-form-input>
        <b-form-invalid-feedback id="cpassword-feedback">
          Password does not match
        </b-form-invalid-feedback>
      </b-input-group>
    </b-form-group>
    <b-button
      v-if="!this.state.loading"
      class="submit-signup"
      :disabled="!(validatePassword && confirmPassword)"
      type="submit"
      variant="primary"
      >Signup</b-button
    >
    <div v-else class=" text-center ">
      <i class="fa fa-spinner fa-spin"></i>
    </div>
  </b-form>
</template>

<script>
import { validatePassword } from "../helpers";

export default {
  data() {
    return {
      form: {
        fullname: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    };
  },
  computed: {
    validatePassword() {
      return validatePassword(this.form.password);
    },
    confirmPassword() {
      const { password, confirmPassword } = this.form;
      return !confirmPassword
        ? null
        : password !== confirmPassword
        ? false
        : true;
    },
    state() {
      return this.$store.state;
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$store.dispatch("signup", this.form);
    }
  }
};
</script>
