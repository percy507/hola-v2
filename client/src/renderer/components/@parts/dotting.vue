<template>
  <span class="dotting-animation" />
</template>

<script>
export default {
  name: 'dotting'
};
</script>

<style lang="stylus">
.dotting-animation {
  display: inline-block;
  height: 1em;
  line-height: 1;
  text-align: left;
  vertical-align: -0.25em;
  overflow: hidden;
}

.dotting-animation::before {
  display: block;
  content: '...\n..\n.';
  white-space: pre-wrap;
  animation: dotting 1s infinite step-start both;
}

@keyframes dotting {
  25% {
    transform: translateY(-3em);
  }

  50% {
    transform: translateY(-2em);
  }

  75% {
    transform: translateY(-1em);
  }
}
</style>
