<template>
  <div id="login">
    <div class="drag-bar" />
    <win-menu />

    <div class="logo-title">Hola</div>

    <div class="logo-img">
      <img src="../assets/logo.png"
           alt="logo" />
    </div>

    <div class="logo-form">
      <div class="logo-form-item">
        <span class="icon-user"></span>
        <input type="text"
               autocomplete="off"
               autofocus
               placeholder="请输入账号"
               v-model="account" />
      </div>

      <div class="logo-form-item">
        <span class="icon-key"></span>
        <input type="password"
               autocomplete="off"
               placeholder="请输入密码"
               v-model="password"
               @keydown.enter="loginFunc" />
      </div>

      <div class="logo-form-item">
        <button class="btn-submit"
                :class="isFormFinished ? 'not-disabled' : 'disabled'"
                @click="loginFunc">
          登录
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import WinMenu from './@parts/win-menu';

export default {
  name: 'login',
  components: {
    WinMenu
  },
  data() {
    return {
      account: '',
      password: '',
      encryptKey: ['name', 'bindEmail', 'bindPhone']
    };
  },
  computed: {
    isFormFinished() {
      return this.account && this.password;
    }
  },
  created() {
    let isLogin = localStorage.getItem('uid');

    if (isLogin) {
      this.$toHomePage();
    } else {
      this.$toLoginPage();
    }
  },
  methods: {
    loginFunc() {
      if (this.isFormFinished) {
        this.requestLogin();
      }
    },

    requestLogin() {
      this.$socket.emit(
        'login',
        {
          uid: this.$encryptStr(this.account),
          pmd5: this.$encryptStr(this.$md5Str(this.password))
        },
        response => {
          if (response.code === 0) {
            const data = response.data;

            localStorage.setItem('uid', data.uid);

            this.$toHomePage();
          } else {
            this.$showErrorDialog({
              title: '登录失败',
              content: response.message
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="stylus">
#login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #393F46;

  .drag-bar {
    position: absolute;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 50px;
    opacity: 0;
    -webkit-app-region: drag;
  }
}

.logo-title {
  padding: 35px 0 0 30px;
  font-family: 'local-Flavors';
  font-size: 36px;
  color: #BBB;
  letter-spacing: 0.07px;
}

.logo-img {
  padding: 15px 75px 35px;
  text-align: center;

  img {
    width: 90px;
    height: 90px;
  }
}

.logo-form {
}

.logo-form-item {
  display: flex;
  width: 200px;
  margin: auto;
  padding: 6px 0 3px;
  border-bottom: 1px solid #666;

  &:last-child {
    margin-top: 5px;
    border-bottom: none;
  }

  $item-height = 26px;

  .icon-user, .icon-key {
    display: block;
    margin-right: 10px;
    height: $item-height;
    line-height: @height;
    text-align: center;
    color: #BBB;
    font-size: 18px;

    &::before {
      display: block;
      width: 16px;
      height: 16px;
    }
  }

  .icon-key {
    font-size: 16px;
  }

  input {
    display: block;
    width: 160px;
    height: $item-height;
    border: none;
    background: none;
    font-size: 14px;
    color: #9A9A9A;
    caret-color: #898989;

    &:hover {
      border: none;
      outline: none;
    }

    &:focus {
      outline: none;
    }

    &::-webkit-input-placeholder {
      font-size: 12px;
      color: #787878;
      letter-spacing: 0.2px;
    }
  }

  .btn-submit {
    display: block;
    height: 26px;
    border: none;
    font-size: 12px;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  .btn-submit {
    width: 100%;
    border-radius: 4px;
  }

  .disabled {
    color: #898989;
    background: #4C4E52;
    pointer-events: none;
  }

  .not-disabled {
    color: #AAA;
    background: #585B5F;
  }
}
</style>