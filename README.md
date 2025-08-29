# Molecular Chemistry Laboratory Simulator

A comprehensive 3D molecular chemistry laboratory simulator built with React, TypeScript, Three.js, and React Three Fiber. This educational platform allows students and researchers to visualize molecules, build chemical structures, simulate reactions, and use virtual laboratory equipment.
<img width="1927" height="992" alt="image" src="https://github.com/user-attachments/assets/1846c6cb-c8df-4bde-af73-32f06f272fcb" />

## Features

### Current Implementation ✅
- **3D Laboratory Environment**: Immersive 3D lab with realistic lighting and environment
- **Molecular Visualization**: Multiple rendering styles (Ball & Stick, Space Filling, Wireframe)
- **Interactive Molecular Models**: Click to select atoms, zoom, rotate, and pan
- **Accurate Atomic Data**: Real chemical element properties and atomic colors/sizes
- **Pre-built Molecules**: Water (H₂O), Methane (CH₄), Ammonia (NH₃), Carbon Dioxide (CO₂)
- **Interactive Periodic Table**: Click elements to see detailed properties
- **Real-time Controls**: Visualization options, scaling, and display preferences
- **Status Monitoring**: Real-time lab conditions and molecule counts

### Planned Features 🚧
- Atom placement and chemical bond formation system
- Chemical reaction animation and simulation
- Virtual laboratory equipment (spectroscopy, titration, chromatography)
- Educational tutorials and guided lessons
- Progressive Web App capabilities
- Collaborative multi-user functionality

## Quick Start

### Prerequisites
- Node.js 18.x+ (Note: Current Vite version may require Node 20+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Adding Molecules**: Use the "Add Molecules" section in the tool panel to place pre-built molecules
2. **Periodic Table**: Click "Periodic Table" button to select individual elements
3. **Visualization**: Switch between different molecular representation styles
4. **Controls**: 
   - Mouse drag to rotate the view
   - Mouse wheel to zoom in/out
   - Click atoms to select them
   - Hold Shift to multi-select

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **3D Graphics**: Three.js with React Three Fiber
- **Physics**: Cannon.js with React Three Cannon
- **Build Tool**: Vite 4.5.3
- **State Management**: Zustand
- **Styling**: Custom CSS (Tailwind CSS removed for compatibility)
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── Lab3D/
│   │   ├── Lab3DScene.tsx        # Main 3D canvas component
│   │   ├── MoleculeRenderer.tsx   # Handles molecule rendering
│   │   ├── AtomRenderer.tsx       # Individual atom visualization
│   │   ├── BondRenderer.tsx       # Chemical bond rendering
│   │   └── LabEnvironment.tsx     # 3D lab environment setup
│   └── UI/
│       ├── ToolPanel.tsx          # Main control panel
│       ├── StatusPanel.tsx        # Lab status display
│       ├── PeriodicTable.tsx      # Interactive periodic table
│       └── PeriodicTableModal.tsx # Modal wrapper for periodic table
├── data/
│   └── elements.ts               # Chemical element data and properties
├── store/
│   └── labStore.ts              # Zustand state management
├── types/
│   └── molecular.ts             # TypeScript type definitions
├── utils/
│   └── moleculeBuilders.ts      # Helper functions to create molecules
└── index.css                   # Global styles
```

## Key Components

### AtomRenderer
- Renders individual atoms with accurate colors and sizes
- Supports multiple visualization styles
- Interactive selection and highlighting
- Shows element labels and charge information

### MoleculeRenderer
- Manages complete molecule visualization
- Handles atom and bond rendering coordination
- Supports different molecular representation modes

### LabEnvironment
- Creates realistic 3D laboratory setting
- Includes lab table, equipment silhouettes
- Atmospheric particles for immersion

### Zustand Store
- Centralized state management for lab simulation
- Handles molecule data, visualization options, selection state
- Temperature and pressure controls
- Simulation control (start/stop/reset)

## Chemical Accuracy

The application uses scientifically accurate data:
- Real atomic radii (van der Waals and covalent)
- Accurate element colors from standard CPK coloring
- Realistic bond lengths and angles
- Proper molecular geometries (tetrahedral, trigonal, linear)
- Electronegativity and charge distributions

## Performance Optimizations

- Efficient 3D rendering with React Three Fiber
- Component-level optimizations with React.memo where appropriate
- Selective re-rendering based on state changes
- Optimized molecular data structures
- Canvas-level performance monitoring with Stats

## Development Notes

- The project is currently configured for Node.js 18.x with Vite 4.5.3
- Physics simulation is set up but not fully integrated (cannon-es)
- Molecular interactions and bond formation logic are planned for future implementation
- The UI is designed to be responsive and accessible

## Contributing

This is a comprehensive educational chemistry platform. Future contributions should focus on:
1. Implementing realistic chemical bond formation rules
2. Adding more complex molecular structures
3. Creating interactive lab equipment simulations
4. Developing educational content and tutorials
5. Optimizing performance for larger molecular systems

## License

Educational use - Chemistry simulation platform
