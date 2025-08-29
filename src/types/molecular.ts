import { Vector3 } from 'three';

export interface Atom {
  id: string;
  element: string;
  position: Vector3;
  selected: boolean;
  charge: number;
  hybridization?: string;
}

export interface Bond {
  id: string;
  atom1: string;
  atom2: string;
  type: 'single' | 'double' | 'triple' | 'aromatic';
  length: number;
}

export interface Molecule {
  id: string;
  name: string;
  atoms: Atom[];
  bonds: Bond[];
  formula: string;
  charge: number;
  multiplicity: number;
  energy?: number;
}

export interface MolecularSystem {
  molecules: Molecule[];
  temperature: number;
  pressure: number;
  solvent?: string;
}

export type VisualizationStyle = 'ball-stick' | 'space-filling' | 'wireframe' | 'cartoon';

export interface VisualizationOptions {
  style: VisualizationStyle;
  showLabels: boolean;
  showBonds: boolean;
  showLonePairs: boolean;
  showCharges: boolean;
  atomScale: number;
  bondScale: number;
  transparency: number;
}

export interface SelectionState {
  selectedAtoms: string[];
  selectedBonds: string[];
  selectedMolecules: string[];
}

export interface CameraSettings {
  position: Vector3;
  target: Vector3;
  zoom: number;
}

export interface LabState {
  molecules: Molecule[];
  visualization: VisualizationOptions;
  selection: SelectionState;
  camera: CameraSettings;
  isSimulating: boolean;
  temperature: number;
  pressure: number;
}