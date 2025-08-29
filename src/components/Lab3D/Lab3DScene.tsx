import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Stats } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { useLabStore } from '../../store/labStore';
import { MoleculeRenderer } from './MoleculeRenderer';
import { LabEnvironment } from './LabEnvironment';
import { MolecularDynamics } from './MolecularDynamics';
import { AtomPlacer } from './AtomPlacer';

interface Lab3DSceneProps {
  style?: React.CSSProperties;
  placementElement?: string | null;
  isPlacementMode?: boolean;
}

export const Lab3DScene: React.FC<Lab3DSceneProps> = ({ 
  style, 
  placementElement = null, 
  isPlacementMode = false 
}) => {
  const { molecules, visualization, camera } = useLabStore();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
      <Canvas
        camera={{
          position: [camera.position.x, camera.position.y, camera.position.z],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]} allowSleep={false}>
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            
            <LabEnvironment />
            
            <Grid
              position={[0, -5, 0]}
              args={[20, 20]}
              cellSize={1}
              cellThickness={0.5}
              cellColor="#6f6f6f"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#9f9f9f"
              fadeDistance={50}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={true}
            />
            
            {molecules.map((molecule) => (
              <MoleculeRenderer
                key={molecule.id}
                molecule={molecule}
                visualizationOptions={visualization}
              />
            ))}
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              dampingFactor={0.05}
              minDistance={2}
              maxDistance={100}
              target={[camera.target.x, camera.target.y, camera.target.z]}
            />
            
            <Environment preset="studio" />
            
            <MolecularDynamics />
            <AtomPlacer 
              elementSymbol={placementElement} 
              isPlacementMode={isPlacementMode} 
            />
          </Physics>
        </Suspense>
        
        <Stats />
      </Canvas>
    </div>
  );
};