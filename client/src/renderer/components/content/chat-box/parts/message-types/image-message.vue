<template>
  <div class="image-message">
    <div v-if="message.content.err">
      <span>
        {{ message.content.err }}
      </span>
    </div>

    <div v-else-if="!isImageLoaded"
         class="image-loading">

      <div class="ball-triangle-path">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div v-if="message.content.percentage === '100.00'"
           class="loading-status">
        <span>图片加载中</span>
        <dotting />
      </div>

      <div v-else
           class="loading-status">
        {{ `图片上传中: ${message.content.percentage}%` }}
      </div>
    </div>

    <div v-else>
      <img :src="src"
           @click="viewImage"
           @contextmenu="showImageContextMenu">
    </div>
  </div>
</template>

<script>
import imageNotFoundSrc from '../../../../../assets/image-error.png';
import Dotting from '../../../../@parts/dotting';

export default {
  name: 'image-message',
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
      isImageLoaded: false,
      isImageNotFound: false,
      isImagePreview: false,
      src: ''
    };
  },
  created() {
    this.loadImage();
  },
  watch: {
    message: {
      deep: true,
      handler() {
        this.loadImage();
      }
    }
  },
  methods: {
    loadImage() {
      const src = this.message.content.url;

      if (!src) {
        return;
      }

      const img = new Image();

      img.onload = () => {
        this.isImageLoaded = true;
        this.src = src;
      };

      // 如果图片 404 错误，用占位图替代
      img.onerror = () => {
        this.isImageLoaded = true;
        this.isImageNotFound = true;
        this.src = imageNotFoundSrc;
      };

      img.src = src;
    },

    viewImage() {
      if (this.isImageNotFound || this.isImagePreview) {
        return;
      }

      this.isImagePreview = true;

      const { BrowserWindow } = this.$remote;
      const winURL = this.message.content.url;

      const config = {
        width: 970,
        height: 600,
        show: false,
        center: true,
        useContentSize: true,
        resizable: true,
        maximizable: true
      };

      let win = new BrowserWindow(config);

      win.once('ready-to-show', () => {
        win.show();
      });

      win.on('closed', () => {
        win = null;
        this.isImagePreview = false;
      });

      win.setMenu(null);

      win.loadURL(winURL);
    },

    showImageContextMenu(e) {
      const { url, fileName } = this.message.content;

      if (!url || this.isImageNotFound) {
        return;
      }

      const { Menu, dialog } = this.$remote;

      const templateMenu = [
        {
          label: '另存为',
          click() {
            const options = {
              title: '图片另存为',
              defaultPath: fileName
            };

            dialog.showSaveDialog(options, filePath => {
              if (!filePath) {
                return;
              }

              const http = require('http');
              const fs = require('fs');
              const stream = fs.createWriteStream(filePath);

              http.get(url, response => response.pipe(stream));
            });
          }
        }
      ];
      const ContextMenu = Menu.buildFromTemplate(templateMenu);

      e.preventDefault();
      e.stopPropagation();

      ContextMenu.popup();
    }
  }
};
</script>

<style lang="stylus">
.image-message {
  position: relative;
  cursor: default;

  img {
    display: block;
    max-width: 200px;
    max-height: 200px;
    border-radius: 2px;
  }

  .image-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;

    .loading-status {
      position: absolute;
      bottom: 20px;
      text-align: center;
    }
  }
}

@keyframes ball-triangle-path-1 {
  33% {
    transform: translate(25px, -50px);
  }

  66% {
    transform: translate(50px, 0px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes ball-triangle-path-2 {
  33% {
    transform: translate(25px, 50px);
  }

  66% {
    transform: translate(-25px, 50px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes ball-triangle-path-3 {
  33% {
    transform: translate(-50px, 0px);
  }

  66% {
    transform: translate(-25px, -50px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.ball-triangle-path {
  position: relative;
  transform: translate(-29.994px, -37.50938px);
}

.ball-triangle-path > div:nth-child(1) {
  animation-name: ball-triangle-path-1;
  animation-delay: 0;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.ball-triangle-path > div:nth-child(2) {
  animation-name: ball-triangle-path-2;
  animation-delay: 0;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.ball-triangle-path > div:nth-child(3) {
  animation-name: ball-triangle-path-3;
  animation-delay: 0;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.ball-triangle-path > div {
  animation-fill-mode: both;
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  border: 1px solid #FFF;
}

.ball-triangle-path > div:nth-of-type(1) {
  top: 50px;
}

.ball-triangle-path > div:nth-of-type(2) {
  left: 25px;
}

.ball-triangle-path > div:nth-of-type(3) {
  top: 50px;
  left: 50px;
}
</style>

