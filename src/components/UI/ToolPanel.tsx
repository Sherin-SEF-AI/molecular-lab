import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Atom, Grid3x3 } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { createWaterMolecule, createMethaneMolecule, createAmmoniaeMolecule, createCarbonDioxideMolecule } from '../../utils/moleculeBuilders';
import { PeriodicTableModal } from './PeriodicTableModal';
import { Vector3 } from 'three';
import type { Element } from '../../data/elements';

export const ToolPanel: React.FC = () => {
  const [showPeriodicTable, setShowPeriodicTable] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  
  const { 
    addMolecule, 
    isSimulating, 
    startSimulation, 
    stopSimulation, 
    reset,
    visualization,
    setVisualizationOptions
  } = useLabStore();

  const handleAddMolecule = (type: string) => {
    const position = new Vector3(
      (Math.random() - 0.5) * 6,
      Math.random() * 2,
      (Math.random() - 0.5) * 6
    );

    switch (type) {
      case 'water':
        addMolecule(createWaterMolecule(position));
        break;
      case 'methane':
        addMolecule(createMethaneMolecule(position));
        break;
      case 'ammonia':
        addMolecule(createAmmoniaeMolecule(position));
        break;
      case 'co2':
        addMolecule(createCarbonDioxideMolecule(position));
        break;
    }
  };

  const handleVisualizationChange = (style: any) => {
    setVisualizationOptions({ style });
  };

  const handleElementSelect = (element: Element) => {
    setSelectedElement(element);
    // TODO: Add logic to place individual atoms in the 3D scene
    console.log('Selected element:', element.symbol);
  };

  return (
    <>
      <PeriodicTableModal
        isOpen={showPeriodicTable}
        onClose={() => setShowPeriodicTable(false)}
        onElementSelect={handleElementSelect}
      />
    <div className="ui-panel tool-panel">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Molecular Lab Tools</h2>
      
      {/* Simulation Controls */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Simulation</h3>
        <div className="flex gap-2">
          <button
            onClick={isSimulating ? stopSimulation : startSimulation}
            className="flex items-center gap-2 btn-primary"
          >
            {isSimulating ? <Pause size={16} /> : <Play size={16} />}
            {isSimulating ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={reset}
            className="flex items-center gap-2 btn-secondary"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Element Selection */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Element Selection</h3>
        <button
          onClick={() => setShowPeriodicTable(true)}
          className="flex items-center gap-2 btn-primary w-full"
          style={{ justifyContent: 'center' }}
        >
          <Grid3x3 size={16} />
          Periodic Table
        </button>
        {selectedElement && (
          <div style={{ marginTop: '8px', padding: '8px', background: '#f3f4f6', borderRadius: '4px' }}>
            <span className="text-xs text-gray-600">Selected: </span>
            <span className="font-semibold">{selectedElement.name} ({selectedElement.symbol})</span>
          </div>
        )}
      </div>

      {/* Add Molecules */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Add Molecules</h3>
        <div className="grid-cols-2">
          <button
            onClick={() => handleAddMolecule('water')}
            className="molecule-btn water"
          >
            <Atom size={14} />
            H₂O
          </button>
          
          <button
            onClick={() => handleAddMolecule('methane')}
            className="molecule-btn methane"
          >
            <Atom size={14} />
            CH₄
          </button>
          
          <button
            onClick={() => handleAddMolecule('ammonia')}
            className="molecule-btn ammonia"
          >
            <Atom size={14} />
            NH₃
          </button>
          
          <button
            onClick={() => handleAddMolecule('co2')}
            className="molecule-btn co2"
          >
            <Atom size={14} />
            CO₂
          </button>
        </div>
      </div>

      {/* Visualization Controls */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Visualization Style</h3>
        <select
          value={visualization.style}
          onChange={(e) => handleVisualizationChange(e.target.value)}
          className="w-full"
        >
          <option value="ball-stick">Ball & Stick</option>
          <option value="space-filling">Space Filling</option>
          <option value="wireframe">Wireframe</option>
        </select>
      </div>

      {/* Display Options */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Display Options</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={visualization.showLabels}
              onChange={(e) => setVisualizationOptions({ showLabels: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Show Labels</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={visualization.showBonds}
              onChange={(e) => setVisualizationOptions({ showBonds: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Show Bonds</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={visualization.showCharges}
              onChange={(e) => setVisualizationOptions({ showCharges: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Show Charges</span>
          </label>
        </div>
      </div>

      {/* Scale Controls */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Scale</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-600">Atoms: {visualization.atomScale.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={visualization.atomScale}
              onChange={(e) => setVisualizationOptions({ atomScale: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600">Bonds: {visualization.bondScale.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={visualization.bondScale}
              onChange={(e) => setVisualizationOptions({ bondScale: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};