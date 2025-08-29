import React, { useState } from 'react';
import { FlaskConical, BarChart3, Microscope, Zap, Atom } from 'lucide-react';
import { Spectroscopy } from '../Equipment/Spectroscopy';
import { TitrationSetup } from '../Equipment/TitrationSetup';
import { ReactionSimulator } from '../Equipment/ReactionSimulator';

type EquipmentType = 'spectroscopy' | 'titration' | 'reactions' | 'chromatography' | 'electrochemistry' | null;

export const EquipmentPanel: React.FC = () => {
  const [activeEquipment, setActiveEquipment] = useState<EquipmentType>(null);

  const equipmentOptions = [
    {
      id: 'spectroscopy' as const,
      name: 'Spectroscopy',
      icon: BarChart3,
      description: 'IR, UV-Vis, NMR Analysis',
      color: '#8b5cf6'
    },
    {
      id: 'titration' as const,
      name: 'Titration',
      icon: FlaskConical,
      description: 'pH curves and acid-base analysis',
      color: '#06b6d4'
    },
    {
      id: 'reactions' as const,
      name: 'Reactions',
      icon: Atom,
      description: 'Chemical reaction simulation',
      color: '#16a34a'
    },
    {
      id: 'chromatography' as const,
      name: 'Chromatography',
      icon: BarChart3,
      description: 'Separation techniques',
      color: '#10b981'
    },
    {
      id: 'electrochemistry' as const,
      name: 'Electrochemistry',
      icon: Zap,
      description: 'Redox reactions and voltammetry',
      color: '#f59e0b'
    }
  ];

  const renderEquipmentInterface = () => {
    switch (activeEquipment) {
      case 'spectroscopy':
        return <Spectroscopy />;
      case 'titration':
        return <TitrationSetup />;
      case 'reactions':
        return <ReactionSimulator />;
      case 'chromatography':
        return (
          <div className="ui-panel">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chromatography</h3>
            <div className="text-sm text-gray-600">
              Chromatography simulation coming soon...
              <ul className="mt-2 space-y-1">
                <li>• Gas chromatography (GC)</li>
                <li>• Liquid chromatography (LC)</li>
                <li>• Thin-layer chromatography (TLC)</li>
              </ul>
            </div>
          </div>
        );
      case 'electrochemistry':
        return (
          <div className="ui-panel">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Electrochemistry</h3>
            <div className="text-sm text-gray-600">
              Electrochemistry simulation coming soon...
              <ul className="mt-2 space-y-1">
                <li>• Cyclic voltammetry</li>
                <li>• Redox potential measurements</li>
                <li>• Electrolysis simulations</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Equipment Selection Panel */}
      <div className="ui-panel equipment-selection-panel">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Microscope size={20} />
          Virtual Lab Equipment
        </h3>
        
        <div className="equipment-grid">
          {equipmentOptions.map((equipment) => {
            const Icon = equipment.icon;
            return (
              <button
                key={equipment.id}
                onClick={() => setActiveEquipment(
                  activeEquipment === equipment.id ? null : equipment.id
                )}
                className={`equipment-btn ${activeEquipment === equipment.id ? 'active' : ''}`}
                style={{
                  backgroundColor: activeEquipment === equipment.id ? equipment.color : '#f3f4f6',
                  color: activeEquipment === equipment.id ? 'white' : '#374151',
                  border: `2px solid ${activeEquipment === equipment.id ? equipment.color : '#e5e7eb'}`,
                }}
              >
                <Icon size={20} />
                <div>
                  <div className="font-semibold text-sm">{equipment.name}</div>
                  <div className="text-xs opacity-80">{equipment.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Equipment Interface */}
      {activeEquipment && (
        <div style={{ marginTop: '16px' }}>
          {renderEquipmentInterface()}
        </div>
      )}
    </>
  );
};