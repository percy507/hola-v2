<template>
  <div class="file-message">
    <div class="icon icon-file-text2" />

    <div v-if="message.content.err"
         class="file-message__content-uploading">
      <span>
        {{ message.content.err }}
      </span>
    </div>

    <div class="file-message__content">
      <div class="fmc-filename">{{message.content.fileName}}</div>
      <div class="fmc-filesize">
        <span>{{message.content.fileSize}}</span>

        <span v-if="isDownloading">{{ `文件下载中: ${downloadProgress}%` }}</span>
        <span v-else-if="message.content.percentage === '100.00'"
              class="download-file"
              @click="showSaveDialog">点击下载</span>
        <span v-else>{{ `文件上传中: ${message.content.percentage}%` }}</span>
      </div>
    </div>

    <!-- <div v-else-if="message.content.percentage === '0.00'"
         class="file-message__content-uploading">
      <span>
        {{ `计算文件 MD5 中` }}
        <dotting />
      </span>
    </div> -->
  </div>
</template>

<script>
import {
  COMMUNICATION_ENCRYPT_METHOD,
  COMMUNICATION_ENCRYPT_KEY
} from '../../../../../config';
import Dotting from '../../../../@parts/dotting';

export default {
  name: 'file-message',
  components: {
    Dotting
  },
  props: {
    message: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      isDownloading: false,
      downloadProgress: 0
    };
  },
  methods: {
    showSaveDialog() {
      const dialog = this.$remote.dialog;
      const options = {
        title: '下载文件',
        defaultPath: this.message.content.fileName
      };

      dialog.showSaveDialog(options, filePath => {
        if (!filePath) {
          return;
        }

        const fs = require('fs');
        const ss = require('socket.io-stream');
        const progress = require('progress-stream');
        const bytes = require('bytes');
        const zlib = require('zlib');
        const crypto = require('crypto');

        const socket = this.$socket;
        const stream = ss.createStream();
        const unzip = zlib.createGunzip();
        const decryptData = crypto.createDecipheriv(
          COMMUNICATION_ENCRYPT_METHOD,
          COMMUNICATION_ENCRYPT_KEY,
          ''
        );
        const { fileName, fileSize } = this.message.content;
        const ps = progress({ length: bytes(fileSize), time: 200 }); // ms

        const data = {
          stream,
          fileName
        };

        this.isDownloading = true;

        ps.on('progress', p => {
          this.downloadProgress = p.percentage.toFixed(2);
        });

        ss(socket).emit('download-file', data, response => {
          if (response.code === 0) {
            this.newNotification({
              title: '下载成功',
              body: `保存于: ${filePath}`,
              filePath
            });
          } else {
            this.newNotification({
              title: '下载失败'
            });

            fs.unlink(filePath);
          }

          this.$nextTick(() => {
            this.isDownloading = false;
          });
        });

        stream
          .pipe(decryptData)
          .pipe(unzip)
          .pipe(ps)
          .pipe(fs.createWriteStream(filePath));
      });
    },

    newNotification(options) {
      const { shell } = require('electron');

      const noti = new window.Notification(options.title, {
        body: options.body
      });

      noti.onclick = () => {
        shell.showItemInFolder(options.filePath);
      };
    }
  }
};
</script>

<style lang="stylus">
.file-message {
  display: flex;
  width: 260px;
  height: 60px;
  padding: 2px 0;

  .icon-file-text2 {
    width: 60px;
    margin-right: 10px;
    font-size: 60px;
  }
}

.file-message__content {
  width: 100%;
  padding-right: 4px;

  &-uploading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-right: 4px;
  }

  .fmc-filename {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 40px;
    line-height: 1.6;
  }

  .fmc-filesize {
    display: flex;
    justify-content: space-between;

    span {
      opacity: 0.7;
    }

    .download-file {
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>

