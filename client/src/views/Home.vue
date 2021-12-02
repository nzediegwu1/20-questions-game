<template>
  <div id="portal">
    <b-card class="mt-3 login-card">
      <h2 class="form-title text-center">20 Questions Game</h2>
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
import cookie from "js-cookie";
import { LoginForm, SignupForm } from "../components";

export default {
  components: { LoginForm, SignupForm },
  mounted() {
    if (cookie.get("token")) this.$router.push("/playground");
  },
};
</script>
