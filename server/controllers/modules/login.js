module.exports = {
  login: loginFunc,
  logout: logoutFunc
};

const decrypt = require('../../utils/decrypt');
const UserModel = require('../../models/user');

async function loginFunc(obj, callback) {
  const uid = decrypt.str(obj.uid);
  const pmd5 = decrypt.str(obj.pmd5);

  // 用户名为uid，密码为123456
  const userInfo = await UserModel.getUserInfo(uid);
  const isSuccess =
    userInfo.uid &&
    pmd5.toLocaleUpperCase() === 'E10ADC3949BA59ABBE56E057F20F883E';

  if (isSuccess) {
    callback({
      code: 0,
      data: {
        ...userInfo
      },
      message: null
    });
  } else {
    callback({
      code: 1,
      data: null,
      message: '用户名或密码不正确'
    });
  }
}

async function logoutFunc(uid, callback) {
  callback();
}
