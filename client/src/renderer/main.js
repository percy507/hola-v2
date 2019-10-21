import Vue from 'vue';

import VueExtend from './vue-extend';

import App from './app';
import router from './router';
import store from './store';

import './services';

import './styles/style.styl';

Vue.use(VueExtend);

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
