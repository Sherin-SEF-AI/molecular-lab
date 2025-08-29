import React, { useState } from 'react';
import { elements, getAllElements } from '../../data/elements';
import type { Element } from '../../data/elements';

interface PeriodicTableProps {
  onElementSelect: (element: Element) => void;
  selectedElement?: string;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ 
  onElementSelect, 
  selectedElement 
}) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const allElements = getAllElements();

  const getElementPosition = (element: Element) => {
    return {
      gridColumn: element.group,
      gridRow: element.period,
    };
  };

  const getElementClassName = (element: Element) => {
    let className = 'periodic-element';
    
    switch (element.category) {
      case 'metal':
        className += ' metal';
        break;
      case 'nonmetal':
        className += ' nonmetal';
        break;
      case 'metalloid':
        className += ' metalloid';
        break;
      case 'noble-gas':
        className += ' noble-gas';
        break;
    }

    if (selectedElement === element.symbol) {
      className += ' selected';
    }

    if (hoveredElement === element.symbol) {
      className += ' hovered';
    }

    return className;
  };

  return (
    <div className="periodic-table-container">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Periodic Table</h3>
      
      <div className="periodic-table-grid">
        {allElements.map((element) => (
          <div
            key={element.symbol}
            className={getElementClassName(element)}
            style={getElementPosition(element)}
            onClick={() => onElementSelect(element)}
            onMouseEnter={() => setHoveredElement(element.symbol)}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <div className="element-number">{element.atomicNumber}</div>
            <div className="element-symbol">{element.symbol}</div>
            <div className="element-name">{element.name}</div>
          </div>
        ))}
      </div>

      {/* Element Info Panel */}
      {hoveredElement && (
        <div className="element-info-panel">
          {(() => {
            const element = elements[hoveredElement];
            return (
              <div>
                <h4 className="font-bold text-lg">{element.name} ({element.symbol})</h4>
                <div className="text-sm text-gray-600 mt-2">
                  <p>Atomic Number: {element.atomicNumber}</p>
                  <p>Atomic Mass: {element.atomicMass}</p>
                  <p>Group: {element.group}, Period: {element.period}</p>
                  <p>Category: {element.category}</p>
                  <p>State: {element.state}</p>
                  <p>Electronegativity: {element.electronegativity}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};