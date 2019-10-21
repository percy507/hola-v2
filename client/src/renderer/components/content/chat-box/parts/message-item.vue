<template>
  <div class="message-item">
    <div v-if="message.from === uid">
      <right-message-box :message="message">
        <keep-alive>
          <component :is="currentMessageType"
                     :message="message"></component>
        </keep-alive>
      </right-message-box>
    </div>

    <div v-else>
      <left-message-box :message="message">
        <keep-alive>
          <component :is="currentMessageType"
                     :message="message"></component>
        </keep-alive>
      </left-message-box>
    </div>
  </div>
</template>

<script>
import LeftMessageBox from './message-boxes/left-message-box';
import RightMessageBox from './message-boxes/right-message-box';

import TextMessage from './message-types/text-message';
import ImageMessage from './message-types/image-message';
import FileMessage from './message-types/file-message';
import VideoMessage from './message-types/video-message';
import VoiceMessage from './message-types/voice-message';

export default {
  name: 'message-item',
  components: {
    LeftMessageBox,
    RightMessageBox,
    TextMessage,
    ImageMessage,
    FileMessage,
    VoiceMessage,
    VideoMessage
  },
  props: {
    message: {
      required: true,
      type: Object
    }
  },
  computed: {
    uid() {
      return this.$store.state.Main.userInfo.uid;
    },
    currentMessageType() {
      return `${this.$capitalizeFirstLetter(this.message.type)}Message`;
    }
  }
};
</script>

<style lang="stylus">
.message-item {
  margin-bottom: 35px;
}
</style>
