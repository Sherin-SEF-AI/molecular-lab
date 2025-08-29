import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X, CheckCircle } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  action?: string;
  target?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
}

const tutorials: Tutorial[] = [
  {
    id: 'basic-navigation',
    title: 'Basic Navigation',
    description: 'Learn how to navigate the 3D molecular lab',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to the Molecular Lab',
        content: 'This tutorial will teach you the basics of navigating and using the 3D molecular chemistry laboratory.',
      },
      {
        id: 'camera-controls',
        title: 'Camera Controls',
        content: 'Use your mouse to control the camera:\n• Left click + drag: Rotate view\n• Right click + drag: Pan camera\n• Mouse wheel: Zoom in/out',
      },
      {
        id: 'add-molecules',
        title: 'Adding Molecules',
        content: 'Click on any molecule button in the tool panel on the left to add it to your lab. Try adding a water molecule now.',
        action: 'add-water',
        target: 'tool-panel'
      },
      {
        id: 'select-atoms',
        title: 'Selecting Atoms',
        content: 'Click on any atom in the 3D scene to select it. Selected atoms will be highlighted in yellow. Try selecting the oxygen atom in your water molecule.',
      },
      {
        id: 'visualization',
        title: 'Visualization Styles',
        content: 'Change how molecules are displayed using the visualization controls. Try switching between Ball & Stick, Space Filling, and Wireframe modes.',
        target: 'visualization-controls'
      }
    ]
  },
  {
    id: 'spectroscopy-basics',
    title: 'Virtual Spectroscopy',
    description: 'Learn to use the virtual spectroscopy equipment',
    steps: [
      {
        id: 'open-spectroscopy',
        title: 'Open Spectroscopy Tool',
        content: 'Click on the "Spectroscopy" button in the Virtual Lab Equipment panel to open the spectroscopy interface.',
        action: 'open-spectroscopy',
        target: 'equipment-panel'
      },
      {
        id: 'select-molecule',
        title: 'Analyze a Molecule',
        content: 'Make sure you have a molecule in your lab, then use the spectroscopy tool to generate IR and UV-Vis spectra.',
      },
      {
        id: 'interpret-spectrum',
        title: 'Interpret Results',
        content: 'The spectroscopy tool shows characteristic peaks for different functional groups. Each peak corresponds to specific molecular vibrations or electronic transitions.',
      }
    ]
  },
  {
    id: 'reaction-simulation',
    title: 'Chemical Reactions',
    description: 'Simulate chemical reactions and observe energy changes',
    steps: [
      {
        id: 'open-reactions',
        title: 'Open Reaction Simulator',
        content: 'Click on the "Reactions" button in the equipment panel to access the chemical reaction simulator.',
        action: 'open-reactions'
      },
      {
        id: 'select-reaction',
        title: 'Choose a Reaction',
        content: 'Select a reaction from the dropdown menu. Each reaction shows the chemical equation and energy change.',
      },
      {
        id: 'add-reactants',
        title: 'Add Reactants',
        content: 'Click "Add Reactants" to place the starting materials in your lab environment.',
      },
      {
        id: 'run-reaction',
        title: 'Run the Reaction',
        content: 'Click "Start" to begin the reaction simulation. Watch the energy profile and progress indicators.',
      }
    ]
  }
];

interface TutorialSystemProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TutorialSystem: React.FC<TutorialSystemProps> = ({ isVisible, onClose }) => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  if (!isVisible) return null;

  const handleStartTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (selectedTutorial && currentStepIndex < selectedTutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const markStepComplete = () => {
    if (selectedTutorial) {
      const stepId = selectedTutorial.steps[currentStepIndex].id;
      setCompletedSteps(prev => new Set(prev).add(stepId));
    }
  };

  const closeTutorial = () => {
    setSelectedTutorial(null);
    setCurrentStepIndex(0);
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        {!selectedTutorial ? (
          // Tutorial selection screen
          <div>
            <div className="tutorial-header">
              <div className="flex items-center gap-2">
                <BookOpen size={24} className="text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Interactive Tutorials</h2>
              </div>
              <button onClick={onClose} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            
            <div className="tutorial-content">
              <p className="text-gray-600 mb-6">
                Learn how to use the molecular chemistry laboratory with these guided tutorials.
              </p>
              
              <div className="tutorial-list">
                {tutorials.map((tutorial) => (
                  <div key={tutorial.id} className="tutorial-card">
                    <h3 className="font-semibold text-gray-800 mb-2">{tutorial.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {tutorial.steps.length} steps
                      </span>
                      <button
                        onClick={() => handleStartTutorial(tutorial)}
                        className="btn-primary text-xs"
                      >
                        Start Tutorial
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Tutorial step screen
          <div>
            <div className="tutorial-header">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedTutorial.title}</h2>
                <p className="text-sm text-gray-600">
                  Step {currentStepIndex + 1} of {selectedTutorial.steps.length}
                </p>
              </div>
              <button onClick={closeTutorial} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            
            <div className="tutorial-content">
              <div className="tutorial-step">
                <h3 className="font-semibold text-gray-800 mb-3">
                  {selectedTutorial.steps[currentStepIndex].title}
                </h3>
                
                <div className="step-content mb-4">
                  {selectedTutorial.steps[currentStepIndex].content.split('\n').map((line, index) => (
                    <p key={index} className="text-gray-700 mb-2">{line}</p>
                  ))}
                </div>
                
                <div className="tutorial-navigation">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    
                    <button
                      onClick={markStepComplete}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Mark Complete
                    </button>
                    
                    {currentStepIndex < selectedTutorial.steps.length - 1 ? (
                      <button
                        onClick={handleNextStep}
                        className="btn-primary flex items-center gap-2"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={closeTutorial}
                        className="btn-primary flex items-center gap-2"
                      >
                        Finish
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="tutorial-progress mt-4">
                <div className="flex gap-1">
                  {selectedTutorial.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`progress-dot ${
                        index === currentStepIndex ? 'active' : 
                        completedSteps.has(step.id) ? 'completed' : 'incomplete'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};