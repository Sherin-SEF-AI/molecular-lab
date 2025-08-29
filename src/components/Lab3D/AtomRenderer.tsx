import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
// import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import type { Atom, VisualizationOptions } from '../../types/molecular';
import { getElementColor, getVanDerWaalsRadius } from '../../data/elements';
import { useLabStore } from '../../store/labStore';

interface AtomRendererProps {
  atom: Atom;
  visualizationOptions: VisualizationOptions;
}

export const AtomRenderer: React.FC<AtomRendererProps> = ({
  atom,
  visualizationOptions,
}) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const { selectAtoms, selection } = useLabStore();
  
  // Physics body for the atom (currently unused)
  // const [ref, api] = useSphere(() => ({
  //   mass: 1,
  //   position: [atom.position.x, atom.position.y, atom.position.z],
  //   args: [getRadius()],
  // }));

  function getRadius(): number {
    const baseRadius = getVanDerWaalsRadius(atom.element);
    
    switch (visualizationOptions.style) {
      case 'space-filling':
        return baseRadius * visualizationOptions.atomScale;
      case 'ball-stick':
        return baseRadius * 0.3 * visualizationOptions.atomScale;
      case 'wireframe':
        return 0.1 * visualizationOptions.atomScale;
      default:
        return baseRadius * 0.3 * visualizationOptions.atomScale;
    }
  }

  function getColor(): string {
    if (atom.selected) return '#ffff00';
    if (hovered) return '#ff6b6b';
    return getElementColor(atom.element);
  }

  const handleClick = (event: any) => {
    event?.stopPropagation?.();
    setClicked(!clicked);
    
    if (event?.shiftKey) {
      // Multi-select with shift key
      const currentSelection = selection.selectedAtoms;
      if (currentSelection.includes(atom.id)) {
        selectAtoms(currentSelection.filter(id => id !== atom.id));
      } else {
        selectAtoms([...currentSelection, atom.id]);
      }
    } else {
      // Single select
      selectAtoms([atom.id]);
    }
  };

  useFrame((state) => {
    if (meshRef.current && atom.selected) {
      // Add subtle pulsing animation for selected atoms
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const isSelected = selection.selectedAtoms.includes(atom.id);
  const radius = getRadius();

  return (
    <group>
      <Sphere
        ref={meshRef}
        position={[atom.position.x, atom.position.y, atom.position.z]}
        args={[radius, 32, 32]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={getColor()}
          transparent={visualizationOptions.style === 'wireframe'}
          opacity={
            visualizationOptions.style === 'wireframe' 
              ? 0.3 
              : visualizationOptions.transparency
          }
          wireframe={visualizationOptions.style === 'wireframe'}
          roughness={0.3}
          metalness={0.1}
          emissive={isSelected ? '#222200' : '#000000'}
        />
      </Sphere>

      {/* Atom label */}
      {(visualizationOptions.showLabels || hovered) && (
        <Html
          position={[atom.position.x, atom.position.y + radius + 0.5, atom.position.z]}
          center
          occlude
        >
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '12px', 
            fontWeight: '600', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}>
            <div style={{ color: '#1f2937' }}>{atom.element}</div>
            {visualizationOptions.showCharges && atom.charge !== 0 && (
              <div style={{ color: '#2563eb', fontSize: '10px' }}>
                {atom.charge > 0 ? '+' : ''}{atom.charge}
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <Sphere
          position={[atom.position.x, atom.position.y, atom.position.z]}
          args={[radius * 1.2, 16, 16]}
        >
          <meshBasicMaterial
            color="#ffff00"
            transparent
            opacity={0.2}
            wireframe
          />
        </Sphere>
      )}
    </group>
  );
};