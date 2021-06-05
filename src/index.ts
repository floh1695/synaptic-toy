import * as fs from 'fs';
import { PNG } from 'pngjs';
import { Layer, Network } from 'synaptic';

import { curry2, forEachC, mapC, tap } from './functional';
import { perceptorPointsToMatrix, pixalMatrixForPercepter, PixelMatrix, pngToPixelMatrix, printPixelMatrix } from './pixel';

const joinPath = (prependee: string, appendee: string): string =>
  [prependee, appendee].join('/');

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
    //.catch(error => console.log(`Error while reading suite: ${error}`))
    .then(mapC(prependDirName))
    .then(mapC(dirNameToTestCase));
};

const readMatrixFromFile = (filename: string): Promise<PixelMatrix> =>
  fs.promises
    .readFile(filename)
    .then(PNG.sync.read)
    //.catch(error => `Error while reading png: ${error}`)
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
let lastOutput: number[] | null = null;
getTests('grow')
  .then(tap(forEachC(x => console.log(x))))   // Debug
  .then(forEachC(async test => {
    console.log(`starting test for: ${test.inFileName}`);

    const inputPoints = await readMatrixFromFile(test.inFileName).then(pixalMatrixForPercepter);
    const outputPoints = await readMatrixFromFile(test.outFileName).then(pixalMatrixForPercepter);
    
    lastOutput = outputPoints;

    const learningRate: number = 0.2;
    for (let i = 0; i < 10000; i += 1)
    {
      perceptor.activate(inputPoints);  
      perceptor.propagate(learningRate, outputPoints);
    }
  }))
  .then(() => {
    if (lastOutput === null) return;

    const newOutput = perceptor.activate(lastOutput);
    const matrix = perceptorPointsToMatrix(newOutput, 32, 32);
    printPixelMatrix(matrix)

    return matrix;
  });
