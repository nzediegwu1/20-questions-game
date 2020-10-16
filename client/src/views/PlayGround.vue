<template>
  <div>
    <Sidebar />
    <p class="text-center">
      This is an amazing playground specially made for you
    </p>
  </div>
</template>

<script>
import cookie from "js-cookie";
import { Sidebar } from "../components";

export default {
  components: { Sidebar },

  mounted() {
    if (!cookie.get("token")) {
      this.$router.push("/");
    }
  },
};
</script>
