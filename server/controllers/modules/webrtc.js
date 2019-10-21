module.exports = {
  'request-video-chat': requestVideoChat,
  'refuse-video-chat': refuseVideoChat,
  'video-chat-ready': videoChatReady,
  'rtc-candidate': handleCandidate,
  'rtc-offer': handleOffer,
  'rtc-answer': handleAnswer
};

const { generateUUID } = require('../../utils/utils');

async function requestVideoChat(data) {
  const { from, to } = data;
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  if (toSocketId) {
    socket.to(toSocketId).emit('request-video-chat', {
      from
    });
  } else {
    socket.to(fromSocketId).emit('close-video-chat', {
      uuid: generateUUID(),
      from: to,
      to: from,
      type: 'video',
      content: {
        text: '对方不在线'
      }
    });
  }
}

async function refuseVideoChat(data) {
  const { from, to } = data;
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  socket.to(toSocketId).emit('refuse-video-chat', {
    from
  });
}

async function videoChatReady({ from, to }) {
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  socket.to(toSocketId).emit('video-chat-ready', {
    from
  });
}

async function handleCandidate({ from, to, candidateSdp }) {
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  console.log(`candidateSdp: ${candidateSdp}`);

  socket.to(toSocketId).emit('rtc-candidate', {
    from,
    candidateSdp
  });
}

async function handleOffer({ from, to, offerSdp }) {
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  console.log(`offerSdp: ${offerSdp}`);

  socket.to(toSocketId).emit('rtc-offer', {
    from,
    offerSdp
  });
}

async function handleAnswer({ from, to, answerSdp }) {
  const userHash = global.$userHash;
  const fromSocketId = userHash[from];
  const toSocketId = userHash[to];
  const socket = global.$sockets[fromSocketId];

  console.log(`answerSdp: ${answerSdp}`);

  socket.to(toSocketId).emit('rtc-answer', {
    from,
    answerSdp
  });
}
