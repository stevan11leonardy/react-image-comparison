import Jimp from 'jimp';

export function getPixel(url, x, y) {
  const img = new Image();
  img.src = url;
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  return context.getImageData(x, y, 1, 1).data;
}

export function mse(pixel1, pixel2, width, height) {
  let sum = 0;

  const diff = Math.pow(pixel1[0] - pixel2[0], 2) + Math.pow(pixel1[1] - pixel2[1], 2) + Math.pow(pixel1[2] - pixel2[2], 2);
  sum += Math.sqrt(diff);

  let result = sum / (width * height);

  return result;
}


export function convertToRGBA(hex) {
  const { r, g, b, a } = Jimp.intToRGBA(hex);
  return [r, g, b, a]
}

export function checkImageValid(img1, img2) {
  if (img1.naturalWidth === img2.naturalWidth
    && img1.naturalHeight === img2.naturalHeight) {
    return true;
  }

  return false;
}