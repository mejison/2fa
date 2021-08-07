<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #fafbfc;
  font-family: Arial, Helvetica, sans-serif;
}

#app {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 10px;
  background-color: #fff;
  width: 400px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 4px;
}
</style>
