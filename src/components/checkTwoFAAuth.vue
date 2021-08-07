<template>
  <div class="check-twofaauth">
    <input
      class="code"
      placeholder="Please enter verification code here ..."
      type="text"
      v-model="code"
    />
    <button class="btn-verify" @click="doVerify">Verify</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "checkTwoFAAuth",

  data() {
    return {
      code: ""
    };
  },

  methods: {
    doVerify() {
      const token = localStorage.getItem("token");
      axios({
        method: "post",
        url: "/check-2fa",
        data: {
          code: this.code
        },
        headers: {
          "x-access-token": token
        }
      }).then(({ data }) => {
        if (data.verified) {
          this.$router.push("/profile");
          return;
        }
        alert("Incorrect verification code.");
      });
    }
  }
};
</script>

<style>
.code {
  width: 100%;
  padding: 8px;
}

.btn-verify {
  margin-left: 10px;
}

.check-twofaauth {
  display: flex;
}
</style>
