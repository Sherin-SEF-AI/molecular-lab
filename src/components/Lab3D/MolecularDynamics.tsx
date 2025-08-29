import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLabStore } from '../../store/labStore';
// import type { Molecule, Atom } from '../../types/molecular';

export const MolecularDynamics: React.FC = () => {
  const { molecules, updateMolecule, isSimulating, temperature } = useLabStore();
  const velocities = useRef<Map<string, THREE.Vector3>>(new Map());
  const forces = useRef<Map<string, THREE.Vector3>>(new Map());

  // Initialize velocities for new atoms
  useEffect(() => {
    molecules.forEach(molecule => {
      molecule.atoms.forEach(atom => {
        if (!velocities.current.has(atom.id)) {
          // Initialize with Maxwell-Boltzmann distribution
          const kT = temperature * 8.314e-3; // kT in kJ/mol
          const mass = 1; // Simplified mass
          const sigma = Math.sqrt(kT / mass);
          
          velocities.current.set(atom.id, new THREE.Vector3(
            (Math.random() - 0.5) * sigma,
            (Math.random() - 0.5) * sigma,
            (Math.random() - 0.5) * sigma
          ));
          
          forces.current.set(atom.id, new THREE.Vector3(0, 0, 0));
        }
      });
    });
  }, [molecules, temperature]);

  useFrame((_, delta) => {
    if (!isSimulating) return;

    const dampingFactor = 0.99; // Energy damping to prevent explosion
    const timeStep = Math.min(delta, 0.016); // Cap at ~60fps
    
    molecules.forEach((molecule) => {
      const updatedAtoms = molecule.atoms.map(atom => {
        const atomId = atom.id;
        let velocity = velocities.current.get(atomId) || new THREE.Vector3();
        let force = forces.current.get(atomId) || new THREE.Vector3();
        
        // Reset forces
        force.set(0, 0, 0);
        
        // Calculate forces from other atoms
        molecule.atoms.forEach(otherAtom => {
          if (otherAtom.id === atomId) return;
          
          const r1 = new THREE.Vector3(atom.position.x, atom.position.y, atom.position.z);
          const r2 = new THREE.Vector3(otherAtom.position.x, otherAtom.position.y, otherAtom.position.z);
          const distance = r1.distanceTo(r2);
          
          if (distance > 0) {
            // Check if atoms are bonded
            const isBonded = molecule.bonds.some(bond => 
              (bond.atom1 === atomId && bond.atom2 === otherAtom.id) ||
              (bond.atom2 === atomId && bond.atom1 === otherAtom.id)
            );
            
            const direction = r1.clone().sub(r2).normalize();
            
            if (isBonded) {
              // Spring force for bonded atoms
              const bond = molecule.bonds.find(bond => 
                (bond.atom1 === atomId && bond.atom2 === otherAtom.id) ||
                (bond.atom2 === atomId && bond.atom1 === otherAtom.id)
              );
              
              if (bond) {
                const equilibriumDistance = bond.length;
                const displacement = distance - equilibriumDistance;
                const springConstant = 100; // N/m
                const springForce = -springConstant * displacement;
                
                force.add(direction.multiplyScalar(springForce));
              }
            } else {
              // Van der Waals forces for non-bonded atoms
              if (distance < 5.0) { // Only calculate for nearby atoms
                // Lennard-Jones potential: F = -dU/dr
                const sigma = 3.4; // Å
                const epsilon = 0.1; // kJ/mol
                
                const sigmaOverR6 = Math.pow(sigma / distance, 6);
                const sigmaOverR12 = sigmaOverR6 * sigmaOverR6;
                
                const ljForce = 24 * epsilon * (2 * sigmaOverR12 - sigmaOverR6) / distance;
                force.add(direction.multiplyScalar(ljForce));
              }
            }
          }
        });
        
        // Add thermal motion
        const thermalForceScale = Math.sqrt(temperature / 298.15) * 0.1;
        force.add(new THREE.Vector3(
          (Math.random() - 0.5) * thermalForceScale,
          (Math.random() - 0.5) * thermalForceScale,
          (Math.random() - 0.5) * thermalForceScale
        ));
        
        // Update velocity (Verlet integration)
        velocity.add(force.clone().multiplyScalar(timeStep));
        velocity.multiplyScalar(dampingFactor); // Apply damping
        
        // Update position
        const newPosition = new THREE.Vector3(
          atom.position.x,
          atom.position.y,
          atom.position.z
        ).add(velocity.clone().multiplyScalar(timeStep));
        
        // Boundary conditions (keep atoms in reasonable space)
        newPosition.x = Math.max(-10, Math.min(10, newPosition.x));
        newPosition.y = Math.max(-5, Math.min(10, newPosition.y));
        newPosition.z = Math.max(-10, Math.min(10, newPosition.z));
        
        // Store updated velocity and force
        velocities.current.set(atomId, velocity);
        forces.current.set(atomId, force);
        
        return {
          ...atom,
          position: newPosition,
        };
      });
      
      // Update molecule with new atom positions
      updateMolecule(molecule.id, { atoms: updatedAtoms });
    });
  });

  return null; // This component only handles simulation logic
};