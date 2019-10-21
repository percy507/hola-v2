const state = {
  currentContact: {}
};

const mutations = {
  RESET_STATE(state) {
    state.currentContact = {};
  },

  CURRENT_CONTACT(state, obj) {
    state.currentContact = obj;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
