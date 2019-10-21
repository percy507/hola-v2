const state = {
  userInfo: {}
};

const mutations = {
  RESET_STATE(state) {
    state.userInfo = {};
  },

  SET_USERINFO(state, payload) {
    state.userInfo = payload;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
