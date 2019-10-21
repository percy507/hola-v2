<template>
  <div class="menu-chat">
    <div class="search-bar">
      <div class="temp-content">
        Hola
      </div>
      <!-- <div class="content">
        <input type="text"
               v-model="keyword"
               :placeholder="placeholder"
               @focus="removePlaceholder"
               @blur="setPlaceholder"
               @keydown.enter="searchFunc">
      </div> -->
    </div>

    <div class="menu-chat-content">
      <div v-if="chatArr.length === 0"
           class="no-chat-object">
        暂无聊天对象
      </div>

      <chat-item v-for="item in chatArr"
                 :key="item.uid"
                 :contactInfo="item" />
    </div>
  </div>
</template>

<script>
import ChatItem from './parts/chat-item';

export default {
  name: 'menu-chat',
  components: {
    ChatItem
  },
  data() {
    return {
      keyword: '',
      placeholder: ''
    };
  },
  computed: {
    chatArr() {
      return this.$store.state.Chat.chatArr;
    },
    chatIdArr() {
      const arr = [];

      this.chatArr.forEach(chat => arr.push(chat.uid));

      return arr;
    },
    unreadMessageObj() {
      return this.$store.getters['Message/unreadMessageObj'];
    }
  },
  created() {
    this.setPlaceholder();
  },
  mounted() {
    this.updateChatArr();
  },
  watch: {
    unreadMessageObj: {
      deep: true,
      handler() {
        this.updateChatArr();
        this.$store.commit(
          'Chat/UPDATE_CHAT_ARR_STATUS',
          this.unreadMessageObj
        );
      }
    }
  },
  methods: {
    updateChatArr() {
      const uidArr = Object.keys(this.unreadMessageObj);

      uidArr.forEach(uid => {
        if (!this.chatIdArr.includes(uid) && this.unreadMessageObj[uid] !== 0) {
          this.getUserInfo(uid).then(obj => {
            const { uid, name, courtesyName, avatar } = obj;

            this.newChat({
              uid,
              name,
              courtesyName,
              avatar,
              unreadNum: this.unreadMessageObj[uid]
            });
          });
        }
      });
    },

    newChat(obj) {
      this.$store.commit('Chat/ADD_CHAT', {
        ...obj,
        unreadNum: obj.unreadNum
      });
    },

    getUserInfo(uid) {
      return new Promise(resolve => {
        const eventName = 'get-user-info';

        this.$socket.emit(eventName, uid, response => {
          if (response.code === 0) {
            resolve({
              ...response.data
            });
          } else {
            this.$handleResponseError(eventName, response);
          }
        });
      });
    },

    removePlaceholder() {
      this.placeholder = '';
    },

    setPlaceholder() {
      this.placeholder = ' 搜索';
    },

    searchFunc() {
      console.log('searching...');
    }
  }
};
</script>

<style lang="stylus">
.menu-chat {
  width: $search-bar-width;

  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: $search-bar-width;
    height: $search-bar-height;
    background: $search-bar-bg;
    -webkit-app-region: drag;

    .content {
      width: 190px;
      height: 26px;
      background: #485057;
      border-radius: 100px;
    }

    .temp-content {
      width: $search-bar-width;
      height: $search-bar-height;
      line-height: $search-bar-height;
      text-align: center;
      background: #323A43;
      font-size: 16px;
      color: #aaa;
    }

    input {
      display: block;
      width: 100%;
      height: 26px;
      padding: 0 15px;
      border: none;
      background: none;
      font-size: 12px;
      color: #aaa;
      text-align: center;
      -webkit-app-region: no-drag;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #797979;
        letter-spacing: 0.1px;
        font-family: 'icomoon';
        font-weight: 400;
      }
    }
  }
}

.menu-chat-content {
  height: $app-height - $search-bar-height;
  background: $menu-content-bg;
  overflow-y: auto;
}

.no-chat-object {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #A7B0BB;
  opacity: 0.5;
}
</style>
