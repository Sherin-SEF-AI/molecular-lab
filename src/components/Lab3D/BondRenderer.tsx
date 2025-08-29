import React from 'react';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import type { Bond, Atom, VisualizationOptions } from '../../types/molecular';

interface BondRendererProps {
  bond: Bond;
  atom1: Atom;
  atom2: Atom;
  visualizationOptions: VisualizationOptions;
}

export const BondRenderer: React.FC<BondRendererProps> = ({
  bond,
  atom1,
  atom2,
  visualizationOptions,
}) => {
  // Calculate bond properties
  const start = new THREE.Vector3(atom1.position.x, atom1.position.y, atom1.position.z);
  const end = new THREE.Vector3(atom2.position.x, atom2.position.y, atom2.position.z);
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  
  // Calculate rotation
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  const getBondRadius = (): number => {
    const baseRadius = 0.1;
    return baseRadius * visualizationOptions.bondScale;
  };

  const getBondCount = (): number => {
    switch (bond.type) {
      case 'single': return 1;
      case 'double': return 2;
      case 'triple': return 3;
      case 'aromatic': return 1;
      default: return 1;
    }
  };

  const getBondColor = (): string => {
    switch (bond.type) {
      case 'single': return '#888888';
      case 'double': return '#666666';
      case 'triple': return '#444444';
      case 'aromatic': return '#ff6b6b';
      default: return '#888888';
    }
  };

  const bondCount = getBondCount();
  const bondRadius = getBondRadius();
  const bondColor = getBondColor();

  // Don't render bonds in wireframe mode
  if (visualizationOptions.style === 'wireframe') {
    return null;
  }

  // Render multiple cylinders for double and triple bonds
  const bonds = [];
  for (let i = 0; i < bondCount; i++) {
    let offset = new THREE.Vector3(0, 0, 0);
    
    if (bondCount > 1) {
      // Calculate perpendicular vector for offset
      const perpendicular = new THREE.Vector3();
      if (Math.abs(direction.y) < 0.9) {
        perpendicular.crossVectors(direction, new THREE.Vector3(0, 1, 0));
      } else {
        perpendicular.crossVectors(direction, new THREE.Vector3(1, 0, 0));
      }
      perpendicular.normalize();
      
      // Offset each bond cylinder
      const offsetDistance = bondRadius * 2.5;
      if (bondCount === 2) {
        offset = perpendicular.clone().multiplyScalar((i - 0.5) * offsetDistance);
      } else if (bondCount === 3) {
        offset = perpendicular.clone().multiplyScalar((i - 1) * offsetDistance);
      }
    }

    const bondPosition = midpoint.clone().add(offset);

    bonds.push(
      <Cylinder
        key={i}
        position={[bondPosition.x, bondPosition.y, bondPosition.z]}
        args={[bondRadius, bondRadius, distance, 8]}
        rotation={[quaternion.x, quaternion.y, quaternion.z]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={bondColor}
          transparent={bond.type === 'aromatic'}
          opacity={bond.type === 'aromatic' ? 0.7 : visualizationOptions.transparency}
          roughness={0.4}
          metalness={0.2}
        />
      </Cylinder>
    );
  }

  return <group>{bonds}</group>;
};