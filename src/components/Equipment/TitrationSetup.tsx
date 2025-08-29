import React, { useState, useEffect } from 'react';
import { Beaker, DropletIcon, TrendingUp } from 'lucide-react';

interface TitrationData {
  volume: number;
  pH: number;
}

export const TitrationSetup: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [titrationData, setTitrationData] = useState<TitrationData[]>([]);
  const [analyte, setAnalyte] = useState('HCl');
  const [titrant, setTitrant] = useState('NaOH');
  const [concentration, setConcentration] = useState(0.1);

  // Simulate pH curve for strong acid-strong base titration
  const calculatePH = (volume: number): number => {
    // const Ka = analyte === 'HCl' ? 1e6 : 1.8e-5; // Strong vs weak acid
    const initialMoles = 0.001; // 1 mM in 1 L
    const titrantMoles = volume * concentration / 1000;
    
    if (volume === 0) {
      return analyte === 'HCl' ? 1 : 4.76; // Initial pH
    }
    
    const excessAcid = initialMoles - titrantMoles;
    
    if (excessAcid > 0) {
      // Before equivalence point
      const totalVolume = 1 + volume / 1000;
      const concentration = excessAcid / totalVolume;
      return -Math.log10(concentration);
    } else if (excessAcid < 0) {
      // After equivalence point
      const excessBase = Math.abs(excessAcid);
      const totalVolume = 1 + volume / 1000;
      const ohConcentration = excessBase / totalVolume;
      const pOH = -Math.log10(ohConcentration);
      return 14 - pOH;
    } else {
      // Equivalence point
      return 7; // For strong acid-strong base
    }
  };

  const addTitrantDrop = () => {
    const newVolume = currentVolume + 0.1; // Add 0.1 mL
    const pH = calculatePH(newVolume);
    
    setCurrentVolume(newVolume);
    setTitrationData(prev => [...prev, { volume: newVolume, pH }]);
  };

  const startAutomaticTitration = () => {
    setIsRunning(true);
  };

  const stopTitration = () => {
    setIsRunning(false);
  };

  const resetTitration = () => {
    setIsRunning(false);
    setCurrentVolume(0);
    setTitrationData([]);
  };

  useEffect(() => {
    let interval: any;
    
    if (isRunning && currentVolume < 25) {
      interval = setInterval(() => {
        addTitrantDrop();
      }, 500); // Add drop every 500ms
    } else if (currentVolume >= 25) {
      setIsRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, currentVolume]);

  const currentPH = titrationData.length > 0 ? titrationData[titrationData.length - 1].pH : calculatePH(0);
  const equivalencePoint = titrationData.find(point => Math.abs(point.pH - 7) < 0.1);

  return (
    <div className="ui-panel titration-panel">
      <div className="flex items-center gap-2 mb-4">
        <Beaker size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Titration Setup</h3>
      </div>

      {/* Solution Setup */}
      <div className="solution-setup mb-4">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Analyte:</label>
            <select 
              value={analyte}
              onChange={(e) => setAnalyte(e.target.value)}
              className="w-full"
            >
              <option value="HCl">HCl (Strong acid)</option>
              <option value="CH3COOH">CH₃COOH (Weak acid)</option>
              <option value="NH3">NH₃ (Weak base)</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Titrant:</label>
            <select
              value={titrant}
              onChange={(e) => setTitrant(e.target.value)}
              className="w-full"
            >
              <option value="NaOH">NaOH (Strong base)</option>
              <option value="HCl">HCl (Strong acid)</option>
            </select>
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Titrant Concentration: {concentration} M
          </label>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={concentration}
            onChange={(e) => setConcentration(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Current Readings */}
      <div className="current-readings mb-4 p-3" style={{ background: '#f8fafc', borderRadius: '6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
          <div>
            <div className="text-xs text-gray-600">Volume Added</div>
            <div className="font-bold text-lg" style={{ color: '#3b82f6' }}>
              {currentVolume.toFixed(1)} mL
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-600">Current pH</div>
            <div className="font-bold text-lg" style={{ 
              color: currentPH < 7 ? '#ef4444' : currentPH > 7 ? '#3b82f6' : '#10b981' 
            }}>
              {currentPH.toFixed(2)}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-600">Equivalence Point</div>
            <div className="font-bold text-sm" style={{ color: equivalencePoint ? '#10b981' : '#6b7280' }}>
              {equivalencePoint ? `${equivalencePoint.volume.toFixed(1)} mL` : 'Not reached'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="titration-controls mb-4">
        <div className="flex gap-2 mb-2">
          <button
            onClick={addTitrantDrop}
            disabled={isRunning || currentVolume >= 25}
            className="flex items-center gap-2 btn-primary flex-1"
          >
            <DropletIcon size={14} />
            Add Drop
          </button>
          
          <button
            onClick={isRunning ? stopTitration : startAutomaticTitration}
            disabled={currentVolume >= 25}
            className={`flex items-center gap-2 flex-1 ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
          >
            {isRunning ? 'Stop' : 'Auto Titrate'}
          </button>
        </div>
        
        <button
          onClick={resetTitration}
          className="btn-secondary w-full"
        >
          Reset Experiment
        </button>
      </div>

      {/* pH Curve */}
      <div className="ph-curve">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} />
          <span className="text-sm font-semibold text-gray-700">pH Curve</span>
        </div>
        
        <div 
          className="curve-container" 
          style={{ 
            height: '150px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '4px',
            background: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* pH Scale */}
          <div style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '10px', color: '#6b7280' }}>
            pH 14
          </div>
          <div style={{ position: 'absolute', left: '8px', top: '50%', fontSize: '10px', color: '#6b7280' }}>
            pH 7
          </div>
          <div style={{ position: 'absolute', left: '8px', bottom: '8px', fontSize: '10px', color: '#6b7280' }}>
            pH 0
          </div>
          
          {/* Volume Scale */}
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '10px', color: '#6b7280' }}>
            25 mL
          </div>

          {/* Plot points */}
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            {titrationData.length > 1 && titrationData.map((point, index) => {
              if (index === 0) return null;
              
              const prevPoint = titrationData[index - 1];
              const x1 = (prevPoint.volume / 25) * 100;
              const y1 = 100 - (prevPoint.pH / 14) * 100;
              const x2 = (point.volume / 25) * 100;
              const y2 = 100 - (point.pH / 14) * 100;
              
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
            
            {/* Current point */}
            {titrationData.length > 0 && (
              <circle
                cx={`${(currentVolume / 25) * 100}%`}
                cy={`${100 - (currentPH / 14) * 100}%`}
                r="3"
                fill="#ef4444"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Analysis Results */}
      {equivalencePoint && (
        <div className="analysis-results mt-4 p-3" style={{ background: '#ecfdf5', borderRadius: '6px', border: '1px solid #10b981' }}>
          <div className="text-sm font-semibold text-green-800 mb-1">Analysis Complete</div>
          <div className="text-xs text-green-700">
            <div>Equivalence Point: {equivalencePoint.volume.toFixed(2)} mL</div>
            <div>Calculated Concentration: {(0.1 * equivalencePoint.volume / 10).toFixed(3)} M</div>
          </div>
        </div>
      )}
    </div>
  );
};