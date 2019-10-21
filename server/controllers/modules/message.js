module.exports = {
  message: receiveMessage,
  'message-has-read': markMessageAsRead,
  'receive-offline-message': receiveOfflineMessage
};

const path = require('path');
const MessageModel = require('../../models/message');
const OfflineMessageModel = require('../../models/offline-message');

async function receiveMessage(message, callback) {
  const userHash = global.$userHash;
  const { from, to } = message;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  // set message time only on server
  message.time = Date.now();
  message.hasRead = 0;

  // save message to DB[messages]
  await MessageModel.saveMessage(message);

  // if user online
  if (toSocketId) {
    // dispatch message
    socket.to(toSocketId).send(message);

    callback({
      code: 0,
      data: {
        uuid: message.uuid,
        time: message.time
      },
      message: null
    });
  } else {
    // save message to DB[offlineMessages]
    await OfflineMessageModel.saveMessage(message);

    callback({
      code: 0,
      data: {
        uuid: message.uuid,
        time: message.time
      },
      message: null
    });
  }
}

async function receiveOfflineMessage(uid, callback) {
  const messages = await OfflineMessageModel.getMessagesByUserId(uid);

  callback({
    code: 0,
    data: Array.isArray(messages) ? messages : [],
    message: null
  });
}

async function markMessageAsRead(payload, callback) {
  const userHash = global.$userHash;
  const { from, to } = payload;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  MessageModel.updateMessageStatus(payload.uuid);

  // dispatch message
  socket.to(toSocketId).emit('message-has-read', payload);
}
