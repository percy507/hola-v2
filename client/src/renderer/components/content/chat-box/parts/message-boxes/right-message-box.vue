<template>
  <div class="right-message-box">

    <div class="content"
         :class="{'is-image': isImage}">
      <slot></slot>
    </div>

    <div class="avatar">
      <img :src="userInfo.avatar">
    </div>

    <div class="message-read-status"
         :class="{ 'has-read': message.hasRead }">
      {{ messageStatus }}
    </div>

    <div class="message-time">
      {{ $formatTimestamp(message.time || Date.now()) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'right-message-box',
  props: {
    message: {
      required: true,
      type: Object
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.Main.userInfo;
    },
    isImage() {
      return this.message.type === 'image';
    },
    messageStatus() {
      return this.message.hasRead ? '已读' : '未读';
    }
  }
};
</script>

<style lang="stylus">
.right-message-box {
  position: relative;
  display: flex;
  justify-content: flex-end;

  .avatar {
    width: 34px;
    height: @width;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
    }
  }

  .content {
    position: relative;
    max-width: 300px;
    margin-right: 14px;
    padding: 8px;
    border-radius: 6px;
    background: $right-message-box-bg-color;
    font-size: 13px;
    color: $right-message-box-font-color;
    letter-spacing: 0.06px;
    word-break: break-all;
    cursor: text;
    user-select: text;

    &.is-image {
      padding: 0px;

      &::after {
        display: none;
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: 6px;
      right: -22px;
      z-index: 3;
      width: 0;
      height: 0;
      border-left: 12px solid $right-message-box-bg-color;
      border-right: 12px solid transparent;
      border-bottom: 12px solid transparent;
      border-top: 12px solid transparent;
    }
  }

  .message-read-status {
    position: absolute;
    bottom: -20px;
    right: 48px;
    font-size: 11px;
    font-weight: 300;
    color: #3d3d3d;

    &.has-read {
      color: #999;
    }
  }

  .message-time {
    position: absolute;
    bottom: -20px;
    right: 80px;
    font-size: 11px;
    font-weight: 300;
    color: #999;
  }
}
</style>

