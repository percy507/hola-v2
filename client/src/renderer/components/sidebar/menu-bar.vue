<template>
  <div id="menu-bar">
    <div class="avatar">
      <img :src="userInfo.avatar"
           :title="userInfo.name"
           @click="showUserInfo" />
    </div>

    <div class="menu chat-main-menu">
      <router-link tag="span"
                   to="/app/chat"
                   exact-active-class="active"
                   class="icon-commenting" />
      <div class="unread-count"
           v-show="!!totalUnreadNum">
        <div v-if="totalUnreadNum > 99"
             class="unread-count-max">99+</div>
        <div v-else>{{ totalUnreadNum }}</div>
      </div>
    </div>

    <div class="menu">
      <router-link tag="span"
                   to="/app/contact"
                   exact-active-class="active"
                   class="icon-address-book" />
    </div>

    <div class="menu last-menu">
      <span class="icon-cog"
            @click="showSettingMenu" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'menu-bar',
  data() {
    return {
      menu: null,
      totalUnreadNum: 0
    };
  },
  computed: {
    uid() {
      return this.$store.state.Main.userInfo.uid;
    },
    userInfo() {
      return this.$store.state.Main.userInfo;
    },
    chatArr() {
      return this.$store.state.Chat.chatArr || [];
    }
  },
  created() {
    this.generateMenu();
    this.countUnreadNum();
  },
  watch: {
    chatArr: {
      deep: true,
      handler() {
        this.countUnreadNum();
      }
    }
  },
  methods: {
    countUnreadNum() {
      let count = 0;

      this.chatArr.forEach(chat => {
        count += chat.unreadNum || 0;
      });

      this.totalUnreadNum = count;
    },

    showUserInfo() {
      const options = {
        title: 'Hola', // for windows
        type: 'info',
        message: '当前用户',
        detail: `姓名：${this.userInfo.name}\nID：${this.userInfo.uid}`,
        buttons: ['确认']
      };

      this.$showMessageDialog(options);
    },

    generateMenu() {
      const { Menu } = this.$remote;
      const template = [
        {
          id: 1,
          type: 'normal',
          label: '开发者工具',
          click: this.showDevelopTools.bind(this)
        },
        {
          type: 'separator'
        },
        {
          id: 2,
          type: 'normal',
          label: '关于软件',
          click: this.showAboutDialog.bind(this)
        },
        {
          type: 'separator'
        },
        {
          id: 3,
          type: 'normal',
          label: '退出登录',
          click: () => {
            this.$socket.emit('user-disconnect', this.uid);
            this.$toLoginPage.call(this);
          }
        }
      ];

      this.menu = Menu.buildFromTemplate(template);
    },

    showSettingMenu(e) {
      this.menu.popup({
        x: e.x + 8,
        y: e.y - 54
      });
    },

    showDevelopTools() {
      const { webContents } = this.$win;

      if (!webContents.isDevToolsOpened()) {
        webContents.openDevTools({ mode: 'detach' });
      }
    },

    showAboutDialog() {
      const options = {
        title: 'Hola', // for windows
        type: 'info',
        message: '关于软件',
        detail: '本软件是一款简易的聊天软件，just for fun。',
        buttons: ['确认']
      };

      this.$showMessageDialog(options);
    }
  }
};
</script>

<style lang="stylus">
#menu-bar {
  position: relative;
  width: $menu-bar-width;
  height: $app-height;
  background: $menu-bar-bg;
  -webkit-app-region: drag;

  .avatar {
    width: 40px;
    height: 40px;
    margin: 30px auto 20px;
    -webkit-app-region: no-drag;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      -webkit-app-region: no-drag;

      &:hover {
        filter: brightness(1.2);
      }
    }
  }

  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    margin: 0 auto 16px;
    font-size: 20px;
    color: #525C68;
    cursor: pointer;
    -webkit-app-region: no-drag;

    span {
      transition: 0.1s;
    }

    :hover {
      color: #A7B0BB;
    }

    .active, .router-link-active {
      color: #A7B0BB;
    }
  }

  .chat-main-menu {
    position: relative;

    .unread-count {
      position: absolute;
      top: -5px;
      right: -8px;
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

  .last-menu {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    margin-bottom: 20px;
  }
}
</style>
