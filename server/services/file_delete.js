const schedule = require('node-schedule');
const walk = require('walk');
const fs = require('fs');
const path = require('path');

// 时效：3天，清除策略：每天凌晨3点
const scheduleRule = '0 0 3 * * *';
const expireRule = 3 * 24 * 60 * 60 * 1000;

schedule.scheduleJob(scheduleRule, handleFile);

function handleFile() {
  const folderPath = path.resolve(__dirname, '../upload');
  const walker = walk.walk(folderPath);

  walker.on('file', function(root, fileStats, next) {
    const fileBirthTime = new Date(fileStats.birthtime).getTime();

    if (Date.now() - fileBirthTime > expireRule) {
      const filePath = path.resolve(folderPath, fileStats.name);

      fs.unlinkSync(filePath);
    }

    next();
  });

  walker.on('errors', function(root, nodeStatsArray, next) {
    next();
  });

  walker.on('end', function() {
    console.log('handle file done');
  });
}
