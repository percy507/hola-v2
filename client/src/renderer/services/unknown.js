// stop drag file to the app
document.addEventListener('dragover', function(event) {
  event.preventDefault();
});

document.addEventListener('drop', function(event) {
  event.preventDefault();
});

// 禁止 fs 模块将 asar 文件视为虚拟文件夹
process.noAsar = true;
