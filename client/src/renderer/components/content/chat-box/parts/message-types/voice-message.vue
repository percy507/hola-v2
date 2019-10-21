<template>
  <div class="voice-message">
    {{ message.content.text }}
  </div>
</template>

<script>
export default {
  name: 'voice-message',
  props: {
    message: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="stylus">
.voice-message {
  padding: 0 2px;
}
</style>

