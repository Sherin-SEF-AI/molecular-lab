import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, TrendingUp, FlaskConical } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { createWaterMolecule } from '../../utils/moleculeBuilders';
import { Vector3 } from 'three';

interface Reaction {
  id: string;
  name: string;
  equation: string;
  reactants: string[];
  products: string[];
  activationEnergy: number; // kJ/mol
  deltaH: number; // kJ/mol (negative = exothermic, positive = endothermic)
  rateConstant: number;
}

const availableReactions: Reaction[] = [
  {
    id: 'combustion-methane',
    name: 'Methane Combustion',
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    reactants: ['CH₄', 'O₂'],
    products: ['CO₂', 'H₂O'],
    activationEnergy: 556,
    deltaH: -890,
    rateConstant: 0.1,
  },
  {
    id: 'water-formation',
    name: 'Water Formation',
    equation: '2H₂ + O₂ → 2H₂O',
    reactants: ['H₂', 'O₂'],
    products: ['H₂O'],
    activationEnergy: 436,
    deltaH: -572,
    rateConstant: 0.05,
  },
  {
    id: 'ammonia-synthesis',
    name: 'Haber Process',
    equation: 'N₂ + 3H₂ ⇌ 2NH₃',
    reactants: ['N₂', 'H₂'],
    products: ['NH₃'],
    activationEnergy: 335,
    deltaH: -92,
    rateConstant: 0.02,
  }
];

