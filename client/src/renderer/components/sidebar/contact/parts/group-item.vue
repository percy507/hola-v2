<template>
  <div class="group-item">
    <div class="group-title"
         @click="toggleContacts">
      <span v-show="!isShowContacts"
            class="icon icon-keyboard_arrow_right"></span>
      <span v-show="isShowContacts"
            class="icon icon-keyboard_arrow_down"></span>

      <span class="group-name"
            :title="groupName">{{ groupName }}</span>
    </div>

    <div v-show="isShowContacts && !groups && !members"
         class="loading">
      <loading :styleObj="{background: '#aaa'}" />
    </div>
    <contact-list v-if="isShowContacts && groups && members"
                  :key="groupObj.gid"
                  :groups="groups"
                  :members="members" />
  </div>
</template>

<script>
import Loading from '../../../@parts/loading';

export default {
  name: 'group-item',
  components: {
    Loading
  },
  props: {
    groupObj: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      isShowContacts: false,
      groups: [],
      members: []
    };
  },
  computed: {
    groupName() {
      return this.groupObj.title;
    }
  },
  beforeCreate: function() {
    this.$options.components.ContactList = require('./contact-list.vue').default;
  },
  methods: {
    toggleContacts() {
      this.isShowContacts = !this.isShowContacts;

      if (this.isShowContacts) {
        this.groups = this.groupObj.children || [];
        this.members = this.groupObj.members || [];
      }
    }
  }
};
</script>

<style lang="stylus">
.group-item {
  .contact-list {
    padding-left: 18px;
  }

  .loading {
    padding-left: 32px;
  }

  .group-title {
    display: flex;
    align-items: center;
    width: 100%;
    height: 30px;
    padding: 6px 12px;
    font-size: 12px;
    color: #999999;
    letter-spacing: 0.06px;
    cursor: pointer;

    &:hover {
      background: #424951;
    }

    .icon {
      margin-right: 6px;
      font-size: 14px;
      font-weight: bold;
    }

    .group-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
