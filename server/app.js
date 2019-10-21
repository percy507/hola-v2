const Koa = require('koa');
const koaMount = require('koa-mount');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');
const Http = require('http');
const Socket = require('socket.io');
const ss = require('socket.io-stream');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const axios = require('axios');
const bytes = require('bytes');
const config = require('./config');
const controllers = require('./controllers');
const log = require('./utils/log');
const encrypt = require('./utils/encrypt');

const app = new Koa();
const server = Http.createServer(app.callback());

const io = Socket(server, {
  origins: '*:*',
  path: '/hola',
  pingTimeout: 15000,
  pingInterval: 5000
});

// 注册服务
require('./services/generate_folder');
require('./services/file_delete');
require('./services/mongoose');

// 初始化数据
require('./initData');

// 维护一个对象，用来记录连接的用户状态
global.$userHash = {};
global.$sockets = io.sockets.sockets;
global.axios = axios;

let userHash = global.$userHash;

app.keys = ['secret key'];

app.use(
  cors({
    origin: '*'
  })
);

app.use(koaMount('/upload', koaStatic('./upload')));
app.use(koaMount('/release', koaStatic('./release')));

io.on('connection', function(socket) {
  // bind events and handlers
  Object.keys(controllers).forEach(module => {
    Object.keys(controllers[module]).forEach(key => {
      socket.on(key, controllers[module][key]);
    });
  });

  ss(socket).on('download-file', function({ stream, fileName }, callback) {
    const filePath = path.resolve(__dirname, './upload', fileName);
    const zip = zlib.createGzip();
    const encryptData = crypto.createCipheriv(
      config.COMMUNICATION_ENCRYPT_METHOD,
      config.COMMUNICATION_ENCRYPT_KEY,
      ''
    );

    if (!fs.existsSync(filePath)) {
      callback({
        code: 1,
        data: null,
        message: '下载失败，文件不存在'
      });
    } else {
      try {
        stream.on('end', () => {
          const encryptUrl = encrypt.str(`${config.SERVER}/upload/${fileName}`);

          callback({
            code: 0,
            data: {
              url: encryptUrl
            },
            message: ''
          });
        });

        fs.createReadStream(filePath)
          .pipe(zip)
          .pipe(encryptData)
          .pipe(stream);
      } catch (err) {
        callback({
          code: 1,
          data: null,
          message: err
        });
      }
    }
  });

  ss(socket).on('upload-file', function({ stream, fileName }, callback) {
    try {
      const filePath = path.resolve(__dirname, './upload', fileName);
      const unzip = zlib.createGunzip();
      const decryptData = crypto.createDecipheriv(
        config.COMMUNICATION_ENCRYPT_METHOD,
        config.COMMUNICATION_ENCRYPT_KEY,
        ''
      );

      stream.on('end', () => {
        const encryptUrl = encrypt.str(`${config.SERVER}/upload/${fileName}`);

        callback({
          code: 0,
          data: { url: encryptUrl },
          message: ''
        });
      });

      stream
        .pipe(decryptData)
        .pipe(unzip)
        .pipe(fs.createWriteStream(filePath));
    } catch (err) {
      callback({
        code: 1,
        data: null,
        message: err
      });
    }
  });

  // handle user connect，trigger at login success
  socket.on('user-connect', function(uid) {
    if (userHash[uid]) {
      const toSocketId = userHash[uid];

      socket.to(toSocketId).emit('login-another-place');
    }

    userHash[uid] = socket.id;

    log.success(`\nuser[${uid}] connected`);
    log.success(JSON.stringify(userHash, null, 2));
  });

  // handle user disconnect，trigger at logout success
  socket.on('user-disconnect', function(uid) {
    delete userHash[uid];

    log.success(`\nuser[${uid}] disconnected`);
    log.success(JSON.stringify(userHash, null, 2));
  });

  // handle unexpected disconnect，such as app process been killed
  socket.on('disconnect', function() {
    let uid = '';

    Object.keys(userHash).find(key => {
      if (userHash[key] === socket.id) {
        uid = key;
        return true;
      }
    });

    delete userHash[uid];

    log.error(`\nuser[${uid}] disconnected`);
    log.error(socket.id);
    log.success(JSON.stringify(userHash, null, 2));
  });
});

// error handling
app.on('error', (err, ctx) => {
  log.error('server error', err, ctx);
});

server.listen(3010);

log.success('\nServer: http://localhost:3010');
