import electron from 'electron';
import SocketClient from 'socket.io-client';
import Store from 'electron-store';
import modules from './modules';
import {
  SOCKET_SERVER,
  SOCKET_PATH,
  LOCAL_DB_NAME,
  LOCAL_DB_ENCRYPT_KEY
} from '../config';

function install(Vue) {
  // do not show the tips of the develop mode
  Vue.config.productionTip = false;

  /*
   * @desc: bind some useful methods to the prototype of Vue
   * @use: this.$[method]
   */
  Object.keys(modules).forEach((key) => {
    Vue.prototype[`$${key}`] = modules[key];
  });

  /*
   * @desc: judge if the platform is windows OS
   * @use: this.$isWindowsOS
   */
  Vue.prototype.$isWindowsOS = process.platform === 'win32';

  /*
   * @desc: use electron
   * @use: this.$electron
   */
  Vue.prototype.$electron = electron;

  /*
   * @desc: use remote
   * @use: this.$remote
   */
  Vue.prototype.$remote = electron.remote;

  /*
   * @desc: control current window
   * @use: this.$electron
   */
  Vue.prototype.$win = electron.remote.getCurrentWindow();

  /*
   * @desc: socket.io for communicate
   * @use: this.$socket
   */
  Vue.prototype.$socket = SocketClient(SOCKET_SERVER, {
    path: SOCKET_PATH,
    reconnection: true,
    transports: ['polling', 'websocket']
  });

  /*
   * @desc: to store some config to local file
   * @use: this.$electronStore
   */
  Vue.prototype.$electronStore = new Store({
    name: LOCAL_DB_NAME,
    fileExtension: 'json',
    encryptionKey: LOCAL_DB_ENCRYPT_KEY
  });
}

export default install;
