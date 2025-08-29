import React, { useState, useMemo } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
// import { elements } from '../../data/elements';

interface SpectrumData {
  wavelength: number;
  intensity: number;
  assignment: string;
}

export const Spectroscopy: React.FC = () => {
  const [selectedSpectroscopyType, setSelectedSpectroscopyType] = useState<'ir' | 'uv-vis' | 'nmr'>('ir');
  const { molecules, selection } = useLabStore();

  // Get the molecule to analyze
  const targetMolecule = useMemo(() => {
    if (selection.selectedMolecules.length > 0) {
      return molecules.find(mol => mol.id === selection.selectedMolecules[0]);
    }
    return molecules[0]; // Default to first molecule
  }, [molecules, selection.selectedMolecules]);

  // Generate simulated IR spectrum
  const generateIRSpectrum = (molecule: any): SpectrumData[] => {
    if (!molecule) return [];
    
    const spectrum: SpectrumData[] = [];
    
    // Simulate IR peaks based on bonds present
    molecule.bonds.forEach((bond: any) => {
      const atom1Element = molecule.atoms.find((a: any) => a.id === bond.atom1)?.element;
      const atom2Element = molecule.atoms.find((a: any) => a.id === bond.atom2)?.element;
      
      if (atom1Element && atom2Element) {
        // Simulate characteristic IR frequencies
        if ((atom1Element === 'O' && atom2Element === 'H') || (atom1Element === 'H' && atom2Element === 'O')) {
          spectrum.push({
            wavelength: 3200 + Math.random() * 600, // O-H stretch ~3200-3800 cm⁻¹
            intensity: 0.8 + Math.random() * 0.2,
            assignment: 'O-H stretch'
          });
        }
        
        if ((atom1Element === 'C' && atom2Element === 'H') || (atom1Element === 'H' && atom2Element === 'C')) {
          spectrum.push({
            wavelength: 2800 + Math.random() * 400, // C-H stretch ~2800-3200 cm⁻¹
            intensity: 0.6 + Math.random() * 0.3,
            assignment: 'C-H stretch'
          });
        }
        
        if ((atom1Element === 'C' && atom2Element === 'O') || (atom1Element === 'O' && atom2Element === 'C')) {
          if (bond.type === 'double') {
            spectrum.push({
              wavelength: 1700 + Math.random() * 100, // C=O stretch ~1700-1800 cm⁻¹
              intensity: 0.9 + Math.random() * 0.1,
              assignment: 'C=O stretch'
            });
          }
        }
        
        if ((atom1Element === 'N' && atom2Element === 'H') || (atom1Element === 'H' && atom2Element === 'N')) {
          spectrum.push({
            wavelength: 3300 + Math.random() * 200, // N-H stretch ~3300-3500 cm⁻¹
            intensity: 0.7 + Math.random() * 0.2,
            assignment: 'N-H stretch'
          });
        }
      }
    });
    
    return spectrum.sort((a, b) => b.wavelength - a.wavelength);
  };

  // Generate simulated UV-Vis spectrum
  const generateUVVisSpectrum = (molecule: any): SpectrumData[] => {
    if (!molecule) return [];
    
    const spectrum: SpectrumData[] = [];
    const hasConjugation = molecule.bonds.some((bond: any) => bond.type === 'double');
    
    if (hasConjugation) {
      spectrum.push({
        wavelength: 280 + Math.random() * 100, // π → π* transition
        intensity: 0.8 + Math.random() * 0.2,
        assignment: 'π → π* transition'
      });
    }
    
    // Add n → π* transitions for molecules with heteroatoms
    const hasHeteroatoms = molecule.atoms.some((atom: any) => 
      ['N', 'O', 'S'].includes(atom.element)
    );
    
    if (hasHeteroatoms) {
      spectrum.push({
        wavelength: 320 + Math.random() * 80,
        intensity: 0.4 + Math.random() * 0.3,
        assignment: 'n → π* transition'
      });
    }
    
    return spectrum.sort((a, b) => a.wavelength - b.wavelength);
  };

  const currentSpectrum = useMemo(() => {
    if (!targetMolecule) return [];
    
    switch (selectedSpectroscopyType) {
      case 'ir':
        return generateIRSpectrum(targetMolecule);
      case 'uv-vis':
        return generateUVVisSpectrum(targetMolecule);
      case 'nmr':
        return []; // NMR simulation would be more complex
      default:
        return [];
    }
  }, [targetMolecule, selectedSpectroscopyType]);

  const exportSpectrum = () => {
    const data = {
      molecule: targetMolecule?.name || 'Unknown',
      formula: targetMolecule?.formula || '',
      spectroscopyType: selectedSpectroscopyType.toUpperCase(),
      spectrum: currentSpectrum,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${targetMolecule?.name || 'molecule'}_${selectedSpectroscopyType}_spectrum.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ui-panel spectroscopy-panel">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">Virtual Spectroscopy</h3>
      </div>

      {/* Spectroscopy Type Selection */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Analysis Type:</label>
        <select
          value={selectedSpectroscopyType}
          onChange={(e) => setSelectedSpectroscopyType(e.target.value as any)}
          className="w-full"
        >
          <option value="ir">Infrared (IR) Spectroscopy</option>
          <option value="uv-vis">UV-Visible Spectroscopy</option>
          <option value="nmr">Nuclear Magnetic Resonance (NMR)</option>
        </select>
      </div>

      {/* Sample Information */}
      {targetMolecule && (
        <div className="mb-4 p-3" style={{ background: '#f8fafc', borderRadius: '6px' }}>
          <div className="text-sm">
            <div className="font-semibold text-gray-800">{targetMolecule.name}</div>
            <div className="text-gray-600">Formula: {targetMolecule.formula}</div>
            <div className="text-gray-600">Atoms: {targetMolecule.atoms.length}</div>
          </div>
        </div>
      )}

      {/* Spectrum Display */}
      <div className="spectrum-container">
        <div className="spectrum-header flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">
            {selectedSpectroscopyType.toUpperCase()} Spectrum
          </h4>
          <button
            onClick={exportSpectrum}
            className="flex items-center gap-1 text-xs btn-secondary"
            style={{ padding: '4px 8px' }}
          >
            <Download size={12} />
            Export
          </button>
        </div>

        <div className="spectrum-chart" style={{ height: '200px', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '16px' }}>
          {currentSpectrum.length > 0 ? (
            <div className="spectrum-peaks">
              {/* Simple bar chart representation */}
              <div style={{ display: 'flex', alignItems: 'end', height: '100%', gap: '2px' }}>
                {currentSpectrum.map((peak, index) => (
                  <div
                    key={index}
                    style={{
                      height: `${peak.intensity * 100}%`,
                      width: '20px',
                      background: '#3b82f6',
                      borderRadius: '2px 2px 0 0',
                      position: 'relative',
                    }}
                    title={`${peak.wavelength.toFixed(0)} ${selectedSpectroscopyType === 'uv-vis' ? 'nm' : 'cm⁻¹'}: ${peak.assignment}`}
                  >
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: '-20px', 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        fontSize: '8px',
                        color: '#6b7280',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {peak.wavelength.toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Peak assignments */}
              <div className="peak-assignments mt-4">
                <h5 className="text-xs font-semibold text-gray-700 mb-2">Peak Assignments:</h5>
                {currentSpectrum.map((peak, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    {peak.wavelength.toFixed(0)} {selectedSpectroscopyType === 'uv-vis' ? 'nm' : 'cm⁻¹'}: {peak.assignment}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              {targetMolecule ? 
                `No ${selectedSpectroscopyType.toUpperCase()} data available` : 
                'No molecule selected for analysis'
              }
            </div>
          )}
        </div>

        {/* Instrument Controls */}
        <div className="instrument-controls mt-4">
          <div className="flex gap-4">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Resolution:</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                defaultValue="5" 
                className="w-16"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-600 block mb-1">Sensitivity:</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                defaultValue="7" 
                className="w-16"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};