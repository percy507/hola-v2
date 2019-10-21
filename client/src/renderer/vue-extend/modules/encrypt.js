import aes from './aes';

// 加密字符串
function encryptStr(str) {
  return aes.encrypt(str);
}

// 按指定key，加密对象
function encryptObj(obj, encryptKey = []) {
  const tempObj = Object.assign({}, obj);

  Object.keys(tempObj).forEach((key) => {
    if (encryptKey.includes(key)) {
      tempObj[key] = tempObj[key] && aes.encrypt(tempObj[key]);
    }
  });

  return tempObj;
}

// 按指定key，加密对象数组 [{}, {}]
function encryptArr(arr, encryptKey = []) {
  const tempArr = [];

  if (!Array.isArray(arr)) {
    return tempArr;
  }

  arr.forEach((item) => {
    let el = Object.assign({}, item.map);

    Object.keys(el).forEach((key) => {
      if (encryptKey.includes(key)) {
        el[key] = aes.encrypt(el[key]);
      }
    });

    tempArr.push(el);
  });

  return tempArr;
}

// 加密消息
function encryptMessage(obj) {
  const tempObj = Object.assign({}, obj);
  const encryptKey = ['from', 'to', 'content'];

  encryptKey.forEach((key) => {
    if (key !== 'content') {
      tempObj[key] = aes.encrypt(tempObj[key]);
    } else {
      tempObj[key] = aes.encrypt(JSON.stringify(tempObj[key]));
    }
  });

  return tempObj;
}

export default {
  encryptStr,
  encryptObj,
  encryptArr,
  encryptMessage
};
