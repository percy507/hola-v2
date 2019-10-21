<template>
  <div class="chat-box"
       @click="handleClickChatBox">
    <div v-if="currentChat.uid">
      <div class="chat-box-head">
        <win-menu />
        <span class="title">{{ currentChat.name }}</span>
        <span class="sub-title">{{ currentChat.courtesyName }}</span>

        <!-- <span class="icon icon-user"
              @click.stop="showSidebar"></span> -->
      </div>

      <div class="chat-box-content"
           ref="chatBoxContent">
        <message-item v-for="item in messageArr"
                      :key="item.uuid"
                      :message="item"></message-item>
      </div>

      <div class="chat-box-foot">
        <div>
          <div class="foot-tools">
            <!-- <span class="icon icon-happy2"
                  @click="openFaceDialog"></span> -->

            <span class="icon icon-photo_size_select_actual"
                  @click="openImageDialog"></span>

            <span class="icon icon-folder"
                  @click="openFileDialog"></span>

            <!-- <span class="icon icon-microphone"
                  @click="openVoiceChatDialog"></span> -->

            <!-- <span class="icon icon-video-camera"
                  @click="openVideoChatDialog('call')"></span> -->
          </div>

          <div class="foot-input">
            <textarea v-model="message"
                      ref="textarea"
                      placeholder="请输入消息"
                      @compositionstart="detectCompositionInput(true)"
                      @compositionend="detectCompositionInput(false)"
                      @keydown.enter="sendTextMessage($event)"></textarea>
          </div>
        </div>
        <div>
          <span class="icon icon-send-o"
                @click="sendTextMessage"></span>
        </div>
      </div>

      <!-- <div class="chat-box-sidebar"
           :class="{ 'show-sidebar': isShowSidebar }"
           @click.stop>
        <div class="sidebar-head">
          <span class="sidebar-head__title">
            <span>{{ currentChat.name }}</span>
          </span>
          <span class="icon icon-close"
                @click.stop="hideSidebar"></span>
        </div>

        <div class="sidebar-content">
          {{currentChat}}
        </div>
      </div> -->
    </div>

    <div v-else>
      <default-page></default-page>
    </div>
  </div>
</template>

<script>
import {
  COMMUNICATION_ENCRYPT_METHOD,
  COMMUNICATION_ENCRYPT_KEY
} from '../../../config';
import WinMenu from '../../@parts/win-menu';
import DefaultPage from '../_parts/default-page';
import MessageItem from './parts/message-item';

