const mongoose = require('mongoose');
const UserSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, 'uid is required']
    },
    avatar: {
      type: String,
      maxlength: 500,
      default: 'http://localhost:3000/upload/default/default-user-avatar.png'
    }, // 头像
    name: String, // 姓名
    pinyin: String, // 拼音
    courtesyName: String, // 表字
    devoteFor: String, // 主要效力于
    birthAndDeath: String, // 生卒
    type: String, // 正史/虚构
    rank: String, // 排名
    gender: String, // 性别
    nativePlace: String, // 籍贯
    otherInfo: String, // 其他信息
    isOnline: Boolean // 是否在线
  },
  {
    // auto generate `createdAt` and `updatedAt` field
    timestamps: true
  }
);

UserSchema.statics = {
  async registerUser(phone) {
    // this equal to UserModel
    let user = await this.where('phone')
      .equals(phone)
      .exec();

    user = user[0];

    if (!user) {
      let len = await this.count().exec();
      let info = {
        uid: `u${10000 + len}`,
        phone: `${phone}`
      };

      user = new this(info);

      await user.save();
    }

    return user.uid;
  },
  async getUserInfo(uid) {
    let userInfo = await this.where({
      uid
    })
      .lean()
      .exec();

    userInfo = userInfo[0];

    return userInfo || {};
  }
};

module.exports = mongoose.model('User', UserSchema);
