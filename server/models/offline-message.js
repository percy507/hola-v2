const mongoose = require('mongoose');
const OfflineMessageSchema = mongoose.Schema({
  uuid: {
    type: String,
    required: [true, 'message-private uuid is required']
  },
  from: {
    type: String,
    required: [true, 'message-private from is required']
  },
  to: {
    type: String,
    required: [true, 'message-private to is required']
  },
  type: {
    type: String,
    required: [true, 'message-private type is required']
  },
  hasRead: {
    type: Number,
    required: [true, 'message-hasRead type is required']
  },
  time: mongoose.Schema.Types.Mixed,
  content: mongoose.Schema.Types.Mixed
});

OfflineMessageSchema.statics = {
  async saveMessage(message) {
    let newMessage = new this(message);

    await newMessage.save();
  },

  async getMessagesByUserId(uid) {
    const messages = await this.where({
      to: uid
    }).exec();

    await this.deleteMany({
      to: uid
    }).exec();

    return messages;
  }
};

module.exports = mongoose.model('OfflineMessage', OfflineMessageSchema);
