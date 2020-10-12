<template>
  <div class="login-panel" id="portal">
    <b-card class="mt-3 login-card">
      <h2 class="form-title text-center">
        20 Questions Game
      </h2>
      <b-tabs content-class="mt-3">
        <b-tab title="LOGIN" active>
          <LoginForm />
        </b-tab>
        <b-tab title="SIGNUP">
          <SignupForm />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { LoginForm, SignupForm } from "../components";

export default {
  components: { LoginForm, SignupForm },
  data() {
    return {
      form: {
        email: "",
        name: "",
        password: "",
        confirmPassword: ""
      },
      loading: false
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    }
  }
};
</script>
