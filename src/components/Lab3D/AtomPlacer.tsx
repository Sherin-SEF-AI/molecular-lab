import React, { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useLabStore } from '../../store/labStore';
import { getElementColor, getVanDerWaalsRadius } from '../../data/elements';
import { canElementsBond, getIdealBondLength } from '../../utils/bondingRules';
import type { Atom, Bond } from '../../types/molecular';

interface AtomPlacerProps {
  elementSymbol: string | null;
  isPlacementMode: boolean;
}

export const AtomPlacer: React.FC<AtomPlacerProps> = ({ 
  elementSymbol, 
  isPlacementMode 
}) => {
  const [ghostAtomPosition, setGhostAtomPosition] = useState<THREE.Vector3 | null>(null);
  const [potentialBonds, setPotentialBonds] = useState<string[]>([]);
  const { camera } = useThree();
  const { molecules, addMolecule, updateMolecule } = useLabStore();
  
  const ghostAtomRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!isPlacementMode || !elementSymbol) {
      setGhostAtomPosition(null);
      setPotentialBonds([]);
      return;
    }

    // Get mouse position and raycast to find placement position
    // This would be updated by mouse move events in a real implementation
    // For now, we'll place atoms at a fixed distance from camera
    
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera.quaternion);
    const position = camera.position.clone().add(direction.multiplyScalar(5));
    
    setGhostAtomPosition(position);
    
    // Check for potential bonds with nearby atoms
    const nearbyAtoms: string[] = [];
    const maxBondDistance = 3.0; // Maximum distance to consider for bonding
    
    molecules.forEach(molecule => {
      molecule.atoms.forEach(atom => {
        const atomPos = new THREE.Vector3(atom.position.x, atom.position.y, atom.position.z);
        const distance = position.distanceTo(atomPos);
        
        if (distance <= maxBondDistance && canElementsBond(elementSymbol, atom.element, distance)) {
          nearbyAtoms.push(atom.id);
        }
      });
    });
    
    setPotentialBonds(nearbyAtoms);
  });

  const handlePlaceAtom = () => {
    if (!ghostAtomPosition || !elementSymbol) return;

    const newAtom: Atom = {
      id: `atom-${elementSymbol}-${Date.now()}`,
      element: elementSymbol,
      position: ghostAtomPosition,
      selected: false,
      charge: 0,
    };

    // Check if we should add to existing molecule or create new one
    let targetMolecule = null;
    let newBonds: Bond[] = [];

    for (const molecule of molecules) {
      for (const atom of molecule.atoms) {
        if (potentialBonds.includes(atom.id)) {
          targetMolecule = molecule;
          
          // Create bond
          const bondLength = getIdealBondLength(elementSymbol, atom.element);
          const newBond: Bond = {
            id: `bond-${newAtom.id}-${atom.id}`,
            atom1: newAtom.id,
            atom2: atom.id,
            type: 'single',
            length: bondLength,
          };
          newBonds.push(newBond);
          break;
        }
      }
      if (targetMolecule) break;
    }

    if (targetMolecule) {
      // Add atom to existing molecule
      updateMolecule(targetMolecule.id, {
        atoms: [...targetMolecule.atoms, newAtom],
        bonds: [...targetMolecule.bonds, ...newBonds],
        formula: `${targetMolecule.formula}+${elementSymbol}`, // Simplified formula update
      });
    } else {
      // Create new single-atom molecule
      const newMolecule = {
        id: `molecule-${Date.now()}`,
        name: `${elementSymbol} atom`,
        atoms: [newAtom],
        bonds: [],
        formula: elementSymbol,
        charge: 0,
        multiplicity: 1,
      };
      addMolecule(newMolecule);
    }

    // Reset placement state
    setGhostAtomPosition(null);
    setPotentialBonds([]);
  };

  if (!isPlacementMode || !elementSymbol || !ghostAtomPosition) {
    return null;
  }

  const radius = getVanDerWaalsRadius(elementSymbol) * 0.3;
  const color = getElementColor(elementSymbol);

  return (
    <group>
      {/* Ghost atom preview */}
      <Sphere
        ref={ghostAtomRef}
        position={[ghostAtomPosition.x, ghostAtomPosition.y, ghostAtomPosition.z]}
        args={[radius, 16, 16]}
        onClick={handlePlaceAtom}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </Sphere>

      {/* Potential bond indicators */}
      {potentialBonds.map(atomId => {
        // Find the atom position
        let atomPosition: THREE.Vector3 | null = null;
        
        for (const molecule of molecules) {
          const atom = molecule.atoms.find(a => a.id === atomId);
          if (atom) {
            atomPosition = new THREE.Vector3(atom.position.x, atom.position.y, atom.position.z);
            break;
          }
        }

        if (!atomPosition) return null;

        // Draw potential bond line
        const points = [ghostAtomPosition, atomPosition];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <line key={atomId}>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial 
              attach="material" 
              color="#ffff00" 
              opacity={0.7} 
              transparent 
              linewidth={2}
            />
          </line>
        );
      })}
    </group>
  );
};