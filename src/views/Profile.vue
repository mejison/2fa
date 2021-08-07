<template>
  <div class="profile">
    <div class="card" v-if="user">
      <img
        class="avatar"
        :src="user.avatar"
        alt="avatar"
        width="100"
        height="100"
      />
      <ul>
        <li>
          Name: <b>{{ user.name }}</b>
        </li>
        <li>
          Email: <b>{{ user.email }}</b>
        </li>
      </ul>
      <twoFAAuth :user="user" />
      <button class="btn" @click.prevent="onLogout">LogOut</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import twoFAAuth from "@/components/twoFAAuth";

export default {
  name: "Profile",

  components: {
    twoFAAuth
  },

  data: function() {
    return {
      user: null,
      token: null
    };
  },

  beforeMount() {
    this.token = localStorage.getItem("token");
    this.getMe();
  },

  methods: {
    onLogout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
    getMe() {
      axios({
        method: "get",
        url: "/me",
        data: {},
        headers: {
          "x-access-token": this.token
        }
      }).then(({ data }) => {
        const { user } = data;
        this.user = user;
      });
    }
  }
};
</script>

<style>
.avatar {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
</style>
