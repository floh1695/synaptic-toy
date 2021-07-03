import * as fs from 'fs';
import { Architect } from 'synaptic';

const main = async () => {
  const contents = await getFileContents('./data/boxGrow');

  const targetHeight = 32;
  const targetWidth = 32;
  const tests = contents
    .map(parseContentsToVisualTest)
    .filter(({ meta: { height, width } }) =>
      height === targetHeight && width === targetWidth
    );

  const pixelCount = targetHeight * targetWidth;
  const hiddenFactor = 0.5;
  const hiddenCount = pixelCount * hiddenFactor;
  const totalNeurons = (pixelCount * 2) + hiddenCount;
  const connections = totalNeurons * 2;
  const gates = connections / 4;
  console.log({
    pixelCount,
    hiddenFactor,
    hiddenCount,
    totalNeurons,
    connections,
    gates
  });
  const transformer = new Architect.Liquid(
    pixelCount, hiddenCount, pixelCount, connections, gates
  );

  tests.forEach(test => console.log(test));
  console.log(transformer);
};

const getFileContents =  async (directoryPath: string): Promise<string[]> => {
  const plainPaths = await fs.promises
    .readdir(directoryPath);
  const fullPaths = plainPaths
    .map(path => `${directoryPath}/${path}`);

  const filePromises = fullPaths
    .map(path => fs.promises.readFile(path));
  const files = await Promise.all(filePromises);
  const contents = files.map(file => file.toString());

  return contents;
};

type VisualTest = {
  meta: {
    height: number,
    width: number
  },
  in: string[][],
  out: string[][]
};

const parseContentsToVisualTest = (content: string): VisualTest => {
  const extractRaw = (tag: string): string => {
    const regex = tagRegex(tag);
    const match = content.match(regex);

    const raw = match === null
      ? ''
      : match[1];

    return raw;
  };

  const rawMeta = extractRaw('meta');
  const meta = JSON.parse(rawMeta);

  const inOut = ['in', 'out']
    .map(extractRaw)
    .map(parseMatrix);

  const test = {
    meta,
    in: inOut[0],
    out: inOut[1]
  };

  return test;
};

const tagRegex = (tag: string): RegExp =>
  new RegExp(
    `^\\<${tag}\\>\\s*\\n([\\s\\S]*)\\n\\<\\/${tag}\\>\\s*$`,
    'm'
  );

const parseMatrix = (image: string): string[][] => {
  const rawLines = image.split(/\r\n?/);
  const lines = rawLines
    .map(line => line.split(''))
    .filter(line => line.length > 0);

  return lines;
};

main();
