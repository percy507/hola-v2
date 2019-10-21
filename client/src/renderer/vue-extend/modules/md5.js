import crypto from 'crypto';
import fs from 'fs';

export function md5Str(data) {
  return crypto
    .createHash('md5')
    .update(data)
    .digest('hex')
    .toUpperCase();
}

export function md5File(filePath) {
  return new Promise((reslove) => {
    const md5sum = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);

    stream.on('data', function(chunk) {
      md5sum.update(chunk);
    });

    stream.on('end', function() {
      reslove(md5sum.digest('hex'));
    });
  });
}

// export function md5AsarFile(filePath) {
//   return new Promise((reslove) => {
//     const md5sum = crypto.createHash('md5');
//     const stream = ofs.createReadStream(filePath);

//     stream.on('data', function(chunk) {
//       md5sum.update(chunk);
//     });

//     stream.on('end', function() {
//       reslove(md5sum.digest('hex'));
//     });
//   });
// }

export default {
  md5Str,
  md5File
};
