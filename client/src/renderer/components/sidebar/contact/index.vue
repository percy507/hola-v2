<template>
  <div class="menu-contact">
    <div class="search-bar">
      <div class="content">
        <input type="text"
               v-model="keyword"
               :placeholder="placeholder"
               @focus="removePlaceholder"
               @blur="setPlaceholder"
               @keydown.enter="searchFunc">
      </div>
    </div>

    <div class="menu-contact-list">
      <div v-if="!contactsData"
           class="loading">
        <loading :styleObj="{background: '#aaa'}" />
      </div>

      <div v-if="contactsData && Object.keys(contactsData).length === 0"
           class="no-data">
        暂无数据
      </div>

      <SearchResult v-else-if="!!keyword"
                    :keyword="keyword"
                    :contactsData="contactsData" />

      <contact-list v-else-if="contactsData && !keyword"
                    :groups="contactsData"
                    :members="[]" />
    </div>
  </div>
</template>

<script>
import Loading from '../../@parts/loading';
import SearchResult from './parts/search-result';
import ContactList from './parts/contact-list';

export default {
  name: 'menu-contact',
  components: {
    Loading,
    SearchResult,
    ContactList
  },
  data() {
    return {
      keyword: '',
      placeholder: '',
      contactsData: null
    };
  },
  computed: {
    uid() {
      return this.$store.state.Main.userInfo.uid;
    }
  },
  created() {
    this.setPlaceholder();
    this.getCategoryList();
  },
  methods: {
    removePlaceholder() {
      this.placeholder = '';
    },
    setPlaceholder() {
      this.placeholder = ' 搜索';
    },
    searchFunc() {
      console.log('searching...');
    },
    getCategoryList() {
      this.$socket.emit('get-contacts', this.uid, response => {
        if (response.code === 0) {
          this.contactsData = response.data;
        }
      });
    }
  }
};
</script>

<style lang="stylus">
.menu-contact {
  width: $search-bar-width + 60px;

  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: $search-bar-width + 60px;
    height: $search-bar-height;
    background: $search-bar-bg;
    -webkit-app-region: drag;

    .content {
      width: 220px;
      height: 26px;
      background: #485057;
      border-radius: 100px;
    }

    .temp-content {
      width: $search-bar-width + 60px;
      height: $search-bar-height;
      line-height: $search-bar-height;
      text-align: center;
      background: #323A43;
      font-size: 16px;
      color: #aaa;
    }

    input {
      display: block;
      width: 100%;
      height: 26px;
      padding: 0 15px;
      border: none;
      background: none;
      font-size: 12px;
      color: #aaa;
      text-align: center;
      -webkit-app-region: no-drag;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #797979;
        letter-spacing: 0.1px;
        font-family: 'icomoon';
        font-weight: 400;
      }
    }
  }

  .no-data {
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
    color: #A7B0BB;
    opacity: 0.5;
  }
}

.menu-contact-list {
  height: $app-height - $search-bar-height;
  background: $menu-content-bg;
  overflow-y: auto;

  &>.loading {
    padding-top: 30px;
    text-align: center;
  }
}
</style>
