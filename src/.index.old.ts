import { Layer, Network } from 'synaptic';

const input: Layer = new Layer(2);
const hidden: Layer = new Layer(3);
const output: Layer = new Layer(1);

input.project(hidden);
hidden.project(output)

const network: Network = new Network({
  input,
  hidden: [hidden],
  output
});

const learningRate: number = 0.5;
for (let i = 0; i < 1000000; i += 1)
{
  network.activate([0,0]);  
  network.propagate(learningRate, [0]);

  network.activate([0,1]);  
  network.propagate(learningRate, [1]);

  network.activate([1,0]);  
  network.propagate(learningRate, [1]);

  network.activate([1,1]);  
  network.propagate(learningRate, [0]);  
}

console.log(network.activate([0,0]));
console.log(network.activate([0,1]));
console.log(network.activate([1,0]));
console.log(network.activate([1,1]));
