<template>
  <keep-alive>
    <component :is="currentComponent"
               :uid="currentContact.uid"></component>
  </keep-alive>
</template>

<script>
import DefaultPage from '../_parts/default-page';
import UserInfo from './parts/user-info';

export default {
  name: 'contact-info',
  components: {
    DefaultPage,
    UserInfo
  },
  data() {
    return {
      currentComponent: 'DefaultPage'
    };
  },
  computed: {
    currentContact() {
      return this.$store.state.Contact.currentContact;
    }
  },
  watch: {
    currentContact() {
      if (!this.currentContact.uid) {
        this.currentComponent = 'DefaultPage';
        return;
      }

      this.currentComponent = 'UserInfo';
    }
  }
};
</script>

<style lang="stylus">
</style>
