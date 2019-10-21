<template>
  <div class="default-page">
    <win-menu />
    <img src="../../../assets/logo.png"
         alt="Logo">
  </div>
</template>

<script>
import WinMenu from "../../@parts/win-menu";

export default {
  name: "default-page",
  components: {
    WinMenu
  },
  data() {
    return {};
  },
  methods: {
    chatFunc(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="stylus">
.default-page {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: $app-height;
  -webkit-app-region: drag;

  img {
    width: 170px;
    height: 170px;
    opacity: 0.4;
  }
}
</style>
