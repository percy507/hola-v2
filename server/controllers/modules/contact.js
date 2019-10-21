module.exports = {
  'get-user-info': getUserInfo,
  'get-contacts': getContacts
};

const UserModel = require('../../models/user');
const CategoryModel = require('../../models/category');

async function getUserInfo(uid, callback) {
  const userInfo = await UserModel.getUserInfo(uid);

  if (userInfo.uid === uid) {
    callback({
      code: 0,
      data: {
        ...userInfo
      },
      message: null
    });
  } else {
    callback({
      code: 1001,
      data: null,
      message: '获取用户信息异常'
    });
  }
}

async function getContacts(uid, callback) {
  const category = await CategoryModel.getCategoryList(uid);

  callback({
    code: 0,
    data: category,
    message: null
  });
}
