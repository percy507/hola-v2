<template>
  <div :class="`ball-pulse-sync__${size}`">
    <div :style="styleObj"></div>
    <div :style="styleObj"></div>
    <div :style="styleObj"></div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    size: {
      default: 'small'
    },
    styleObj: {
      default: {}
    }
  }
};
</script>

<style lang="stylus">
@keyframes ball-pulse-sync__small {
  33% {
    transform: translateY(3px);
  }

  66% {
    transform: translateY(-3px);
  }

  100% {
    transform: translateY(0);
  }
}

.ball-pulse-sync__small {
  line-height: 30px;

  div {
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 100%;
    margin: 1px;
    animation-fill-mode: both;

    &:nth-child(1) {
      animation: ball-pulse-sync__small 0.6s -0.14s infinite ease-in-out;
    }

    &:nth-child(2) {
      animation: ball-pulse-sync__small 0.6s -0.07s infinite ease-in-out;
    }

    &:nth-child(3) {
      animation: ball-pulse-sync__small 0.6s 0s infinite ease-in-out;
    }
  }
}

@keyframes ball-pulse-sync__normal {
  33% {
    transform: translateY(14px);
  }

  66% {
    transform: translateY(-14px);
  }

  100% {
    transform: translateY(0);
  }
}

.ball-pulse-sync__normal {
  line-height: 30px;

  div {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    margin: 2px;
    animation-fill-mode: both;

    &:nth-child(1) {
      animation: ball-pulse-sync__small 0.6s -0.14s infinite ease-in-out;
    }

    &:nth-child(2) {
      animation: ball-pulse-sync__small 0.6s -0.07s infinite ease-in-out;
    }

    &:nth-child(3) {
      animation: ball-pulse-sync__small 0.6s 0s infinite ease-in-out;
    }
  }
}
</style>
