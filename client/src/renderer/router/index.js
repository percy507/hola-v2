import Vue from 'vue';
import Router from 'vue-router';

import Login from '../components/login.vue';
import Main from '../components/main.vue';

import MenuChat from '../components/sidebar/chat';
import MenuContact from '../components/sidebar/contact';

import ContentChatBox from '../components/content/chat-box';
import ContentContactInfo from '../components/content/contact-info';

import VideoChat from '../components/content/chat-box/special-pages/video-chat';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/app',
      name: 'app',
      component: Main,
      children: [
        {
          path: 'chat',
          name: 'chat',
          components: {
            menus: MenuChat,
            contents: ContentChatBox
          }
        },
        {
          path: 'contact',
          name: 'contact',
          components: {
            menus: MenuContact,
            contents: ContentContactInfo
          }
        }
      ]
    },
    {
      path: '/video-chat',
      name: 'video-chat',
      component: VideoChat
    }
  ]
});
