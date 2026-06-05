import * as Tone from 'tone';

import { clamp } from '@utils/clamp';

export interface LoFiCrusherState {
  bits: number;
  depth: number;
}

export interface LoFiCrusher {
  input: Tone.Gain;
  output: Tone.Gain;
  update: (state: LoFiCrusherState) => void;
  dispose: () => void;
}

const PROCESSOR_NAME = 'endless-dungeon-lo-fi-crusher';

const processorSource = `
class LoFiCrusherProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'bits', defaultValue: 5, minValue: 0.01, maxValue: 16, automationRate: 'k-rate' },
      { name: 'depth', defaultValue: 0.35, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
    ];
  }

  constructor() {
    super();
    this.sampleCounter = 0;
    this.held = [];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    if (!input || input.length === 0 || !output || output.length === 0) {
      return true;
    }

    const bits = Math.max(0.01, parameters.bits[0] ?? 5);
    const depth = Math.max(0, Math.min(1, parameters.depth[0] ?? 0));
    const levels = Math.max(1, Math.pow(2, bits) - 1);
    const holdSamples = Math.max(1, Math.round(1 + depth * 511));
    const channelCount = output.length;
    const sampleCount = output[0].length;

    for (let sample = 0; sample < sampleCount; sample += 1) {
      if (this.sampleCounter === 0) {
        for (let channel = 0; channel < channelCount; channel += 1) {
          const inputChannel = input[channel] ?? input[0];
          this.held[channel] = Math.round(inputChannel[sample] * levels) / levels;
        }
      }

      for (let channel = 0; channel < channelCount; channel += 1) {
        output[channel][sample] = this.held[channel] ?? 0;
      }

      this.sampleCounter = (this.sampleCounter + 1) % holdSamples;
    }

    return true;
  }
}

registerProcessor('${PROCESSOR_NAME}', LoFiCrusherProcessor);
`;

let processorModuleUrl: string | null = null;
let processorModulePromise: Promise<void> | null = null;

const getProcessorModuleUrl = (): string => {
  if (!processorModuleUrl) {
    processorModuleUrl = URL.createObjectURL(new Blob([processorSource], { type: 'application/javascript' }));
  }

  return processorModuleUrl;
};

const loadProcessorModule = (): Promise<void> => {
  if (!processorModulePromise) {
    processorModulePromise = Tone.getContext().addAudioWorkletModule(getProcessorModuleUrl());
  }

  return processorModulePromise;
};

export const createLoFiCrusher = (state: LoFiCrusherState): LoFiCrusher => {
  const input = new Tone.Gain();
  const output = new Tone.Gain();
  let currentState = { ...state };
  let workletNode: AudioWorkletNode | null = null;
  let disposed = false;

  input.connect(output);

  void loadProcessorModule().then(() => {
    if (disposed) {
      return;
    }

    workletNode = Tone.getContext().createAudioWorkletNode(PROCESSOR_NAME, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      parameterData: {
        bits: clamp(currentState.bits, 0.01, 16),
        depth: clamp(currentState.depth, 0, 1),
      },
    });

    input.disconnect(output);
    input.output.connect(workletNode);
    workletNode.connect(output.input);
  });

  return {
    input,
    output,
    update: (nextState) => {
      currentState = { ...nextState };
      workletNode?.parameters.get('bits')?.setValueAtTime(clamp(nextState.bits, 0.01, 16), Tone.now());
      workletNode?.parameters.get('depth')?.setValueAtTime(clamp(nextState.depth, 0, 1), Tone.now());
    },
    dispose: () => {
      disposed = true;
      input.dispose();
      output.dispose();
      workletNode?.disconnect();
      workletNode = null;
    },
  };
};
