<template>
  <div style="position:relative;">
    <router-view></router-view>
  </div>

</template>

<script>
import { SOCKET_SERVER } from './config';

export default {
  name: 'app_client',
  data() {
    return {
      error: null
    };
  },
  created() {
    this.registerSocketConnectEvent();

    if (process.env.NODE_ENV === 'production') {
      this.checkUpdate();
    }
  },
  methods: {
    registerSocketConnectEvent() {
      this.$socket.on('connect_error', error => {
        if (!this.error) {
          this.error = error;
          alert('网络异常，请检查网络');
        }
      });

      this.$socket.on('connect', () => {
        if (this.error) {
          this.error = null;
          alert('网络已恢复');
        }
      });

      // this.$socket.on('pong', data => {
      //   console.log('pong', data);
      // });

      this.$socket.on('disconnect', reason => {
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          this.$socket.connect();
        }

        // else the socket will automatically try to reconnect
      });
    },

    async checkUpdate() {
      const fs = require('fs');
      const path = require('path');
      const { spawnSync } = require('child_process');
      const { ipcRenderer } = require('electron');

      // 在下面的目录下进行替换 app.asar
      const resourcesPath = path.resolve(__dirname, '../../../');

      const appUrl = `${SOCKET_SERVER}/release/app_update.asar`;

      const oldAppAsar = path.resolve(resourcesPath, './app.asar');
      const newAppAsar = path.resolve(resourcesPath, './app_update.asar');

      const isDownloadSuccess = await this.isDownloadSuccess(
        appUrl,
        newAppAsar
      );

      if (!isDownloadSuccess) {
        return;
      }

      const oldAppAsarMd5 = await this.$md5File(oldAppAsar);
      const newAppAsarMd5 = await this.$md5File(newAppAsar);

      if (oldAppAsarMd5 !== newAppAsarMd5) {
        const options = {
          type: 'info',
          message: '软件更新',
          detail: '软件有新版本，是否需要更新？',
          defaultId: 0,
          buttons: ['更新', '取消']
        };

        this.$showMessageDialog(options, id => {
          if (id === 0) {
            try {
              if (this.$isWindowsOS) {
                // windows 系统无法直接使用 fs.renameSync 进行文件替换，因为会提示文件被占用
                spawnSync('cmd', [
                  '/c',
                  'copy',
                  '/y',
                  '/b',
                  newAppAsar,
                  oldAppAsar,
                  '/b'
                ]);
              } else {
                fs.renameSync(newAppAsar, oldAppAsar);
              }

              ipcRenderer.send('relaunch-app');
            } catch (err) {
              alert(err);
            }
          }
        });
      }
    },

    isDownloadSuccess(url, dest) {
      return new Promise(resolve => {
        const http = require('http');
        const fs = require('fs');

        const file = fs.createWriteStream(dest);

        http
          .get(url, function(response) {
            const statusCode = response.statusCode;

            if (statusCode !== 200) {
              file.close();
              fs.unlink(dest);
              resolve(false);
              return;
            }

            file.on('finish', function() {
              file.close();
              resolve(true);
            });

            response.pipe(file);
          })
          .on('error', function() {
            file.close();
            fs.unlink(dest);
            resolve(false);
          });
      });
    }
  }
};
</script>

<style lang="stylus"></style>