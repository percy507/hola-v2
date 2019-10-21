<template>
  <div id="app">
    <div class="sidebar">
      <menu-bar></menu-bar>

      <keep-alive>
        <router-view name="menus"></router-view>
      </keep-alive>
    </div>

    <keep-alive>
      <router-view name="contents"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MenuBar from './sidebar/menu-bar.vue';
import newMessageSound from '../assets/sounds/new-message.mp3';

export default {
  name: 'app',
  components: {
    MenuBar
  },
  data() {
    return {
      newMessageSound: new Audio(newMessageSound),
      isSoundPlaying: false
    };
  },
  computed: {
    uid() {
      return localStorage.getItem('uid');
    }
  },
  created() {
    const isLogin = !!this.uid;

    if (!isLogin) {
      this.$toLoginPage();
      return;
    }

    this.init();

    if (this.$socket.connected) {
      this.onConnected();
    } else {
      this.$socket.connect();

      this.$socket.on('connect', () => {
        if (isLogin) {
          this.onConnected();
        }
      });
    }
  },
  methods: {
    init() {
      this.onReceiveMessage();
      this.onMessageHasRead();
      this.onVueStoreChange();

      this.loadRecentChatList();
      this.loadLocalHistoryMessage();
    },

    onConnected() {
      this.onUserConnect();
      this.onUserLoginAnotherPlace();
      this.getUserInfo();
      this.receiveOfflineMessage();
    },

    getUserInfo() {
      const eventName = 'get-user-info';

      this.$socket.emit(eventName, this.uid, response => {
        if (response.code === 0) {
          this.$store.commit('Main/SET_USERINFO', {
            ...response.data
          });
        } else {
          this.$handleResponseError(eventName, response);
        }
      });
    },

    onUserConnect() {
      this.$socket.emit('user-connect', this.uid);
    },

    onUserLoginAnotherPlace() {
      this.$socket.on('login-another-place', () => {
        const options = {
          type: 'info',
          message: '登录警告',
          detail:
            '您的账号正在另一个地方进行登录，如果不是本人进行操作，请找管理员修改密码。',
          buttons: ['确认']
        };

        this.$showMessageDialog(options, () => {
          this.$toLoginPage.call(this);
        });
      });
    },

    noticeNewMessage() {
      if (!this.isSoundPlaying) {
        this.isSoundPlaying = true;
        this.newMessageSound.play();
      }

      this.newMessageSound.onended = () => {
        this.isSoundPlaying = false;
      };

      this.$electron.ipcRenderer.send('new-message');
    },

    onReceiveMessage() {
      // 新消息通知
      this.$win.flashFrame(true);

      this.$socket.on('message', message => {
        this.noticeNewMessage();

        this.$store.commit('Message/NEW_MESSAGE', {
          isReceiveMessage: true,
          message
        });
      });
    },

    onMessageHasRead() {
      this.$socket.on('message-has-read', payload => {
        this.$store.commit('Message/UPDATE_MESSAGE_STATUS', {
          isReceiveMessage: true,
          data: payload
        });
      });
    },

    // 拉取离线消息
    receiveOfflineMessage() {
      const eventName = 'receive-offline-message';

      this.$socket.emit(eventName, this.uid, response => {
        if (response.code === 0) {
          const messages = response.data;

          if (messages.length) {
            this.noticeNewMessage();
          }

          messages.forEach(message => {
            this.$store.commit('Message/NEW_MESSAGE', {
              isReceiveMessage: true,
              message
            });
          });
        } else {
          this.$handleResponseError(eventName, response);
        }
      });
    },

    isSpecialMessage(type) {
      return (
        type === 'image' ||
        type === 'file' ||
        type === 'voice' ||
        type === 'video'
      );
    },

    // 判断消息是否是正在上传中的图片或文件
    isProgressingMessage(message) {
      const { type } = message;

      if (type === 'image' || type === 'file') {
        if (message.content.url) {
          return false;
        }

        return true;
      }

      return false;
    },

    // 本地持久化历史消息
    onVueStoreChange() {
      const storage = this.$electronStore;

      this.$store.subscribe(mutation => {
        const { type, payload } = mutation;

        switch (type) {
          case 'Message/NEW_MESSAGE': {
            // 非即时消息不在此处写入磁盘，因为涉及到上传，有延迟
            if (this.isProgressingMessage(payload.message)) {
              return;
            }

            const { message, isReceiveMessage } = payload;
            const uid = isReceiveMessage ? message.from : message.to;

            if (storage.has(uid)) {
              if (!storage.get(uid).find(el => el.uuid === message.uuid)) {
                storage.set(uid, [...storage.get(uid), message]);
              }
            } else {
              storage.set(uid, [message]);
            }

            break;
          }
          case 'Message/UPDATE_MESSAGE': {
            // 不存储 progressing 的消息，防止磁盘IO太密集
            // 比如上传文件时，上传中动态的进度信息不写磁盘
            if (this.isProgressingMessage(payload)) {
              return;
            }

            const message = { ...payload };
            const uid = message.to;
            const uuid = message.uuid;
            const arr = storage.get(uid) || [message];
            const index = arr.findIndex(el => el.uuid === uuid);

            if (index === -1 && this.isSpecialMessage(message.type)) {
              arr.push(message);
            } else {
              arr.splice(index, 1, message);

              if (arr[index].time !== message.time) {
                arr.sort((a, b) => a.time - b.time);
              }
            }

            storage.set(uid, arr);
            break;
          }
          case 'Message/UPDATE_MESSAGE_STATUS': {
            const { data, isReceiveMessage } = payload;
            const uid = isReceiveMessage ? data.from : data.to;
            const uuid = data.uuid;
            const arr = storage.get(uid) || [];

            arr.find((el, index) => {
              if (el.uuid === uuid) {
                arr.splice(index, 1, {
                  ...el,
                  hasRead: 1
                });

                return true;
              }

              return false;
            });

            storage.set(uid, arr);
            break;
          }
          default: {
            break;
          }
        }
      });
    },

    loadRecentChatList() {
      this.$store.commit('Chat/LOAD_RECENT_CHAT');
    },

    loadLocalHistoryMessage() {
      this.$store.commit(
        'Message/LOAD_HISTORY_MESSAGE',
        this.$electronStore.store
      );
    }
  }
};
</script>

<style lang="stylus">
#app {
  position: relative;
  display: flex;
  width: $app-width;
  height: $app-height;
  background: $app-bg;
}

.sidebar {
  display: flex;
  height: $app-height;
}
</style>
