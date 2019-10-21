const aes = require('./aes');

// 解密字符串
function str(str) {
  return aes.decrypt(str);
}

// 按指定key，解密对象
function obj(obj, encryptKey = []) {
  const tempObj = Object.assign({}, obj);

  Object.keys(tempObj).forEach((key) => {
    if (encryptKey.includes(key)) {
      tempObj[key] = tempObj[key] && aes.decrypt(tempObj[key]);
    }
  });

  return tempObj;
}

// 按指定key，解密对象数组 [{}, {}]
function arr(arr, encryptKey = []) {
  const tempArr = [];

  if (!Array.isArray(arr)) {
    return tempArr;
  }

  arr.forEach((item) => {
    let el = Object.assign({}, item.map);

    Object.keys(el).forEach((key) => {
      if (encryptKey.includes(key)) {
        el[key] = aes.decrypt(el[key]);
      }
    });

    tempArr.push(el);
  });

  return tempArr;
}

// 解密消息
function message(obj) {
  const tempObj = Object.assign({}, obj);
  const encryptKey = ['from', 'to', 'content'];

  encryptKey.forEach((key) => {
    if (key !== 'content') {
      tempObj[key] = aes.decrypt(tempObj[key]);
    } else {
      tempObj[key] = JSON.parse(aes.decrypt(tempObj[key]));
    }
  });

  return tempObj;
}

module.exports = {
  str,
  obj,
  arr,
  message
};
