<template>
  <div class="user-info">
    <div v-show="isLoading"
         class="loading">
      <loading size="normal"
               :styleObj="{background: '#fff'}" />
    </div>

    <div class="info-head">
      <div class="drag-bar">
        <win-menu />
      </div>

      <div class="avatar">
        <img :src="userInfo.avatar"
             alt="avatar">
      </div>

      <div class="name">
        {{ userInfo.name }}
      </div>

      <div class="courtesyName">
        {{ userInfo.courtesyName }}
      </div>

      <div class="info-background">
        <img src="../../../../assets/info-bg.png"
             alt="background">
      </div>
    </div>

    <div class="info-details">
      <div class="detail-item"
           v-for="item in Object.keys(labelKey)"
           :key="item">
        <div class="item-title">{{ item }}</div>
        <div class="item-content">
          <span>
            {{ userInfo[labelKey[item]]  || '-' }}
          </span>
        </div>
      </div>
    </div>

    <div class="info-foot">
      <span class="icon icon-commenting"
            @click="readyToChat"></span>
    </div>
  </div>
</template>

<script>
import Loading from '../../../@parts/loading';
import WinMenu from '../../../@parts/win-menu';

export default {
  name: 'user-info',
  components: {
    Loading,
    WinMenu
  },
  props: {
    uid: {
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      userInfo: {},
      labelKey: {
        ID: 'uid',
        拼音: 'pinyin',
        性别: 'gender',
        主效力于: 'devoteFor',
        排名: 'rank',
        生卒: 'birthAndDeath',
        '正史/虚构': 'type',
        籍贯: 'nativePlace',
        其他信息: 'otherInfo'
      }
    };
  },
  watch: {
    uid() {
      this.getUserInfo();
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      const eventName = 'get-user-info';

      this.isLoading = true;

      this.$socket.emit(eventName, this.uid, response => {
        if (response.code === 0) {
          this.userInfo = response.data;

          this.$store.commit('Contact/CURRENT_CONTACT', {
            ...response.data
          });

          this.isLoading = false;
        } else {
          this.$handleResponseError(eventName, response);
        }
      });
    },

    readyToChat() {
      const { uid, name, courtesyName, avatar } = this.userInfo;

      const obj = {
        uid,
        name,
        courtesyName,
        avatar,
        unreadNum: 0
      };

      this.$store.commit('Chat/ADD_CHAT', { ...obj });
      this.$store.commit('Chat/CURRENT_CHAT', { ...obj });
      this.$router.push({
        path: '/app/chat'
      });
    }
  }
};
</script>

<style lang="stylus">
.user-info {
  position: relative;
  width: 525px;
  user-select: auto;

  .loading {
    position: absolute;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(1, 1, 1, 0.3);
  }

  .info-head {
    position: relative;
    width: 100%;
    height: 173px;
    background: #414952;
    overflow: hidden;

    &>div {
      position: absolute;
      z-index: 3;
    }

    .drag-bar {
      top: 0;
      z-index: 10;
      width: 100%;
      height: 50px;
      -webkit-app-region: drag;
    }

    .avatar {
      left: 120px;
      top: 30px;
      width: 100px;
      height: @width;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .name {
      left: 250px;
      top: 45px;
      font-size: 24px;
      color: #DDD;
      letter-spacing: 0.17px;
      word-break: break-all;
    }

    .courtesyName {
      left: 250px;
      top: 85px;
      width: 310px;
      font-size: 12px;
      color: #BBB;
      letter-spacing: 0.09px;
      line-height: 1.5;
      word-break: break-all;
    }

    .info-background {
      bottom: 0;
      z-index: 2;
      display: block;
      width: 100%;
      height: 67px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .info-details {
    width: 100%;
    height: 300px;
    overflow-y: auto;
    margin: 30px 0 2px;
    padding: 0 20px;

    .detail-item {
      display: flex;
      margin-bottom: 5px;
      font-size: 12px;
      color: #666666;
      letter-spacing: 0.17px;

      .item-title {
        flex-shrink: 0;
        width: 60px;
        font-weight: bold;
      }

      .item-content {
        width: 485px;
        word-break: break-all;

        .icon {
          margin-left: 10px;
          color: #A7B0BB;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;

          &:hover {
            color: #686868;
          }
        }
      }
    }
  }

  .info-foot {
    position: relative;
    bottom: 0;
    z-index: 2;
    width: 100%;
    height: 45px;

    .icon {
      position: absolute;
      bottom: 14px;
      z-index: 3;
      display: block;
      width: 24px;
      height: @width;
      line-height: @height;
      text-align: center;
      font-size: 20px;
      color: #A7B0BB;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        color: #686868;
      }
    }

    .icon-commenting {
      right: 20px;
    }
  }
}
</style>
