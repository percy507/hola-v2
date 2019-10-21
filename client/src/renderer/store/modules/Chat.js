const CHAT_ARR_KEY = 'chatArr';

const state = {
  currentChat: {},
  chatArr: [],
  isShowSidebar: false
};

const mutations = {
  RESET_STATE(state) {
    state.currentChat = {};
    state.chatArr = [];
    state.isShowSidebar = false;
  },

  LOAD_RECENT_CHAT(state) {
    state.chatArr = JSON.parse(localStorage.getItem(CHAT_ARR_KEY)) || [];
  },

  CURRENT_CHAT(state, obj) {
    state.currentChat = obj;
  },

  UPDATE_CHAT_ARR_STATUS(state, unreadMessageObj) {
    const unreadUidArr = Object.keys(unreadMessageObj);

    if (unreadUidArr.length === 0) {
      return;
    }

    state.chatArr.forEach((chat, index) => {
      if (unreadUidArr.includes(chat.uid)) {
        state.chatArr.splice(index, 1, {
          ...chat,
          unreadNum: unreadMessageObj[chat.uid]
        });
      }
    });

    localStorage.setItem(CHAT_ARR_KEY, JSON.stringify(state.chatArr));
  },

  ADD_CHAT(state, chatObj) {
    const chatArr = JSON.parse(localStorage.getItem(CHAT_ARR_KEY)) || [];
    const _uid = chatObj.uid;

    let isUserExist = false;

    chatArr.forEach((el) => {
      if (el.uid === _uid) {
        isUserExist = true;
      }
    });

    if (!isUserExist) {
      chatArr.push(chatObj);
    }

    state.chatArr = chatArr;
    localStorage.setItem(CHAT_ARR_KEY, JSON.stringify(chatArr));
  },

  DELETE_CHAT(state, uid) {
    const chatArr = JSON.parse(localStorage.getItem(CHAT_ARR_KEY)) || [];

    let deleteIndex;

    chatArr.find((el, index) => {
      if (el.uid === uid) {
        deleteIndex = index;
        return true;
      }
      return false;
    });

    // delete the target chat
    if (deleteIndex >= 0) {
      chatArr.splice(deleteIndex, 1);
    }

    state.chatArr = chatArr;
    localStorage.setItem(CHAT_ARR_KEY, JSON.stringify(chatArr));
  },

  SHOW_CHAT_BOX_SIDEBAR(state) {
    state.isShowSidebar = true;
  },

  HIDE_CHAT_BOX_SIDEBAR(state) {
    state.isShowSidebar = false;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
