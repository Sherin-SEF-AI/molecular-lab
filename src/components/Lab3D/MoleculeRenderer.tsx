import React, { useMemo } from 'react';
import type { Molecule, VisualizationOptions, Atom } from '../../types/molecular';
import { AtomRenderer } from './AtomRenderer';
import { BondRenderer } from './BondRenderer';

interface MoleculeRendererProps {
  molecule: Molecule;
  visualizationOptions: VisualizationOptions;
}

export const MoleculeRenderer: React.FC<MoleculeRendererProps> = ({
  molecule,
  visualizationOptions,
}) => {
  const atomsMap = useMemo(() => {
    const map = new Map<string, Atom>();
    molecule.atoms.forEach(atom => map.set(atom.id, atom));
    return map;
  }, [molecule.atoms]);

  return (
    <group>
      {/* Render all atoms */}
      {molecule.atoms.map((atom) => (
        <AtomRenderer
          key={atom.id}
          atom={atom}
          visualizationOptions={visualizationOptions}
        />
      ))}
      
      {/* Render all bonds */}
      {visualizationOptions.showBonds && 
        molecule.bonds.map((bond) => {
          const atom1 = atomsMap.get(bond.atom1);
          const atom2 = atomsMap.get(bond.atom2);
          
          if (!atom1 || !atom2) return null;
          
          return (
            <BondRenderer
              key={bond.id}
              bond={bond}
              atom1={atom1}
              atom2={atom2}
              visualizationOptions={visualizationOptions}
            />
          );
        })
      }
      
      {/* Molecule label */}
      {visualizationOptions.showLabels && (
        <mesh position={[0, 2, 0]}>
          {/* Add text label here when text rendering is implemented */}
        </mesh>
      )}
    </group>
  );
};