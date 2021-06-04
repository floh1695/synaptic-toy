// import { Layer, Network } from 'synaptic';
// import { PNG } from 'pngjs';
import * as fs from 'fs';

const joinPath = (prependee: string, appendee: string): string =>
  [prependee, appendee].join('/');
const joinPathC = (prependee: string) => (appendee: string): string =>
  joinPath(prependee, appendee);

const mapC = <A, B>(f: (a: A) => B) => (list: A[]) => list.map(f);
const forEachC = <A>(f: (a: A) => void) => (list: A[]) => list.forEach(f);

const inFileName = 'in.png';
const outFileName = 'out.png';
type TestCase = {
  inFileName: string,
  outFileName: string
};
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

getTests('grow').then(forEachC(x => console.log(x)));

// const input: Layer = new Layer(2);
// const hidden: Layer = new Layer(3);
// const output: Layer = new Layer(1);

// input.project(hidden);
// hidden.project(output)

// const network: Network = new Network({
//   input,
//   hidden: [hidden],
//   output
// });

// const learningRate: number = 0.5;
// for (let i = 0; i < 1000000; i += 1)
// {
//   network.activate([0,0]);  
//   network.propagate(learningRate, [0]);

//   network.activate([0,1]);  
//   network.propagate(learningRate, [1]);

//   network.activate([1,0]);  
//   network.propagate(learningRate, [1]);

//   network.activate([1,1]);  
//   network.propagate(learningRate, [0]);  
// }

// console.log(network.activate([0,0]));
// console.log(network.activate([0,1]));
// console.log(network.activate([1,0]));
// console.log(network.activate([1,1]));
