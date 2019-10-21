const mongoose = require('mongoose');
const CategorySchema = mongoose.Schema(
  {
    gid: {
      type: String,
      required: [true, 'gid is required']
    },
    title: String,
    children: [Object] // 是否在线
  },
  {
    // auto generate `createdAt` and `updatedAt` field
    timestamps: true
  }
);

CategorySchema.statics = {
  async getCategoryList() {
    const categories = await this.where({})
      .lean()
      .exec();

    return categories || [];
  }
};

module.exports = mongoose.model('Category', CategorySchema);
