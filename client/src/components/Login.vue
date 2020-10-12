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

    <b-button class="submit-signup" type="submit" variant="primary"
      >Login</b-button
    >
  </b-form>
</template>

<script>
import toastr from "toastr";

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      loading: false
    };
  },
  computed: {
    validatePassword() {
      const passLength = this.form.password.length;
      return !passLength ? null : passLength < 6 ? false : true;
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      if (!this.validatePassword) return toastr.error("Password is invalid");
      toastr.success("Login Successful");
    }
  }
};
</script>
