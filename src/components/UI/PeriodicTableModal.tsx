import React from 'react';
import { X } from 'lucide-react';
import { PeriodicTable } from './PeriodicTable';
import type { Element } from '../../data/elements';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onElementSelect: (element: Element) => void;
}

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose,
  onElementSelect,
}) => {
  if (!isOpen) return null;

  const handleElementSelect = (element: Element) => {
    onElementSelect(element);
    onClose();
  };

  return (
    <div className="periodic-table-modal-overlay">
      <div className="periodic-table-modal">
        <div className="modal-header">
          <h2 className="text-xl font-bold text-gray-800">Select Element</h2>
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <PeriodicTable onElementSelect={handleElementSelect} />
        </div>
      </div>
    </div>
  );
};