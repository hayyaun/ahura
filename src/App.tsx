import { useState } from 'react';
import { Code2 } from 'lucide-react';
import ElementTree from './components/LeftPanel/ElementTree';
import Canvas from './components/Canvas/Canvas';
import AttributesEditor from './components/RightPanel/AttributesEditor';
import CodeExportModal from './components/CodeExportModal';
import { useEditorState } from './hooks/useEditorState';

function App() {
  const {
    elements,
    selectedElementId,
    addElement,
    updateElement,
    updateElementStyles,
    deleteElement,
    selectElement,
  } = useEditorState();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e]">
      {/* Header */}
      <header className="bg-[#1e1e1e] border-b border-[#2d2d2d] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-gray-300">Ahura</div>
          <div className="text-gray-500 text-xs">Visual UI Builder</div>
        </div>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          <Code2 size={14} />
          Export Code
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Element Tree */}
        <div className="w-56 border-r border-[#2d2d2d] flex-shrink-0">
          <ElementTree
            elements={elements}
            selectedElementId={selectedElementId}
            onSelect={selectElement}
            onAddChild={addElement}
            onDelete={deleteElement}
            onHover={setHoveredElementId}
          />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1">
          <Canvas
            elements={elements}
            selectedElementId={selectedElementId}
            hoveredElementId={hoveredElementId}
            onSelectElement={selectElement}
          />
        </div>

        {/* Right Panel - Attributes Editor */}
        <div className="w-64 border-l border-[#2d2d2d] flex-shrink-0">
          <AttributesEditor
            elements={elements}
            selectedElementId={selectedElementId}
            onUpdateElement={updateElement}
            onUpdateStyles={updateElementStyles}
          />
        </div>
      </div>

      {/* Code Export Modal */}
      <CodeExportModal
        elements={elements}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

export default App;

