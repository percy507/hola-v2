<template>
  <div v-if="$isWindowsOS"
       class="win-top-menu">
    <div class="icon icon-minus"
         @click.stop="minimizeWindow" />
    <!-- <div class="icon icon-window-maximize"
         @click.stop="maximizeWindow" /> -->
    <div class="icon icon-close"
         @click.stop="hiddenWindow" />
  </div>
</template>

<script>
export default {
  name: 'win-menu',
  methods: {
    minimizeWindow() {
      if (!this.$win.isMinimized()) {
        this.$win.minimize();
      }
    },

    maximizeWindow() {
      if (!this.$win.isMaximized()) {
        this.$win.maximize();
      }
    },

    hiddenWindow() {
      this.$win.setSkipTaskbar(true);
      this.$win.hide();
    }
  }
};
</script>

<style lang="stylus">
.win-top-menu {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  cursor: default;
  -webkit-app-region: no-drag;

  .icon {
    display: block;
    width: 12px;
    height: @width;
    margin: 3px;
    line-height: @width;
    text-align: center;
    font-size: 10px;
    font-weight: normal;
    color: #aaa;
  }

  .icon-close {
    font-size: 12px;
    font-weight: 600;
  }
}
</style>
