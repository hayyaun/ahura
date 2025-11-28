import { UIElement } from '../../types/element';
import { stylesToInlineCSS } from '../../utils/elementUtils';

interface CanvasProps {
  elements: UIElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
}

interface RenderedElementProps {
  element: UIElement;
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
}

function RenderedElement({ element, selectedElementId, onSelectElement }: RenderedElementProps) {
  const isSelected = element.id === selectedElementId;
  const Tag = element.tag as keyof JSX.IntrinsicElements;
  const style = stylesToInlineCSS(element.styles);

  return (
    <Tag
      style={style}
      className={`relative transition-all ${
        isSelected ? 'outline outline-2 outline-blue-500' : ''
      } hover:outline hover:outline-1 hover:outline-blue-300 cursor-pointer`}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectElement(element.id);
      }}
      {...(element.attributes || {})}
    >
      {/* Visual padding indicator when selected */}
      {isSelected && element.styles.padding && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-green-500 opacity-10"
            style={{
              borderWidth: element.styles.padding,
              borderColor: 'rgba(34, 197, 94, 0.3)',
              borderStyle: 'solid',
            }}
          />
        </div>
      )}

      {/* Visual margin indicator when selected */}
      {isSelected && element.styles.margin && (
        <div
          className="absolute pointer-events-none bg-orange-500 opacity-10"
          style={{
            top: `-${element.styles.margin}`,
            left: `-${element.styles.margin}`,
            right: `-${element.styles.margin}`,
            bottom: `-${element.styles.margin}`,
            border: `1px dashed rgba(249, 115, 22, 0.5)`,
          }}
        />
      )}

      {element.content}
      
      {element.children.map((child) => (
        <RenderedElement
          key={child.id}
          element={child}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
        />
      ))}
    </Tag>
  );
}

export default function Canvas({ elements, selectedElementId, onSelectElement }: CanvasProps) {
  return (
    <div className="h-full bg-gray-100 overflow-auto">
      <div className="px-4 py-2 border-b border-gray-300 bg-white">
        <h2 className="text-sm font-semibold text-gray-800">Canvas</h2>
      </div>
      <div className="p-8">
        <div className="bg-white min-h-[calc(100vh-200px)] shadow-lg">
          {elements.map((element) => (
            <RenderedElement
              key={element.id}
              element={element}
              selectedElementId={selectedElementId}
              onSelectElement={onSelectElement}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

