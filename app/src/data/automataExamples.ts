import { NFA } from '../../../automata-lib/src/core/NFA'

interface Example {
  id: string
  name: string
  description: string
  accepted: string[]
  rejected: string[]
  create: () => NFA
}

function buildBinaryNFA(
  stateNames: string[],
  acceptingIndexes: number[],
  transitions: [number, number][],
): NFA {
  const automata = new NFA(stateNames[0])
  const stateIds = [automata.getStartStateId()]

  for (const name of stateNames.slice(1)) {
    const state = automata.addState(name)

    if (state === null) {
      throw new Error(`Unable to create state ${name}`)
    }

    stateIds.push(state.getId())
  }

  for (const index of acceptingIndexes) {
    automata.getState(stateIds[index])?.setAcceptance(true)
  }

  transitions.forEach(([zeroTarget, oneTarget], index) => {
    automata.addTransition({
      from: stateIds[index],
      to: stateIds[zeroTarget],
      symbol: '0',
    })

    automata.addTransition({
      from: stateIds[index],
      to: stateIds[oneTarget],
      symbol: '1',
    })
  })

  return automata
}

export const automataExamples: Example[] = [
  {
    id: 'even-ones',
    name: 'Even number of 1s',
    description:
      'Two states track whether the number of 1s read so far is even or odd.',
    accepted: ['ε', '11', '1010'],
    rejected: ['1', '111', '010'],
    create: () =>
      buildBinaryNFA(
        ['Even', 'Odd'],
        [0],
        [
          [0, 1],
          [1, 0],
        ],
      ),
  },
  {
    id: 'ends-with-01',
    name: 'Ends with 01',
    description:
      'Tracks the end of the input and accepts when its final two symbols are 01.',
    accepted: ['01', '1101', '0001'],
    rejected: ['ε', '010', '11'],
    create: () =>
      buildBinaryNFA(
        ['Start', 'Seen 0', 'Seen 01'],
        [2],
        [
          [1, 0],
          [1, 2],
          [1, 0],
        ],
      ),
  },
  {
    id: 'contains-101',
    name: 'Contains 101',
    description:
      'Recognizes 101 anywhere in the input. Once found, it stays accepting.',
    accepted: ['101', '11010', '1011'],
    rejected: ['ε', '1001', '111'],
    create: () =>
      buildBinaryNFA(
        ['Start', 'Seen 1', 'Seen 10', 'Found 101'],
        [3],
        [
          [0, 1],
          [2, 1],
          [0, 3],
          [3, 3],
        ],
      ),
  },
]

