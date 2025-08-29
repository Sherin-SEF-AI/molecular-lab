import { create } from 'zustand';
import { Vector3 } from 'three';
import type { LabState, Molecule, VisualizationOptions, SelectionState, CameraSettings } from '../types/molecular';

interface LabStore extends LabState {
  addMolecule: (molecule: Molecule) => void;
  removeMolecule: (id: string) => void;
  updateMolecule: (id: string, updates: Partial<Molecule>) => void;
  setVisualizationOptions: (options: Partial<VisualizationOptions>) => void;
  selectAtoms: (atomIds: string[]) => void;
  selectBonds: (bondIds: string[]) => void;
  selectMolecules: (moleculeIds: string[]) => void;
  clearSelection: () => void;
  setCameraSettings: (settings: Partial<CameraSettings>) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  setTemperature: (temperature: number) => void;
  setPressure: (pressure: number) => void;
  reset: () => void;
}

const defaultVisualizationOptions: VisualizationOptions = {
  style: 'ball-stick',
  showLabels: true,
  showBonds: true,
  showLonePairs: false,
  showCharges: false,
  atomScale: 1.0,
  bondScale: 1.0,
  transparency: 1.0,
};

const defaultSelectionState: SelectionState = {
  selectedAtoms: [],
  selectedBonds: [],
  selectedMolecules: [],
};

const defaultCameraSettings: CameraSettings = {
  position: new Vector3(0, 0, 10),
  target: new Vector3(0, 0, 0),
  zoom: 1,
};

export const useLabStore = create<LabStore>((set) => ({
  molecules: [],
  visualization: defaultVisualizationOptions,
  selection: defaultSelectionState,
  camera: defaultCameraSettings,
  isSimulating: false,
  temperature: 298.15, // Room temperature in Kelvin
  pressure: 101325, // 1 atm in Pa

  addMolecule: (molecule) =>
    set((state) => ({
      molecules: [...state.molecules, molecule],
    })),

  removeMolecule: (id) =>
    set((state) => ({
      molecules: state.molecules.filter((mol) => mol.id !== id),
    })),

  updateMolecule: (id, updates) =>
    set((state) => ({
      molecules: state.molecules.map((mol) =>
        mol.id === id ? { ...mol, ...updates } : mol
      ),
    })),

  setVisualizationOptions: (options) =>
    set((state) => ({
      visualization: { ...state.visualization, ...options },
    })),

  selectAtoms: (atomIds) =>
    set((state) => ({
      selection: { ...state.selection, selectedAtoms: atomIds },
    })),

  selectBonds: (bondIds) =>
    set((state) => ({
      selection: { ...state.selection, selectedBonds: bondIds },
    })),

  selectMolecules: (moleculeIds) =>
    set((state) => ({
      selection: { ...state.selection, selectedMolecules: moleculeIds },
    })),

  clearSelection: () =>
    set(() => ({
      selection: defaultSelectionState,
    })),

  setCameraSettings: (settings) =>
    set((state) => ({
      camera: { ...state.camera, ...settings },
    })),

  startSimulation: () => set({ isSimulating: true }),
  stopSimulation: () => set({ isSimulating: false }),

  setTemperature: (temperature) => set({ temperature }),
  setPressure: (pressure) => set({ pressure }),

  reset: () =>
    set(() => ({
      molecules: [],
      visualization: defaultVisualizationOptions,
      selection: defaultSelectionState,
      camera: defaultCameraSettings,
      isSimulating: false,
      temperature: 298.15,
      pressure: 101325,
    })),
}));