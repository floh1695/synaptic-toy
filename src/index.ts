import * as fs from 'fs';
import { PNG } from 'pngjs';
import { Layer, Network } from 'synaptic';

import { PixelMatrix, pngToPixelMatrix, printPixelMatrix } from './pixel';

const joinPath = (prependee: string, appendee: string): string =>
  [prependee, appendee].join('/');
const curry2 = <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B): C => f(a, b);

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
  const prependDirName = curry2(joinPath)(dirName);
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

const makePerceptor = (width: number, height: number, innerRatio: number): Network => {
  const points = width * height * 4;

  const input: Layer = new Layer(points);
  const hidden: Layer = new Layer(points * innerRatio);
  const output: Layer = new Layer(points);

  input.project(hidden);
  hidden.project(output)

  const network: Network = new Network({
    input,
    hidden: [hidden],
    output
  });

  return network;
};

const perceptor = makePerceptor(32, 32, 4);
getTests('grow')
  // .then(tap(forEachC(print)))   // Debug
  .then(forEachC(async test => {
    const inputMatrix = await readMatrixFromFile(test.inFileName);
    const outputMatrix = await readMatrixFromFile(test.outFileName);

    // const learningRate: number = 0.5;
    // for (let i = 0; i < 1000000; i += 1)
    // {
    //   perceptor.activate([0,0]);  
    //   perceptor.propagate(learningRate, [0]);

    //   perceptor.activate([0,1]);  
    //   perceptor.propagate(learningRate, [1]);

    //   perceptor.activate([1,0]);  
    //   perceptor.propagate(learningRate, [1]);

    //   perceptor.activate([1,1]);  
    //   perceptor.propagate(learningRate, [0]);  
    // }
  }));