export default {
  name: 'chat-box',
  components: {
    WinMenu,
    DefaultPage,
    MessageItem
  },
  data() {
    return {
      contactInfo: {},
      isCompositionInput: false,
      message: '',
      lastMessageArrLength: 0
    };
  },
  computed: {
    uid() {
      return this.$store.state.Main.userInfo.uid;
    },
    userInfo() {
      return this.$store.state.Main.userInfo;
    },
    currentChat() {
      return this.$store.state.Chat.currentChat;
    },
    isShowSidebar() {
      return this.$store.state.Chat.isShowSidebar;
    },
    messageArr() {
      return this.$store.state.Message.messageObj[this.currentChat.uid] || [];
    },
    messageArrLength() {
      return (this.messageArr || []).length;
    }
  },
  watch: {
    currentChat() {
      this.$nextTick(() => {
        if (this.$refs.textarea) {
          this.message = '';
          this.$refs.textarea.focus();

          this.markMessageAsRead();
          this.scrollToBoxBottom();
        }
      });
    },
    messageArrLength() {
      // 当有新消息时，聊天区域自动滚动到底部
      this.scrollToBoxBottom();

      this.$nextTick(() => {
        if (
          this.$win.isVisible() &&
          this.$refs.textarea &&
          this.$isElementInViewport(this.$refs.textarea)
        ) {
          this.markMessageAsRead();
        }
      });
    }
  },
  created() {
    this.onRequestVideoChat();
    this.onFinishVideoChat();
  },
  activated() {
    this.markMessageAsRead();
    this.scrollToBoxBottom();
  },
  deactivated() {
    // this.hideSidebar();
  },
  methods: {
    onRequestVideoChat() {
      this.$socket.on('request-video-chat', ({ from }) => {
        this.$showMessageDialog(
          {
            type: 'question',
            buttons: ['接受', '拒绝'],
            defaultId: 0,
            message: `收到来自${from}的视频聊天`
          },
          id => {
            if (id === 0) {
              // 接受视频聊天
              this.acceptVideoChat();
            } else {
              // 拒绝视频聊天
              this.refuseVideoChat(from);
            }
          }
        );
      });
    },

    onFinishVideoChat() {
      this.$socket.on('refuse-video-chat', ({ from }) => {
        if (this.currentChat.uid === from) {
          this.videoWindow.close();
        }
      });

      this.$socket.on('close-video-chat', ({ from }) => {
        if (this.currentChat.uid === from) {
          this.videoWindow.close();
        }
      });
    },

    handleClickChatBox() {
      // this.hideSidebar();
      this.markMessageAsRead();
    },

    showSidebar() {
      this.$store.commit('Chat/SHOW_CHAT_BOX_SIDEBAR');
    },

    hideSidebar() {
      this.$store.commit('Chat/HIDE_CHAT_BOX_SIDEBAR');
    },

    detectCompositionInput(value) {
      this.isCompositionInput = value;
    },

    scrollToBoxBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatBoxContent) {
          this.$refs.chatBoxContent.scrollTop = this.$refs.chatBoxContent.scrollHeight;
        }
      });
    },

    openFaceDialog() {
      // do something
      alert('待开发');
    },

    openImageDialog() {
      const dialog = this.$remote.dialog;
      const options = {
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'gif']
          }
        ]
      };

      dialog.showOpenDialog(options, filePaths => {
        if (filePaths && filePaths.length) {
          filePaths.forEach(path => {
            if (path) {
              this.sendImage(path);
            }
          });
        }
      });
    },

    openFileDialog() {
      const dialog = this.$remote.dialog;
      const options = {
        properties: ['openFile', 'multiSelections', 'treatPackageAsDirectory']
      };

      dialog.showOpenDialog(options, filePaths => {
        if (filePaths && filePaths.length) {
          filePaths.forEach(path => {
            if (path) {
              this.sendFile(path);
            }
          });
        }
      });
    },

    openVoiceChatDialog() {
      // do something
      alert('待开发');
    },

    openVideoChatDialog(type) {
      const toUid = this.currentChat.uid;
      const { BrowserWindow } = this.$electron.remote;
      const devServer = `http://localhost:9080#/video-chat?to=${toUid}&type=${type}`;
      const winURL =
        process.env.NODE_ENV === 'development'
          ? devServer
          : `file://${__dirname}/index.html#/video-chat?to=${toUid}&type=${type}`;

      const config = {
        width: 600,
        height: 360,
        minWidth: 600,
        minHeight: 360,
        resizeable: false,
        useContentSize: true,
        titleBarStyle: 'hidden',
        webPreferences: {
          webSecurity: false
        }
      };

      this.videoWindow = new BrowserWindow(config);

      this.videoWindow.once('ready-to-show', () => {
        this.videoWindow.show();
      });

      this.videoWindow.on('closed', () => {
        if (type === 'call') {
          let message = {
            uuid: this.$generateUUID(),
            from: this.uid,
            to: toUid,
            type: 'video',
            content: {
              text: '视频通话已结束'
            }
          };

          this.sendMessage(message);
        }

        this.videoWindow = null;
      });

      // force resize window with a constant ratio
      this.videoWindow.setAspectRatio(600 / 360);
      this.videoWindow.loadURL(winURL);
    },

    acceptVideoChat() {
      this.openVideoChatDialog('pickUp');
    },

    refuseVideoChat(toUid) {
      let message = {
        uuid: this.$generateUUID(),
        from: this.uid,
        to: toUid,
        type: 'video',
        content: {
          text: '对方已拒绝'
        }
      };

      this.sendMessage(message);

      this.$socket.emit('refuse-video-chat', {
        from: this.uid,
        to: toUid
      });
    },

    sendImage(path) {
      this.uploadFile(path, 'image');
    },

    sendFile(path) {
      this.uploadFile(path, 'file');
    },

    uploadFile(filePath, messageType) {
      const fs = require('fs');
      const path = require('path');
      const zlib = require('zlib');
      const crypto = require('crypto');
      const ss = require('socket.io-stream');
      const progress = require('progress-stream');
      const bytes = require('bytes');

      const stat = fs.statSync(filePath);
      const socket = this.$socket;
      const stream = ss.createStream();
      const zip = zlib.createGzip();
      const encryptData = crypto.createCipheriv(
        COMMUNICATION_ENCRYPT_METHOD,
        COMMUNICATION_ENCRYPT_KEY,
        ''
      );
      const ps = progress({ length: stat.size, time: 200 }); // ms

      const uuid = this.$generateUUID();
      const fileObj = path.parse(filePath);

      const baseMessage = {
        uuid,
        from: this.uid,
        to: this.currentChat.uid,
        type: messageType,
        time: Date.now()
      };

      this.handleUploadMessage({
        ...baseMessage,
        content: {
          percentage: '0.00'
        }
      });

      // const fileMd5 = await this.$md5File(filePath);
      const fileName = `${fileObj.name}${fileObj.ext}`;
      const fileSize = bytes(stat.size);

      const data = {
        stream,
        fileName
      };

      ps.on('progress', p => {
        const percentage = p.percentage.toFixed(2);

        this.handleUploadMessage({
          ...baseMessage,
          content: {
            percentage,
            fileName,
            fileSize
          }
        });
      });

      ss(socket).emit('upload-file', data, response => {
        if (response.code === 0) {
          const url = this.$decryptStr(response.data.url);
          const message = {
            ...baseMessage,
            content: {
              percentage: '100.00',
              url,
              fileName,
              fileSize
            }
          };

          this.handleUploadMessage(message);
          this.sendMessage(message);
        } else {
          this.handleUploadMessage({
            ...baseMessage,
            content: {
              err: response.message || '文件上传失败'
            }
          });
        }
      });

      fs.createReadStream(filePath)
        .pipe(zip)
        .pipe(encryptData)
        .pipe(ps)
        .pipe(stream);
    },

    handleUploadMessage(message) {
      const uid = message.to;
      // arr 不要使用 this.messageArr，因为切换聊天窗口后，this.messageArr会发生变化
      const arr = this.$store.state.Message.messageObj[uid] || [];
      const index = arr.findIndex(item => item.uuid === message.uuid);

      if (index === -1) {
        this.newMessage(message);
      } else {
        this.updateMessage(message);
      }
    },

    sendTextMessage(e) {
      if (e.shiftKey || this.isCompositionInput) {
        // enter+shift  next line
        return;
      }
      e.preventDefault();

      if (!this.message.replace(/\s/g, '')) {
        this.message = '';
        return;
      }

      const message = {
        uuid: this.$generateUUID(),
        from: this.uid,
        to: this.currentChat.uid,
        type: 'text',
        content: {
          text: this.message
        }
      };

      this.newMessage(message);
      this.sendMessage(message);

      this.message = '';
    },

    markMessageAsRead() {
      this.$electron.ipcRenderer.send('has-read-new-message');

      if (Array.isArray(this.messageArr)) {
        this.messageArr.forEach(message => {
          if (
            !message.hasRead &&
            message.from === this.currentChat.uid &&
            location.hash === '#/app/chat'
          ) {
            this.$socket.emit('message-has-read', {
              uuid: message.uuid,
              from: message.to,
              to: message.from
            });

            this.$store.commit('Message/UPDATE_MESSAGE_STATUS', {
              isReceiveMessage: false,
              data: {
                uuid: message.uuid,
                from: message.to,
                to: message.from
              }
            });
          }
        });
      }
    },

    newMessage(message) {
      this.$store.commit('Message/NEW_MESSAGE', {
        isReceiveMessage: false,
        message: {
          ...message,
          time: Date.now(),
          hasRead: 0
        }
      });
    },

    updateMessage(message) {
      this.$nextTick(() => {
        this.$store.commit('Message/UPDATE_MESSAGE', {
          ...message,
          hasRead: 0
        });
      });
    },

    sendMessage(message) {
      this.$socket.send(message, response => {
        if (response.code === 0) {
          const { time } = response.data;

          // 更新消息时间（时间从服务器获取）
          this.updateMessage({
            ...message,
            time
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus">
icon-hover =
  color: #A8B0BA;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    color: #666;
  }

.chat-box {
  position: relative;
  width: $content-width;
  height: $app-height;
}

.chat-box-head {
  position: relative;
  width: 100%;
  height: $search-bar-height;
  padding: 0 20px;
  border-bottom: 1px solid #DDD;
  line-height: @height;
  -webkit-app-region: drag;

  .title {
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.09px;
    -webkit-user-select: auto;
    -webkit-app-region: no-drag;
  }

  .sub-title {
    padding-left: 10px;
    font-size: 10px;
    color: #898989;
    letter-spacing: 0.09px;
    -webkit-user-select: auto;
    -webkit-app-region: no-drag;
  }

  .icon-user {
    position: absolute;
    top: 0;
    right: 20px;
    z-index: 2;
    line-height: @height;
    {icon-hover};
  }
}

.chat-box-content {
  width: 100%;
  height: 390px;
  padding: 12px 20px;
  overflow-y: auto;
}

.chat-box-foot {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 110px;
  padding: 9px 20px 10px;
  border-top: 1px solid #DDD;

  .foot-tools {
    display: flex;
    width: 490px;
    margin-bottom: 12px;

    .icon {
      display: block;
      width: 18px;
      height: @width;
      margin-right: 12px;
      line-height: @height;
      font-size: @height;
      text-align: center;
      {icon-hover};
    }

    .icon-happy2 {
      transform: scale(0.92);
    }
  }

  .foot-input {
    width: 490px;
    height: 60px;

    textarea {
      display: block;
      width: 100%;
      height: 60px;
      border: none;
      border-radius: 4px;
      resize: none;
      background: none;
      font-size: 14px;
      color: #666;
      letter-spacing: 0.07px;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #DDD;
        letter-spacing: 0.1px;
        font-weight: 200;
      }
    }
  }

  .icon-send-o {
    line-height: 90px;
    font-size: 35px;
    {icon-hover};
  }
}

.chat-box-sidebar {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  width: 240px;
  height: 550px;
  background: #FFFFFF;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: 0.2s;

  &.show-sidebar {
    transform: translateX(0);
  }

  .sidebar-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #DDDDDD;

    &__title {
      font-size: 16px;
      color: #666666;
      letter-spacing: 0.04px;
    }

    .icon-close {
      font-size: 18px;
      color: #999999;
      cursor: pointer;
    }
  }

  .sidebar-content {
    height: 500px;
    overflow: auto;
  }
}
</style>
