import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, ArrowLeft } from 'lucide-react';
import ElementTree from '../components/LeftPanel/ElementTree';
import Canvas from '../components/Canvas/Canvas';
import AttributesEditor from '../components/RightPanel/AttributesEditor';
import CodeExportModal from '../components/CodeExportModal';
import { useEditorState } from '../hooks/useEditorState';

export default function Editor() {
  const navigate = useNavigate();
  const {
    elements,
    selectedElementId,
    hoveredElementId,
    designName,
    loading,
    addElement,
    updateElement,
    updateElementStyles,
    deleteElement,
    selectElement,
    setHoveredElement,
    updateDesignName,
  } = useEditorState();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(designName);

  const handleNameBlur = () => {
    if (tempName.trim()) {
      updateDesignName(tempName.trim());
    } else {
      setTempName(designName);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setTempName(designName);
      setIsEditingName(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-gray-400">Loading design...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e]">
      {/* Header */}
      <header className="bg-[#1e1e1e] border-b border-[#2d2d2d] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 hover:bg-[#2d2d2d] rounded transition-colors"
            title="Back to home"
          >
            <ArrowLeft size={16} className="text-gray-400" />
          </button>
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className="px-2 py-1 text-sm bg-[#2d2d2d] border border-[#3a3a3a] rounded text-gray-300 focus:outline-none focus:border-[#4a4a4a]"
              autoFocus
            />
          ) : (
            <h1
              onClick={() => {
                setTempName(designName);
                setIsEditingName(true);
              }}
              className="text-lg font-bold text-gray-300 cursor-pointer hover:text-gray-200"
            >
              {designName || 'Untitled Design'}
            </h1>
          )}
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
            onHover={setHoveredElement}
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

