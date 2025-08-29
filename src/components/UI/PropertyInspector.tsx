import React from 'react';
import { Info, Zap } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { elements } from '../../data/elements';

export const PropertyInspector: React.FC = () => {
  const { molecules, selection } = useLabStore();
  
  // Get selected atom details
  const getSelectedAtomInfo = () => {
    if (selection.selectedAtoms.length === 0) return null;
    
    const selectedAtomId = selection.selectedAtoms[0];
    for (const molecule of molecules) {
      const atom = molecule.atoms.find(a => a.id === selectedAtomId);
      if (atom) {
        return { atom, molecule };
      }
    }
    return null;
  };

  // Get selected molecule info
  const getSelectedMoleculeInfo = () => {
    if (selection.selectedMolecules.length === 0 && molecules.length > 0) {
      return molecules[0]; // Default to first molecule if none selected
    }
    
    if (selection.selectedMolecules.length > 0) {
      const selectedMolId = selection.selectedMolecules[0];
      return molecules.find(mol => mol.id === selectedMolId) || null;
    }
    
    return null;
  };

  const selectedAtomInfo = getSelectedAtomInfo();
  const selectedMolecule = getSelectedMoleculeInfo();

  return (
    <div className="ui-panel property-inspector">
      <h3 className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
        <Info size={16} />
        Property Inspector
      </h3>

      {selectedAtomInfo ? (
        <div className="atom-properties">
          <h4 className="font-semibold text-gray-800 mb-2">
            {elements[selectedAtomInfo.atom.element]?.name} Atom
          </h4>
          
          <div className="property-grid">
            <div className="property-item">
              <span className="property-label">Element:</span>
              <span className="property-value">{selectedAtomInfo.atom.element}</span>
            </div>
            
            <div className="property-item">
              <span className="property-label">Atomic #:</span>
              <span className="property-value">{elements[selectedAtomInfo.atom.element]?.atomicNumber}</span>
            </div>
            
            <div className="property-item">
              <span className="property-label">Mass:</span>
              <span className="property-value">{elements[selectedAtomInfo.atom.element]?.atomicMass.toFixed(3)} u</span>
            </div>
            
            <div className="property-item">
              <span className="property-label">Charge:</span>
              <span className="property-value">{selectedAtomInfo.atom.charge > 0 ? '+' : ''}{selectedAtomInfo.atom.charge}</span>
            </div>
            
            <div className="property-item">
              <span className="property-label">Electronegativity:</span>
              <span className="property-value">{elements[selectedAtomInfo.atom.element]?.electronegativity}</span>
            </div>
            
            <div className="property-item">
              <span className="property-label">Radius:</span>
              <span className="property-value">{elements[selectedAtomInfo.atom.element]?.radius.toFixed(2)} Å</span>
            </div>

            {selectedAtomInfo.atom.hybridization && (
              <div className="property-item">
                <span className="property-label">Hybridization:</span>
                <span className="property-value">{selectedAtomInfo.atom.hybridization}</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
            <div className="text-xs text-gray-600">
              Position: ({selectedAtomInfo.atom.position.x.toFixed(2)}, {selectedAtomInfo.atom.position.y.toFixed(2)}, {selectedAtomInfo.atom.position.z.toFixed(2)})
            </div>
          </div>
        </div>
      ) : selectedMolecule ? (
        <div className="molecule-properties">
          <h4 className="font-semibold text-gray-800 mb-2">{selectedMolecule.name}</h4>
          
          <div className="property-grid">
            <div className="property-item">
              <span className="property-label">Formula:</span>
              <span className="property-value">{selectedMolecule.formula}</span>
            </div>
            
            <div className="property-item">
              <span className="property-label">Atoms:</span>
              <span className="property-value">{selectedMolecule.atoms.length}</span>
            </div>
            
            <div className="property-item">
              <span className="property-label">Bonds:</span>
              <span className="property-value">{selectedMolecule.bonds.length}</span>
            </div>
            
            <div className="property-item">
              <span className="property-label">Charge:</span>
              <span className="property-value">{selectedMolecule.charge > 0 ? '+' : ''}{selectedMolecule.charge}</span>
            </div>
            
            <div className="property-item">
              <span className="property-label">Multiplicity:</span>
              <span className="property-value">{selectedMolecule.multiplicity}</span>
            </div>

            {selectedMolecule.energy && (
              <div className="property-item">
                <div className="flex items-center gap-1">
                  <Zap size={12} className="text-yellow-500" />
                  <span className="property-label">Energy:</span>
                </div>
                <span className="property-value">{selectedMolecule.energy.toFixed(1)} kcal/mol</span>
              </div>
            )}
          </div>

          {/* Molecular composition breakdown */}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
            <div className="text-xs font-semibold text-gray-700 mb-1">Composition:</div>
            {Object.entries(
              selectedMolecule.atoms.reduce((acc, atom) => {
                acc[atom.element] = (acc[atom.element] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([element, count]) => (
              <div key={element} className="text-xs text-gray-600">
                {element}: {count} atom{count > 1 ? 's' : ''}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center py-4">
          Select an atom or molecule to view properties
        </div>
      )}
    </div>
  );
};