const UserModel = require('../models/user');
const CategoryModel = require('../models/category');

const dataUsers = require('./data/users');
const { generateUUID } = require('../utils/utils');

init();

async function init() {
  initUser();
  initCategory();
}

// 初始化用户数据
async function initUser() {
  const userArr = await UserModel.find({}).exec();

  if (userArr.length > 0) {
    return;
  }

  await UserModel.create(dataUsers);
}

// 初始化联系人列表
async function initCategory() {
  const categoryArr = await CategoryModel.find({}).exec();
  const categoryMap = {};

  if (categoryArr.length > 0) {
    return;
  }

  dataUsers.forEach(el => {
    const data = {
      uid: el.uid,
      name: el.name,
      avatar: el.avatar,
      courtesyName: el.courtesyName
    };

    if (categoryMap[el.devoteFor]) {
      if (categoryMap[el.devoteFor][el.gender]) {
        categoryMap[el.devoteFor][el.gender].push(data);
      } else {
        categoryMap[el.devoteFor][el.gender] = [data];
      }
    } else {
      categoryMap[el.devoteFor] = {};
      categoryMap[el.devoteFor][el.gender] = [data];
    }
  });

  Object.keys(categoryMap).forEach((devoteFor, index) => {
    categoryArr[index] = {
      gid: generateUUID(),
      title: devoteFor,
      children: []
    };

    Object.keys(categoryMap[devoteFor]).forEach(gender => {
      categoryArr[index].children.push({
        gid: generateUUID(),
        title: gender,
        members: categoryMap[devoteFor][gender] || []
      });
    });
  });

  await CategoryModel.create(categoryArr);
}
