import React from 'react';
import { Thermometer, Gauge, Atom } from 'lucide-react';
import { useLabStore } from '../../store/labStore';

export const StatusPanel: React.FC = () => {
  const { molecules, temperature, pressure, isSimulating, selection } = useLabStore();

  const totalAtoms = molecules.reduce((sum, mol) => sum + mol.atoms.length, 0);

  return (
    <div className="ui-panel status-panel">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Lab Status</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
        <div className="flex items-center gap-2">
          <Atom size={16} style={{ color: '#3b82f6' }} />
          <div>
            <div className="text-xs text-gray-600">Molecules</div>
            <div className="font-semibold">{molecules.length}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#9ca3af' }}></div>
          <div>
            <div className="text-xs text-gray-600">Atoms</div>
            <div className="font-semibold">{totalAtoms}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Thermometer size={16} style={{ color: '#ef4444' }} />
          <div>
            <div className="text-xs text-gray-600">Temperature</div>
            <div className="font-semibold">{(temperature - 273.15).toFixed(1)}°C</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Gauge size={16} style={{ color: '#10b981' }} />
          <div>
            <div className="text-xs text-gray-600">Pressure</div>
            <div className="font-semibold">{(pressure / 1000).toFixed(1)} kPa</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
        <div className="flex items-center gap-2">
          <div 
            className={`status-indicator ${isSimulating ? 'running' : 'stopped'}`}
          />
          <span className="text-xs text-gray-600">
            {isSimulating ? 'Simulating' : 'Paused'}
          </span>
        </div>
        
        {selection.selectedAtoms.length > 0 && (
          <div style={{ marginTop: '4px' }} className="text-xs text-gray-600">
            Selected: {selection.selectedAtoms.length} atom{selection.selectedAtoms.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};