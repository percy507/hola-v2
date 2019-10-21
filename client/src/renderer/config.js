// 敏感数据，存放这里，方便 webpack-obfuscator 插件混淆加密
import { md5Str } from './vue-extend/modules/md5';
import { getLocalIpAddress } from './utils';

// 本地数据存储
export const LOCAL_DB_NAME = md5Str('hola-db');
export const LOCAL_DB_ENCRYPT_KEY = LOCAL_DB_NAME.replace('9', '0');

// 服务器相关
export const SOCKET_SERVER = `http://${getLocalIpAddress() ||
  'localhost'}:3010`;
export const SOCKET_PATH = '/hola';

// 通信加密
export const COMMUNICATION_ENCRYPT_METHOD = 'aes-128-ecb';
export const COMMUNICATION_ENCRYPT_KEY = '00qXqFtnfPdjYg5p';
