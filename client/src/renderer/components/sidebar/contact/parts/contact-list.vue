<template>
  <div class="contact-list">
    <group-item v-for="item in tempGroups"
                :key="item.gid"
                :groupObj="item" />

    <user-item v-for="item in tempMembers"
               :key="item.uid"
               :userObj="item" />
  </div>
</template>

<script>
import GroupItem from './group-item';
import UserItem from './user-item';

export default {
  name: 'contact-list',
  components: {
    GroupItem,
    UserItem
  },
  props: {
    groups: {
      required: true,
      type: Array
    },
    members: {
      required: true,
      type: Array
    }
  },
  data() {
    return {};
  },
  computed: {
    tempMembers() {
      return this.members || [];
    },
    tempGroups() {
      return this.groups || [];
    }
  },
  methods: {}
};
</script>

<style lang="stylus"></style>
