<template>
  <div class="contact-list">
    <div v-if="contactsData && Object.keys(contactsData).length === 0"
         class="no-data">
      暂无数据
    </div>

    <user-item v-for="item in tempMembers"
               :key="item.uid"
               filterMode
               :userObj="item" />
  </div>
</template>

<script>
import UserItem from './user-item';

export default {
  name: 'search-result',
  components: {
    UserItem
  },
  props: {
    keyword: {
      required: true,
      type: String
    },
    contactsData: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      members: []
    };
  },
  computed: {
    tempMembers() {
      return this.members || [];
    }
  },
  created() {
    this.filterMembers(this.contactsData);
  },
  methods: {
    filterMembers(arr) {
      if (Array.isArray(arr)) {
        arr.forEach(el => {
          if (Array.isArray(el.children)) {
            this.filterMembers(el.children);
          } else if (Array.isArray(el.members)) {
            this.members.push(
              ...el.members.filter(member => {
                return (
                  member.name.includes(this.keyword) ||
                  member.courtesyName.includes(this.keyword)
                );
              })
            );
          }
        });
      }
    }
  }
};
</script>

<style lang="stylus"></style>
