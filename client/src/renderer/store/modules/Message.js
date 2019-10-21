const state = {
  messageObj: {}
};

const getters = {
  unreadMessageObj(state) {
    const obj = {};

    Object.keys(state.messageObj).forEach(uid => {
      obj[uid] = state.messageObj[uid].filter(
        message =>
          !message.hasRead && message.from !== localStorage.getItem('uid')
      ).length;
    });

    return obj;
  }
};

const mutations = {
  RESET_STATE(state) {
    state.messageObj = {};
  },

  LOAD_HISTORY_MESSAGE(state, data) {
    state.messageObj = data;
  },

  // 新消息，包括发送出去的和接收到的，还有首次登录拉取的离线消息
  NEW_MESSAGE(state, { message, isReceiveMessage }) {
    const uid = isReceiveMessage ? message.from : message.to;

    if (state.messageObj[uid]) {
      if (!state.messageObj[uid].find(el => el.uuid === message.uuid)) {
        state.messageObj[uid].push(message);
      }
    } else {
      state.messageObj = {
        ...state.messageObj,
        [uid]: [message]
      };
    }
  },

  // 用来更新消息时间（消息发送成功后，服务器返回消息成功时间）
  // 更新文件上传消息的进度信息等
  UPDATE_MESSAGE(state, message) {
    const uid = message.to;
    const uuid = message.uuid;
    const arr = state.messageObj[uid];

    if (Array.isArray(arr)) {
      arr.find((el, index) => {
        if (el.uuid === uuid) {
          arr.splice(index, 1, message);

          if (el.time !== message.time) {
            // sort by time
            arr.sort((a, b) => a.time - b.time);
          }

          return true;
        }

        return false;
      });
    }
  },

  // 更新消息的已读未读状态
  UPDATE_MESSAGE_STATUS(state, { data, isReceiveMessage }) {
    const uid = isReceiveMessage ? data.from : data.to;
    const uuid = data.uuid;
    const arr = state.messageObj[uid];

    if (Array.isArray(arr)) {
      arr.find((el, index) => {
        if (el.uuid === uuid) {
          arr.splice(index, 1, {
            ...el,
            hasRead: 1
          });

          return true;
        }

        return false;
      });
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
