import Vue from 'vue';
import Vuex from 'vuex';

const actions = {
  clearAllState({ commit }) {
    commit('Chat/RESET_STATE');
    commit('Contact/RESET_STATE');
    commit('Main/RESET_STATE');
    commit('Message/RESET_STATE');
  }
};

const modules = {};
const files = require.context('./modules', false, /\.js$/);

files.keys().forEach((key) => {
  if (key === './index.js') {
    return;
  }

  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;
});

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  modules,
  strict: process.env.NODE_ENV !== 'production'
});
