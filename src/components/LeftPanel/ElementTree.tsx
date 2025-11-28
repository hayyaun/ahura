import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { UIElement, ElementTag } from '../../types/element';
import { useState } from 'react';

interface ElementTreeProps {
  elements: UIElement[];
  selectedElementId: string | null;
  onSelect: (id: string) => void;
  onAddChild: (parentId: string, tag: ElementTag) => void;
  onDelete: (id: string) => void;
}

interface TreeNodeProps {
  element: UIElement;
  selectedElementId: string | null;
  onSelect: (id: string) => void;
  onAddChild: (parentId: string, tag: ElementTag) => void;
  onDelete: (id: string) => void;
  level: number;
}

function TreeNode({ element, selectedElementId, onSelect, onAddChild, onDelete, level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSelected = element.id === selectedElementId;
  const hasChildren = element.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1 px-2 py-1 hover:bg-gray-700 cursor-pointer group ${
          isSelected ? 'bg-blue-600 hover:bg-blue-700' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelect(element.id)}
      >
        <button
          className="w-3 h-3 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) setIsExpanded(!isExpanded);
          }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : (
            <span className="w-3" />
          )}
        </button>

        <span className="flex-1 text-xs">
          &lt;{element.tag}&gt;
          {element.content && (
            <span className="text-gray-400 ml-1.5 text-[10px] italic">
              "{element.content.substring(0, 20)}..."
            </span>
          )}
        </span>

        <button
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-blue-500 rounded"
          onClick={(e) => {
            e.stopPropagation();
            onAddChild(element.id, 'div');
          }}
          title="Add child element"
        >
          <Plus size={12} />
        </button>

        {level > 0 && (
          <button
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-500 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            title="Delete element"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div>
          {element.children.map((child) => (
            <TreeNode
              key={child.id}
              element={child}
              selectedElementId={selectedElementId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ElementTree({ elements, selectedElementId, onSelect, onAddChild, onDelete }: ElementTreeProps) {
  return (
    <div className="h-full bg-gray-800 text-white overflow-auto text-xs">
      <div className="px-3 py-2 border-b border-gray-700">
        <h2 className="text-sm font-semibold">Element Tree</h2>
      </div>
      <div className="py-1">
        {elements.map((element) => (
          <TreeNode
            key={element.id}
            element={element}
            selectedElementId={selectedElementId}
            onSelect={onSelect}
            onAddChild={onAddChild}
            onDelete={onDelete}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}

