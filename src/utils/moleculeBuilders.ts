import { Vector3 } from 'three';
import type { Molecule, Atom, Bond } from '../types/molecular';

export function createWaterMolecule(position: Vector3 = new Vector3(0, 0, 0)): Molecule {
  const atoms: Atom[] = [
    {
      id: 'h2o-o-1',
      element: 'O',
      position: new Vector3(position.x, position.y, position.z),
      selected: false,
      charge: -0.8,
      hybridization: 'sp3'
    },
    {
      id: 'h2o-h-1',
      element: 'H',
      position: new Vector3(position.x - 0.96, position.y + 0.61, position.z),
      selected: false,
      charge: 0.4,
    },
    {
      id: 'h2o-h-2',
      element: 'H',
      position: new Vector3(position.x + 0.96, position.y + 0.61, position.z),
      selected: false,
      charge: 0.4,
    }
  ];

  const bonds: Bond[] = [
    {
      id: 'h2o-bond-1',
      atom1: 'h2o-o-1',
      atom2: 'h2o-h-1',
      type: 'single',
      length: 0.96
    },
    {
      id: 'h2o-bond-2',
      atom1: 'h2o-o-1',
      atom2: 'h2o-h-2',
      type: 'single',
      length: 0.96
    }
  ];

  return {
    id: `water-${Date.now()}`,
    name: 'Water',
    atoms,
    bonds,
    formula: 'H₂O',
    charge: 0,
    multiplicity: 1,
    energy: -76.4
  };
}

export function createMethaneMolecule(position: Vector3 = new Vector3(0, 0, 0)): Molecule {
  const atoms: Atom[] = [
    {
      id: 'ch4-c-1',
      element: 'C',
      position: new Vector3(position.x, position.y, position.z),
      selected: false,
      charge: -0.4,
      hybridization: 'sp3'
    },
    {
      id: 'ch4-h-1',
      element: 'H',
      position: new Vector3(position.x + 1.09, position.y + 1.09, position.z + 1.09),
      selected: false,
      charge: 0.1,
    },
    {
      id: 'ch4-h-2',
      element: 'H',
      position: new Vector3(position.x - 1.09, position.y - 1.09, position.z + 1.09),
      selected: false,
      charge: 0.1,
    },
    {
      id: 'ch4-h-3',
      element: 'H',
      position: new Vector3(position.x - 1.09, position.y + 1.09, position.z - 1.09),
      selected: false,
      charge: 0.1,
    },
    {
      id: 'ch4-h-4',
      element: 'H',
      position: new Vector3(position.x + 1.09, position.y - 1.09, position.z - 1.09),
      selected: false,
      charge: 0.1,
    }
  ];

  const bonds: Bond[] = [
    {
      id: 'ch4-bond-1',
      atom1: 'ch4-c-1',
      atom2: 'ch4-h-1',
      type: 'single',
      length: 1.09
    },
    {
      id: 'ch4-bond-2',
      atom1: 'ch4-c-1',
      atom2: 'ch4-h-2',
      type: 'single',
      length: 1.09
    },
    {
      id: 'ch4-bond-3',
      atom1: 'ch4-c-1',
      atom2: 'ch4-h-3',
      type: 'single',
      length: 1.09
    },
    {
      id: 'ch4-bond-4',
      atom1: 'ch4-c-1',
      atom2: 'ch4-h-4',
      type: 'single',
      length: 1.09
    }
  ];

  return {
    id: `methane-${Date.now()}`,
    name: 'Methane',
    atoms,
    bonds,
    formula: 'CH₄',
    charge: 0,
    multiplicity: 1,
    energy: -40.5
  };
}

export function createAmmoniaeMolecule(position: Vector3 = new Vector3(0, 0, 0)): Molecule {
  const atoms: Atom[] = [
    {
      id: 'nh3-n-1',
      element: 'N',
      position: new Vector3(position.x, position.y, position.z),
      selected: false,
      charge: -0.9,
      hybridization: 'sp3'
    },
    {
      id: 'nh3-h-1',
      element: 'H',
      position: new Vector3(position.x + 0.94, position.y - 0.38, position.z),
      selected: false,
      charge: 0.3,
    },
    {
      id: 'nh3-h-2',
      element: 'H',
      position: new Vector3(position.x - 0.47, position.y - 0.38, position.z + 0.82),
      selected: false,
      charge: 0.3,
    },
    {
      id: 'nh3-h-3',
      element: 'H',
      position: new Vector3(position.x - 0.47, position.y - 0.38, position.z - 0.82),
      selected: false,
      charge: 0.3,
    }
  ];

  const bonds: Bond[] = [
    {
      id: 'nh3-bond-1',
      atom1: 'nh3-n-1',
      atom2: 'nh3-h-1',
      type: 'single',
      length: 1.01
    },
    {
      id: 'nh3-bond-2',
      atom1: 'nh3-n-1',
      atom2: 'nh3-h-2',
      type: 'single',
      length: 1.01
    },
    {
      id: 'nh3-bond-3',
      atom1: 'nh3-n-1',
      atom2: 'nh3-h-3',
      type: 'single',
      length: 1.01
    }
  ];

  return {
    id: `ammonia-${Date.now()}`,
    name: 'Ammonia',
    atoms,
    bonds,
    formula: 'NH₃',
    charge: 0,
    multiplicity: 1,
    energy: -56.6
  };
}

export function createCarbonDioxideMolecule(position: Vector3 = new Vector3(0, 0, 0)): Molecule {
  const atoms: Atom[] = [
    {
      id: 'co2-c-1',
      element: 'C',
      position: new Vector3(position.x, position.y, position.z),
      selected: false,
      charge: 0.4,
      hybridization: 'sp'
    },
    {
      id: 'co2-o-1',
      element: 'O',
      position: new Vector3(position.x - 1.16, position.y, position.z),
      selected: false,
      charge: -0.2,
    },
    {
      id: 'co2-o-2',
      element: 'O',
      position: new Vector3(position.x + 1.16, position.y, position.z),
      selected: false,
      charge: -0.2,
    }
  ];

  const bonds: Bond[] = [
    {
      id: 'co2-bond-1',
      atom1: 'co2-c-1',
      atom2: 'co2-o-1',
      type: 'double',
      length: 1.16
    },
    {
      id: 'co2-bond-2',
      atom1: 'co2-c-1',
      atom2: 'co2-o-2',
      type: 'double',
      length: 1.16
    }
  ];

  return {
    id: `co2-${Date.now()}`,
    name: 'Carbon Dioxide',
    atoms,
    bonds,
    formula: 'CO₂',
    charge: 0,
    multiplicity: 1,
    energy: -188.6
  };
}