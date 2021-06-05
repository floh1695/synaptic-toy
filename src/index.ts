import * as fs from 'fs';
import { PNG } from 'pngjs';

import { PixelMatrix, pngToPixelMatrix, printPixelMatrix } from './pixel';

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

const readMatrixFromFile = (filename: string): Promise<PixelMatrix> =>
  fs.promises
    .readFile(filename)
    .then(PNG.sync.read)
    .catch(error => `Error while reading png: ${error}`)
    .then(pngToPixelMatrix)
    // .then(tap(printPixelMatrix))  // Debug
    ;

getTests('grow')
  // .then(tap(forEachC(print)))   // Debug
  .then(forEachC(async test => {
    const inputMatrix = await readMatrixFromFile(test.inFileName);
    const outputMatrix = await readMatrixFromFile(test.outFileName);
  }));
