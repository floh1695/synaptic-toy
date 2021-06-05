import { PNGWithMetadata } from 'pngjs';

export type Pixel = {
  red: number,
  green: number,
  blue: number,
  alpha: number
};

export type PixelMatrix = Pixel[][];

export const makePixel = (
  red: number,
  green: number,
  blue: number,
  alpha: number
): Pixel => ({ red, green, blue, alpha });

export const pngToPixelMatrix = (png: PNGWithMetadata): PixelMatrix => {
  const { height, width, data } = png;
  const matrix = [];
  for (let y: number = 0; y < height; y += 1) {
    const row = [];
    for (let x: number = 0; x < width; x += 1) {
      const id = ((width * x) + y) * 4;
      const pixel = makePixel(
        data[id],
        data[id + 1],
        data[id + 2],
        data[id + 3]
      );

      row.push(pixel);
    }

    matrix.push(row);
  }

  return matrix;
};

export const printPixelMatrix = (matrix: PixelMatrix): void => {
  matrix.forEach(row => {
    const alphaHexes = row.map(p => {
      const simple = p.alpha.toString(16);
      const full = simple.length === 1
        ? `0${simple}`
        : simple;

      return full;
    });

    console.log(alphaHexes.join(' '))
  })
};