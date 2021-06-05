import * as fs from 'fs';
import { PNG, PNGWithMetadata } from 'pngjs';

const print = <A extends any>(x: A) => console.log(x);

const joinPath = (prependee: string, appendee: string): string =>
  [prependee, appendee].join('/');
const joinPathC = (prependee: string) => (appendee: string): string =>
  joinPath(prependee, appendee);

const mapC = <A, B>(f: (a: A) => B) => (list: A[]) => list.map(f);
const forEachC = <A>(f: (a: A) => void) => (list: A[]): void => list.forEach(f);

const tap = <A>(f: (a: A) => void) => (a: A): A => {
  f(a);
  return a;
};

type TestCase = {
  inFileName: string,
  outFileName: string
};

const inFileName = 'in.png';
const outFileName = 'out.png';
const dirNameToTestCase = (dirName: string): TestCase => ({
  inFileName: joinPath(dirName, inFileName),
  outFileName: joinPath(dirName, outFileName)
});

const getTests = async (suiteName: string): Promise<TestCase[]> => {
  const dirName = `./data/${suiteName}`;
  const prependDirName = joinPathC(dirName);
  return fs.promises
    .readdir(dirName)
    .catch(error => console.log(`Error while reading suite: ${error}`))
    .then(mapC(prependDirName))
    .then(mapC(dirNameToTestCase));
};

type Pixel = {
  red: number,
  green: number,
  blue: number,
  alpha: number
};
const makePixel = (
  red: number,
  green: number,
  blue: number,
  alpha: number
): Pixel => ({ red, green, blue, alpha });

type PixelMatrix = Pixel[][];

const pngToPixelMatrix = (png: PNGWithMetadata): PixelMatrix => {
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

const printPixelMatrix = (matrix: PixelMatrix): void => {
  matrix.forEach(row => {
    const alphaHexes = row.map(p => {
      const simple = p.alpha.toString(16);
      const full = simple.length === 1
        ? `0${simple}`
        : simple;

      return full;
    });

    print(alphaHexes.join(' '))
  })
};

getTests('grow')
  // .then(tap(forEachC(print)))   // Debug
  .then(forEachC(async test => {
    const inputMatrix = await fs.promises
      .readFile(test.inFileName)
      .then(PNG.sync.read)
      .catch(error => `Error while reading png: ${error}`)
      .then(pngToPixelMatrix)
      .then(tap(printPixelMatrix));
  }));
