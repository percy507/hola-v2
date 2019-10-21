<template>
  <div class="chat-item"
       :class="{ checked : isChecked }"
       @click="activeFunc">
    <div class="avatar">
      <img :src="contactInfo.avatar"
           alt="avatar">
      <div class="unread-count"
           v-show="!!contactInfo.unreadNum">
        <div v-if="contactInfo.unreadNum > 99"
             class="unread-count-max">99+</div>
        <div v-else>{{ contactInfo.unreadNum }}</div>
      </div>
    </div>

    <div class="detail">
      <div>
        <div class="name">
          {{ contactInfo.name || '-' }}
        </div>
        <div class="courtesyName">
          {{ contactInfo.courtesyName }}
        </div>
      </div>
    </div>

    <div class="chat-item-tail">
      <span class="icon icon-close"
            @click.stop="deleteChat"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chat-item',
  props: {
    contactInfo: {
      required: true,
      type: Object
    }
  },
  data() {
    return {};
  },
  computed: {
    currentChat() {
      return this.$store.state.Chat.currentChat;
    },
    isChecked() {
      return this.currentChat.uid === this.contactInfo.uid;
    }
  },
  methods: {
    activeFunc() {
      this.$store.commit('Chat/CURRENT_CHAT', this.contactInfo);
      this.$store.commit('Chat/HIDE_CHAT_BOX_SIDEBAR');
    },

    deleteChat() {
      if (this.isChecked) {
        this.$store.commit('Chat/CURRENT_CHAT', {});
      }

      this.$store.commit('Chat/DELETE_CHAT', this.contactInfo.uid);
    }
  }
};
</script>

<style lang="stylus">
.chat-item {
  position: relative;
  display: flex;
  align-items: center;
  width: $search-bar-width;
  height: 60px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #424951;
  }

  &.checked {
    background: #525C68;
  }

  .avatar {
    position: relative;
    width: 34px;
    height: 34px;
    margin: 0 10px 0 15px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .unread-count {
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 10;
      background: #E1473C;
      border-radius: 50%;
      text-align: center;
      font-size: 10px;
      color: #fff;

      div {
        width: 16px;
        height: @width;
        line-height: @width;
      }

      .unread-count-max {
        width: 20px;
        font-size: 8px;
      }
    }
  }

  .detail {
    width: 145px;
    font-size: 12px;
    color: #CCC;
    letter-spacing: 0.09px;

    .group-dissolve {
      color: #E06C72;
    }

    .name, .courtesyName {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .name {
      .icon {
        margin-right: 4px;
        font-size: 10px;
      }
    }

    .courtesyName {
      font-size: 10px;
      color: #999999;
      letter-spacing: 0.07px;
    }
  }

  .chat-item-tail {
    display: block;
    position: absolute;
    right: 10px;
    z-index: 10;
    width: 20px;
    height: @width;
    line-height: @height;
    text-align: center;
  }

  .icon-close {
    display: none;
  }

  &:hover .icon-close {
    display: block;
    color: #ccc;
    font-size: 14px;
  }
}
</style>
