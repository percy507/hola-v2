<template>
  <div class="user-item"
       :class="{ checked : isChecked }"
       @click="activeFunc"
       @dblclick="readyToChat">
    <div class="avatar">
      <img :src="userObj.avatar"
           alt="avatar">
    </div>

    <div class="detail">
      <div class="name">
        {{ userObj.name }}
      </div>
      <div class="courtesyName">
        {{ userObj.courtesyName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user-item',
  props: {
    userObj: {
      required: true,
      type: Object
    }
  },
  data() {
    return {};
  },
  computed: {
    currentContact() {
      return this.$store.state.Contact.currentContact;
    },
    isChecked() {
      return this.currentContact.uid === this.userObj.uid;
    }
  },
  methods: {
    activeFunc() {
      this.$store.commit('Contact/CURRENT_CONTACT', {
        uid: this.userObj.uid
      });
    },
    readyToChat() {
      const obj = {
        ...this.userObj,
        unreadNum: 0
      };

      this.$store.commit('Chat/ADD_CHAT', { ...obj });
      this.$store.commit('Chat/CURRENT_CHAT', { ...obj });
      this.$router.push({
        path: '/app/chat'
      });
    }
  }
};
</script>

<style lang="stylus">
.user-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 46px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #424951;
  }

  &.checked {
    background: #525C68;
  }

  .avatar {
    width: 30px;
    height: 30px;
    margin: 0 10px 0 15px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .detail {
    width: 145px;
    font-size: 12px;
    color: #CCC;
    letter-spacing: 0.09px;

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
      color: #999;
      letter-spacing: 0.07px;
    }
  }
}
</style>