export const ReactionSimulator: React.FC = () => {
  const [selectedReaction, setSelectedReaction] = useState<Reaction>(availableReactions[0]);
  const [reactionProgress, setReactionProgress] = useState(0);
  const [isReactionRunning, setIsReactionRunning] = useState(false);
  const [reactionRate, setReactionRate] = useState(1);
  const [energyProfile, setEnergyProfile] = useState<number[]>([]);
  
  const { temperature, addMolecule, reset } = useLabStore();

  // Calculate reaction rate based on temperature (Arrhenius equation)
  const calculateReactionRate = (reaction: Reaction, temp: number): number => {
    const R = 8.314; // Gas constant J/(mol·K)
    const A = reaction.rateConstant; // Pre-exponential factor
    const Ea = reaction.activationEnergy * 1000; // Convert to J/mol
    
    return A * Math.exp(-Ea / (R * temp));
  };

  // Generate energy profile for reaction coordinate
  useEffect(() => {
    const points = 100;
    const profile: number[] = [];
    
    for (let i = 0; i <= points; i++) {
      const x = i / points; // Reaction coordinate (0 to 1)
      
      // Energy profile shape: reactants -> transition state -> products
      if (x < 0.5) {
        // Going up to transition state
        const progress = x / 0.5;
        const energy = selectedReaction.activationEnergy * Math.sin(progress * Math.PI / 2);
        profile.push(energy);
      } else {
        // Going down to products
        const progress = (x - 0.5) / 0.5;
        const maxEnergy = selectedReaction.activationEnergy;
        const finalEnergy = selectedReaction.deltaH;
        const energy = maxEnergy + (finalEnergy - maxEnergy) * progress;
        profile.push(energy);
      }
    }
    
    setEnergyProfile(profile);
  }, [selectedReaction]);

  // Run reaction simulation
  useEffect(() => {
    let interval: any;
    
    if (isReactionRunning && reactionProgress < 100) {
      const rate = calculateReactionRate(selectedReaction, temperature) * reactionRate;
      
      interval = setInterval(() => {
        setReactionProgress(prev => {
          const newProgress = prev + rate;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 100);
    } else if (reactionProgress >= 100) {
      setIsReactionRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isReactionRunning, reactionProgress, selectedReaction, temperature, reactionRate]);

  const startReaction = () => {
    setIsReactionRunning(true);
  };

  const pauseReaction = () => {
    setIsReactionRunning(false);
  };

  const resetReaction = () => {
    setIsReactionRunning(false);
    setReactionProgress(0);
    reset(); // Clear existing molecules
  };

  const addReactants = () => {
    reset();
    
    // Add reactant molecules to the scene
    if (selectedReaction.id === 'combustion-methane') {
      // Add methane and oxygen molecules
      addMolecule(createWaterMolecule(new Vector3(-3, 0, 0))); // Placeholder - should be methane
      addMolecule(createWaterMolecule(new Vector3(3, 0, 0))); // Placeholder - should be O2
    } else if (selectedReaction.id === 'water-formation') {
      // Add hydrogen and oxygen
      addMolecule(createWaterMolecule(new Vector3(-2, 0, -2)));
      addMolecule(createWaterMolecule(new Vector3(2, 0, 2)));
    }
  };

  const currentEnergy = energyProfile[Math.floor(reactionProgress / 100 * (energyProfile.length - 1))] || 0;
  const isExothermic = selectedReaction.deltaH < 0;

  return (
    <div className="ui-panel reaction-simulator">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical size={20} className="text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Reaction Simulator</h3>
      </div>

      {/* Reaction Selection */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 block mb-2">Select Reaction:</label>
        <select
          value={selectedReaction.id}
          onChange={(e) => {
            const reaction = availableReactions.find(r => r.id === e.target.value);
            if (reaction) setSelectedReaction(reaction);
          }}
          className="w-full"
        >
          {availableReactions.map(reaction => (
            <option key={reaction.id} value={reaction.id}>
              {reaction.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reaction Equation */}
      <div className="reaction-equation mb-4 p-3" style={{ background: '#f0fdf4', borderRadius: '6px', border: '1px solid #16a34a' }}>
        <div className="text-sm font-bold text-center text-gray-800">
          {selectedReaction.equation}
        </div>
        <div className="text-xs text-center text-gray-600 mt-1">
          ΔH = {selectedReaction.deltaH} kJ/mol ({isExothermic ? 'Exothermic' : 'Endothermic'})
        </div>
      </div>

      {/* Reaction Progress */}
      <div className="reaction-progress mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress:</span>
          <span className="text-sm font-bold text-blue-600">{reactionProgress.toFixed(1)}%</span>
        </div>
        
        <div className="progress-bar" style={{ 
          width: '100%', 
          height: '8px', 
          background: '#e5e7eb', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              width: `${reactionProgress}%`, 
              height: '100%',
              background: isExothermic ? '#10b981' : '#ef4444',
              transition: 'width 0.1s ease',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="reaction-controls mb-4">
        <div className="flex gap-2 mb-2">
          <button
            onClick={addReactants}
            className="btn-secondary flex-1 text-xs"
          >
            Add Reactants
          </button>
          
          <button
            onClick={isReactionRunning ? pauseReaction : startReaction}
            disabled={reactionProgress >= 100}
            className="btn-primary flex-1 text-xs flex items-center gap-1"
          >
            {isReactionRunning ? <Pause size={12} /> : <Play size={12} />}
            {isReactionRunning ? 'Pause' : 'Start'}
          </button>
        </div>
        
        <button
          onClick={resetReaction}
          className="btn-secondary w-full text-xs flex items-center gap-1 justify-center"
        >
          <RotateCcw size={12} />
          Reset Reaction
        </button>
      </div>

      {/* Reaction Rate Control */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 block mb-1">
          Rate Multiplier: {reactionRate.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={reactionRate}
          onChange={(e) => setReactionRate(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Energy Profile */}
      <div className="energy-profile">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} />
          <span className="text-sm font-semibold text-gray-700">Energy Profile</span>
        </div>
        
        <div 
          style={{ 
            height: '120px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '4px',
            background: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Energy curve */}
          <svg width="100%" height="100%" style={{ position: 'absolute' }}>
            {energyProfile.length > 1 && energyProfile.map((energy, index) => {
              if (index === 0) return null;
              
              const prevEnergy = energyProfile[index - 1];
              const x1 = ((index - 1) / (energyProfile.length - 1)) * 100;
              const y1 = 100 - ((prevEnergy - Math.min(...energyProfile)) / (Math.max(...energyProfile) - Math.min(...energyProfile))) * 80;
              const x2 = (index / (energyProfile.length - 1)) * 100;
              const y2 = 100 - ((energy - Math.min(...energyProfile)) / (Math.max(...energyProfile) - Math.min(...energyProfile))) * 80;
              
              return (
                <line
                  key={index}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* Current position indicator */}
            <circle
              cx={`${reactionProgress}%`}
              cy={`${100 - ((currentEnergy - Math.min(...energyProfile)) / (Math.max(...energyProfile) - Math.min(...energyProfile))) * 80}%`}
              r="4"
              fill="#ef4444"
            />
            
            {/* Labels */}
            <text x="5%" y="95%" fontSize="10" fill="#6b7280">Reactants</text>
            <text x="85%" y="95%" fontSize="10" fill="#6b7280">Products</text>
            <text x="45%" y="15%" fontSize="10" fill="#6b7280">TS</text>
          </svg>
        </div>

        <div className="energy-info mt-2 text-xs text-gray-600">
          <div>Current Energy: {currentEnergy.toFixed(1)} kJ/mol</div>
          <div>Activation Energy: {selectedReaction.activationEnergy} kJ/mol</div>
          <div>Rate at {temperature.toFixed(0)}K: {calculateReactionRate(selectedReaction, temperature).toExponential(2)} s⁻¹</div>
        </div>
      </div>

      {/* Reaction Conditions */}
      <div className="reaction-conditions mt-4 p-3" style={{ background: '#fef3c7', borderRadius: '6px', border: '1px solid #f59e0b' }}>
        <div className="text-sm font-semibold text-amber-800 mb-2">Reaction Conditions</div>
        <div className="text-xs text-amber-700">
          <div>Temperature: {(temperature - 273.15).toFixed(1)}°C</div>
          <div>Type: {isExothermic ? 'Exothermic' : 'Endothermic'}</div>
          <div>Phase: {temperature > 373 ? 'Gas' : temperature > 273 ? 'Liquid' : 'Solid'}</div>
        </div>
      </div>

      {/* Reaction Analytics */}
      {reactionProgress > 0 && (
        <div className="reaction-analytics mt-4 p-3" style={{ background: '#ecfdf5', borderRadius: '6px', border: '1px solid #10b981' }}>
          <div className="text-sm font-semibold text-green-800 mb-2">Reaction Analytics</div>
          <div className="text-xs text-green-700">
            <div>Conversion: {reactionProgress.toFixed(1)}%</div>
            <div>Time Elapsed: {(reactionProgress / (calculateReactionRate(selectedReaction, temperature) * reactionRate * 10)).toFixed(1)}s</div>
            <div>Heat {isExothermic ? 'Released' : 'Absorbed'}: {Math.abs(selectedReaction.deltaH * reactionProgress / 100).toFixed(1)} kJ/mol</div>
          </div>
        </div>
      )}
    </div>
  );
};