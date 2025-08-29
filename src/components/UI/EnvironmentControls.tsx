import React from 'react';
import { Thermometer, Gauge, Zap, Settings } from 'lucide-react';
import { useLabStore } from '../../store/labStore';

export const EnvironmentControls: React.FC = () => {
  const { 
    temperature, 
    pressure, 
    setTemperature, 
    setPressure,
    molecules,
    isSimulating
  } = useLabStore();

  const totalEnergy = molecules.reduce((sum, mol) => sum + (mol.energy || 0), 0);
  const avgKineticEnergy = isSimulating ? temperature * 0.0083144 : 0; // RT in kJ/mol

  const temperaturePresets = [
    { name: 'Liquid Nitrogen', temp: 77, color: '#60a5fa' },
    { name: 'Ice', temp: 273, color: '#93c5fd' },
    { name: 'Room Temp', temp: 298, color: '#34d399' },
    { name: 'Body Temp', temp: 310, color: '#fbbf24' },
    { name: 'Boiling Water', temp: 373, color: '#f87171' },
    { name: 'High Heat', temp: 500, color: '#dc2626' },
  ];

  const pressurePresets = [
    { name: 'Vacuum', pressure: 0.1, color: '#a78bfa' },
    { name: 'Low Pressure', pressure: 50, color: '#60a5fa' },
    { name: 'Standard', pressure: 101.325, color: '#34d399' },
    { name: 'High Pressure', pressure: 500, color: '#f87171' },
  ];

  return (
    <div className="ui-panel environment-controls">
      <div className="flex items-center gap-2 mb-4">
        <Settings size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Environment Controls</h3>
      </div>

      {/* Temperature Control */}
      <div className="control-section mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer size={16} className="text-red-500" />
          <span className="text-sm font-semibold text-gray-700">
            Temperature: {(temperature - 273.15).toFixed(1)}°C ({temperature.toFixed(1)} K)
          </span>
        </div>
        
        <input
          type="range"
          min="50"
          max="800"
          step="1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full mb-2"
          style={{ 
            background: `linear-gradient(90deg, #60a5fa 0%, #34d399 40%, #fbbf24 60%, #f87171 80%, #dc2626 100%)`
          }}
        />
        
        <div className="temperature-presets">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {temperaturePresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setTemperature(preset.temp)}
                className="text-xs btn-secondary"
                style={{ 
                  padding: '4px 6px',
                  backgroundColor: temperature === preset.temp ? preset.color : undefined,
                  color: temperature === preset.temp ? 'white' : undefined
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pressure Control */}
      <div className="control-section mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Gauge size={16} className="text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">
            Pressure: {(pressure / 1000).toFixed(1)} kPa
          </span>
        </div>
        
        <input
          type="range"
          min="0.1"
          max="1000"
          step="1"
          value={pressure / 1000}
          onChange={(e) => setPressure(parseFloat(e.target.value) * 1000)}
          className="w-full mb-2"
        />
        
        <div className="pressure-presets">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            {pressurePresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setPressure(preset.pressure * 1000)}
                className="text-xs btn-secondary"
                style={{ 
                  padding: '4px 6px',
                  backgroundColor: Math.abs(pressure/1000 - preset.pressure) < 1 ? preset.color : undefined,
                  color: Math.abs(pressure/1000 - preset.pressure) < 1 ? 'white' : undefined
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Energy Display */}
      <div className="energy-section">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-yellow-500" />
          <span className="text-sm font-semibold text-gray-700">Energy Analysis</span>
        </div>
        
        <div className="energy-display" style={{ fontSize: '12px' }}>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Total Potential Energy:</span>
            <span className="font-semibold">{totalEnergy.toFixed(1)} kcal/mol</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Avg Kinetic Energy:</span>
            <span className="font-semibold">{avgKineticEnergy.toFixed(3)} kJ/mol</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">System State:</span>
            <span className="font-semibold" style={{ 
              color: temperature < 273 ? '#3b82f6' : temperature > 373 ? '#ef4444' : '#10b981'
            }}>
              {temperature < 273 ? 'Solid' : temperature > 373 ? 'Gas' : 'Liquid'}
            </span>
          </div>
        </div>

        {/* Energy visualization bar */}
        <div className="energy-bar mt-3">
          <div 
            className="energy-indicator"
            style={{ 
              left: `${Math.min(95, (temperature - 50) / 750 * 100)}%` 
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Energy</span>
          <span>High</span>
        </div>
      </div>

      {/* Phase Information */}
      {molecules.length > 0 && (
        <div className="phase-info mt-4 p-2" style={{ background: '#f0fdf4', borderRadius: '4px', border: '1px solid #16a34a' }}>
          <div className="text-xs font-semibold text-green-800">Phase Transitions:</div>
          <div className="text-xs text-green-700 mt-1">
            {temperature < 200 && "❄️ Molecules are nearly frozen"}
            {temperature >= 200 && temperature < 300 && "🧊 Solid phase - limited motion"}
            {temperature >= 300 && temperature < 400 && "💧 Liquid phase - moderate motion"}
            {temperature >= 400 && temperature < 600 && "💨 Gas phase - high motion"}
            {temperature >= 600 && "🔥 Plasma phase - extreme motion"}
          </div>
        </div>
      )}
    </div>
  );
};