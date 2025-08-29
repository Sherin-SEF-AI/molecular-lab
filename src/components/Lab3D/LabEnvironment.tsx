import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const LabEnvironment: React.FC = () => {
  const labTableRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (labTableRef.current) {
      // Subtle animation for the lab table
      labTableRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });

  return (
    <group>
      {/* Lab Table */}
      <Box
        ref={labTableRef}
        position={[0, -3, 0]}
        args={[12, 0.5, 8]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.8}
          metalness={0.1}
        />
      </Box>
      
      {/* Lab Table Legs */}
      {[
        [-5, -4.5, -3.5],
        [5, -4.5, -3.5],
        [-5, -4.5, 3.5],
        [5, -4.5, 3.5]
      ].map((position, index) => (
        <Box
          key={index}
          position={position as [number, number, number]}
          args={[0.3, 3, 0.3]}
          castShadow
        >
          <meshStandardMaterial color="#654321" />
        </Box>
      ))}
      
      {/* Floating particles for atmosphere */}
      {Array.from({ length: 20 }).map((_, index) => (
        <Sphere
          key={index}
          position={[
            (Math.random() - 0.5) * 20,
            Math.random() * 15 - 5,
            (Math.random() - 0.5) * 20
          ]}
          args={[0.02]}
        >
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.3}
          />
        </Sphere>
      ))}
      
      {/* Background laboratory equipment silhouettes */}
      <group position={[-8, 0, -5]}>
        <Box args={[1, 3, 1]} position={[0, -1, 0]}>
          <meshStandardMaterial color="#333333" opacity={0.3} transparent />
        </Box>
        <Box args={[0.5, 1, 0.5]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#666666" opacity={0.3} transparent />
        </Box>
      </group>
      
      <group position={[8, 0, -5]}>
        <Box args={[1.5, 2, 1]} position={[0, -2, 0]}>
          <meshStandardMaterial color="#444444" opacity={0.3} transparent />
        </Box>
      </group>
    </group>
  );
};