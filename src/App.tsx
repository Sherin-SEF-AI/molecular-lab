import type { FC } from 'react';
import { useState } from 'react';
import { Lab3DScene } from './components/Lab3D/Lab3DScene';
import { ToolPanel } from './components/UI/ToolPanel';
import { StatusPanel } from './components/UI/StatusPanel';
import { PropertyInspector } from './components/UI/PropertyInspector';
import { EquipmentPanel } from './components/UI/EquipmentPanel';
import { EnvironmentControls } from './components/UI/EnvironmentControls';
import { TutorialSystem } from './components/Tutorial/TutorialSystem';

const App: FC = () => {
  const [placementElement] = useState<string | null>(null);
  const [isPlacementMode] = useState(false);
  const [showTutorials, setShowTutorials] = useState(false);

  return (
    <div className="lab-container">
      {/* Main 3D Scene */}
      <Lab3DScene 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        placementElement={placementElement}
        isPlacementMode={isPlacementMode}
      />
      
      {/* UI Overlays */}
      <ToolPanel />
      <StatusPanel />
      <PropertyInspector />
      <EquipmentPanel />
      <EnvironmentControls />
      
      {/* Header */}
      <div className="ui-panel header-panel">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Molecular Chemistry Lab
          </h1>
          <p className="text-xs text-gray-600">
            Advanced 3D Laboratory Simulator
          </p>
        </div>
        <button
          onClick={() => setShowTutorials(true)}
          className="btn-primary text-xs flex items-center gap-2"
        >
          📚 Tutorials
        </button>
      </div>
      
      {/* Instructions */}
      <div className="ui-panel instructions-panel">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Quick Start</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Add molecules or use periodic table</p>
          <p>• Click atoms to inspect properties</p>
          <p>• Use virtual lab equipment</p>
          <p>• Start simulation for molecular dynamics</p>
          <p>• Export spectra and data</p>
        </div>
      </div>

      {/* Tutorial System */}
      <TutorialSystem 
        isVisible={showTutorials}
        onClose={() => setShowTutorials(false)}
      />
    </div>
  );
};

export default App;
