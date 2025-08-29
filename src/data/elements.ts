export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  electronConfiguration: string;
  group: number;
  period: number;
  color: string;
  radius: number; // van der Waals radius in Angstroms
  covalentRadius: number;
  electronegativity: number;
  valenceElectrons: number[];
  commonOxidationStates: number[];
  category: 'nonmetal' | 'metal' | 'metalloid' | 'noble-gas';
  state: 'solid' | 'liquid' | 'gas' | 'synthetic';
  meltingPoint: number; // Kelvin
  boilingPoint: number; // Kelvin
}

export const elements: Record<string, Element> = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    atomicMass: 1.008,
    electronConfiguration: '1s1',
    group: 1,
    period: 1,
    color: '#ffffff',
    radius: 1.20,
    covalentRadius: 0.31,
    electronegativity: 2.20,
    valenceElectrons: [1],
    commonOxidationStates: [-1, 1],
    category: 'nonmetal',
    state: 'gas',
    meltingPoint: 14.01,
    boilingPoint: 20.28
  },
  He: {
    symbol: 'He',
    name: 'Helium',
    atomicNumber: 2,
    atomicMass: 4.003,
    electronConfiguration: '1s2',
    group: 18,
    period: 1,
    color: '#d9ffff',
    radius: 1.40,
    covalentRadius: 0.28,
    electronegativity: 0,
    valenceElectrons: [2],
    commonOxidationStates: [0],
    category: 'noble-gas',
    state: 'gas',
    meltingPoint: 0.95,
    boilingPoint: 4.22
  },
  Li: {
    symbol: 'Li',
    name: 'Lithium',
    atomicNumber: 3,
    atomicMass: 6.941,
    electronConfiguration: '[He] 2s1',
    group: 1,
    period: 2,
    color: '#cc80ff',
    radius: 1.82,
    covalentRadius: 1.28,
    electronegativity: 0.98,
    valenceElectrons: [1],
    commonOxidationStates: [1],
    category: 'metal',
    state: 'solid',
    meltingPoint: 453.69,
    boilingPoint: 1615
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    atomicMass: 12.011,
    electronConfiguration: '[He] 2s2 2p2',
    group: 14,
    period: 2,
    color: '#909090',
    radius: 1.70,
    covalentRadius: 0.76,
    electronegativity: 2.55,
    valenceElectrons: [4],
    commonOxidationStates: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
    category: 'nonmetal',
    state: 'solid',
    meltingPoint: 3823,
    boilingPoint: 4098
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    atomicMass: 14.007,
    electronConfiguration: '[He] 2s2 2p3',
    group: 15,
    period: 2,
    color: '#3050f8',
    radius: 1.55,
    covalentRadius: 0.71,
    electronegativity: 3.04,
    valenceElectrons: [5],
    commonOxidationStates: [-3, -2, -1, 0, 1, 2, 3, 4, 5],
    category: 'nonmetal',
    state: 'gas',
    meltingPoint: 63.15,
    boilingPoint: 77.36
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    atomicMass: 15.999,
    electronConfiguration: '[He] 2s2 2p4',
    group: 16,
    period: 2,
    color: '#ff0d0d',
    radius: 1.52,
    covalentRadius: 0.66,
    electronegativity: 3.44,
    valenceElectrons: [6],
    commonOxidationStates: [-2, -1, 0],
    category: 'nonmetal',
    state: 'gas',
    meltingPoint: 54.36,
    boilingPoint: 90.20
  },
  F: {
    symbol: 'F',
    name: 'Fluorine',
    atomicNumber: 9,
    atomicMass: 18.998,
    electronConfiguration: '[He] 2s2 2p5',
    group: 17,
    period: 2,
    color: '#90e050',
    radius: 1.47,
    covalentRadius: 0.57,
    electronegativity: 3.98,
    valenceElectrons: [7],
    commonOxidationStates: [-1],
    category: 'nonmetal',
    state: 'gas',
    meltingPoint: 53.53,
    boilingPoint: 85.03
  },
  Ne: {
    symbol: 'Ne',
    name: 'Neon',
    atomicNumber: 10,
    atomicMass: 20.180,
    electronConfiguration: '[He] 2s2 2p6',
    group: 18,
    period: 2,
    color: '#b3e3f5',
    radius: 1.54,
    covalentRadius: 0.58,
    electronegativity: 0,
    valenceElectrons: [8],
    commonOxidationStates: [0],
    category: 'noble-gas',
    state: 'gas',
    meltingPoint: 24.56,
    boilingPoint: 27.07
  },
  Na: {
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    atomicMass: 22.990,
    electronConfiguration: '[Ne] 3s1',
    group: 1,
    period: 3,
    color: '#ab5cf2',
    radius: 2.27,
    covalentRadius: 1.66,
    electronegativity: 0.93,
    valenceElectrons: [1],
    commonOxidationStates: [1],
    category: 'metal',
    state: 'solid',
    meltingPoint: 370.87,
    boilingPoint: 1156
  },
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    atomicMass: 35.453,
    electronConfiguration: '[Ne] 3s2 3p5',
    group: 17,
    period: 3,
    color: '#1ff01f',
    radius: 1.75,
    covalentRadius: 0.99,
    electronegativity: 3.16,
    valenceElectrons: [7],
    commonOxidationStates: [-1, 0, 1, 3, 5, 7],
    category: 'nonmetal',
    state: 'gas',
    meltingPoint: 171.6,
    boilingPoint: 239.11
  }
};

export const getElementBySymbol = (symbol: string): Element | undefined => {
  return elements[symbol];
};

export const getAllElements = (): Element[] => {
  return Object.values(elements);
};

export const getElementsByGroup = (group: number): Element[] => {
  return Object.values(elements).filter(element => element.group === group);
};

export const getElementsByPeriod = (period: number): Element[] => {
  return Object.values(elements).filter(element => element.period === period);
};

export const getElementColor = (symbol: string): string => {
  const element = elements[symbol];
  return element ? element.color : '#cccccc';
};

export const getVanDerWaalsRadius = (symbol: string): number => {
  const element = elements[symbol];
  return element ? element.radius : 1.5;
};

export const getCovalentRadius = (symbol: string): number => {
  const element = elements[symbol];
  return element ? element.covalentRadius : 0.8;
};