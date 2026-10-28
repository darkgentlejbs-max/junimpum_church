const Jimp = require('jimp');

Jimp.read('public/images/pck-logo.png')
  .then(img => {
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If pixel is very close to white, make it transparent
      if (red > 230 && green > 230 && blue > 230) {
        this.bitmap.data[idx + 3] = 0;
      }
    });
    return img.writeAsync('public/images/pck-logo.png');
  })
  .then(() => console.log('Image background made transparent'))
  .catch(err => console.error(err));
