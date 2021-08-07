<template>
  <div class="twofa">
    <label for="2fa">
      <input
        id="2fa"
        type="checkbox"
        v-model="enable2FA"
        @change="onChange2fa"
      />
      Enable 2FA
    </label>
    <div class="qr-area" v-if="enable2FA">
      <img :src="qr" v-if="qr && enable2FA" alt="qr" />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "enable2FA",

  props: ["user"],

  data() {
    return {
      enable2FA: false,
      qr: ""
    };
  },

  watch: {
    user() {
      this.enable2FA =
        this.user && this.user.enable2FA ? this.user.enable2FA : false;
    }
  },

  mounted() {
    this.enable2FA =
      this.user && this.user.enable2FA ? this.user.enable2FA : false;
  },

  methods: {
    onChange2fa() {
      if (this.enable2FA) {
        this.generateQR();
        return;
      }
      this.updateUserProfile();
    },
    updateUserProfile() {
      const token = localStorage.getItem("token");
      axios({
        method: "put",
        url: "/update",
        data: {
          enable2FA: this.enable2FA
        },
        headers: {
          "x-access-token": token
        }
      });
    },
    generateQR() {
      const token = localStorage.getItem("token");
      axios({
        method: "post",
        url: "/generate",
        data: {},
        headers: {
          "x-access-token": token
        }
      }).then(({ data }) => {
        this.qr = data.qr;
      });
    }
  }
};
</script>

<style>
.twofa {
  margin-bottom: 20px;
}
</style>
