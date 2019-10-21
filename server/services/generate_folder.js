const fs = require('fs');
const path = require('path');

// 生成文件上传目录
if (!fs.existsSync(path.resolve(__dirname, '../upload'))) {
  fs.mkdirSync(path.resolve(__dirname, '../upload'));
}

// 生成软件release目录
if (!fs.existsSync(path.resolve(__dirname, '../release'))) {
  fs.mkdirSync(path.resolve(__dirname, '../release'));
}
