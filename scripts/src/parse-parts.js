import fs from 'fs-extra';
import request from 'request';
import sharp from 'sharp';
import parts from '../../data/parts/bb-parts.json';

const thumbnail = (dir, title) => {
  fs.ensureDirSync(dir);
  return `./${dir}/` + title.toLowerCase().replace(/,/g, '').replace(/ /g, '_') + '.jpg';
};

// download images
(() => {
  return false;
  console.log('image download start');
  const download = (uri, filename, callback) => {
    request.head(uri, (err, res, body) => {
      // console.log('content-type:', res.headers['content-type']);
      // console.log('content-length:', res.headers['content-length']);
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  parts.map(part => {
    const fileDest = thumbnail('assets/parts', part.title);
    download('https://www.bluebrixx.com/' + part.img, fileDest, () => {
      console.log('done', fileDest);
    });
  });
  console.log('image download done');
})();

// shrink existing images to thumbs
(() => {
  const size = 10;
  console.log(`thumbs ${size} convert start `);
  parts.map(part => {
    //console.log(part.title)
    const fileSrc = thumbnail('assets/parts', part.title);
    const fileDest = thumbnail(`public/images/parts/${size}`, part.title);
    sharp(fileSrc)
      .resize(size)
      .toFile(fileDest, function (err) {
        // output.jpg is a 300 pixels wide and 200 pixels high image
        // containing a scaled and cropped version of input.jpg
        if (err !== null) {
          console.error('error', fileSrc, err);
        }
      });
  });
  console.log('thumbs convert done');
})();
