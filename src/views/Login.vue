<template>
  <div>
    <div class="card">
      <div
        id="custom-btn"
        v-if="!isShowCheckTwoFAAuth"
        class="customGPlusSignIn"
      >
        <span class="icon"></span>
        <span class="buttonText">Google</span>
      </div>
      <checkTwoFAAuth v-if="isShowCheckTwoFAAuth" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import checkTwoFAAuth from "@/components/checkTwoFAAuth";

export default {
  name: "login",

  components: {
    checkTwoFAAuth
  },

  props: ["user"],

  data() {
    return {
      isShowCheckTwoFAAuth: false
    };
  },

  mounted() {
    /* eslint-disable */
    if (auth2) {
      auth2.attachClickHandler("custom-btn", {}, this.onSuccess, this.onError);
      return;
    }

    window.addEventListener("init-google", () => {
      auth2.attachClickHandler("custom-btn", {}, this.onSuccess, this.onError);
    });
    /* eslint-enable */
  },

  methods: {
    onSuccess(googleUser) {
      const profile = googleUser.getBasicProfile();
      const data = {
        id: profile.getId(),
        name: profile.getName(),
        image_url: profile.getImageUrl(),
        email: profile.getEmail()
      };

      axios
        .post("/login", {
          data
        })
        .then(({ data }) => {
          if (data) {
            const { user } = data;
            localStorage.setItem("token", user.token);
            if (user.enable2FA) {
              this.isShowCheckTwoFAAuth = true;
              return;
            }
            this.$router.push("/profile");
          }
        });
    },
    onError(err) {
      console.error(err);
    }
  }
};
</script>

<style>
#custom-btn {
  display: inline-block;
  background: white;
  color: #444;
  width: 100%;
  text-align: center;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
}
#custom-btn:hover {
  cursor: pointer;
}
span.label {
  font-family: serif;
  font-weight: normal;
}
span.icon {
  background: url("https://developers-dot-devsite-v2-prod.appspot.com/identity/sign-in/g-normal.png")
    transparent 5px 50% no-repeat;
  display: inline-block;
  vertical-align: middle;
  width: 42px;
  height: 42px;
}
span.buttonText {
  display: inline-block;
  vertical-align: middle;
  padding-left: 0;
  font-size: 14px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
}
</style>
