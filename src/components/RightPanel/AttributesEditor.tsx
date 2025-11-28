import { UIElement, ElementTag, ElementStyles } from '../../types/element';
import { findElementById } from '../../utils/elementUtils';
import { useState, useEffect } from 'react';
import { 
  TbBorderAll, TbBorderTop, TbBorderRight, TbBorderBottom, TbBorderLeft,
  TbBorderCorners, TbBorderRadius,
  TbAlignLeft, TbAlignCenter, TbAlignRight, TbAlignJustified,
  TbLayoutDistributeHorizontal, TbLayoutDistributeVertical,
  TbChevronDown, TbChevronRight
} from 'react-icons/tb';

interface AttributesEditorProps {
  elements: UIElement[];
  selectedElementId: string | null;
  onUpdateElement: (id: string, updates: Partial<UIElement>) => void;
  onUpdateStyles: (id: string, styles: Partial<ElementStyles>) => void;
}

const AVAILABLE_TAGS: ElementTag[] = [
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'button', 'input', 'textarea', 'a', 'img',
  'ul', 'ol', 'li', 'section', 'header', 'footer', 'nav', 'main', 'article', 'aside'
];

export default function AttributesEditor({
  elements,
  selectedElementId,
  onUpdateElement,
  onUpdateStyles,
}: AttributesEditorProps) {
  const selectedElement = selectedElementId
    ? findElementById(elements, selectedElementId)
    : null;

  const [localStyles, setLocalStyles] = useState<ElementStyles>(selectedElement?.styles || {});
  const [borderWidthExpanded, setBorderWidthExpanded] = useState(false);
  const [borderRadiusExpanded, setBorderRadiusExpanded] = useState(false);

  useEffect(() => {
    if (selectedElement) {
      setLocalStyles(selectedElement.styles);
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="h-full bg-gray-800 text-white p-3">
        <div className="text-center text-gray-400 text-xs mt-8">
          Select an element to edit its attributes
        </div>
      </div>
    );
  }

  const handleStyleChange = (key: keyof ElementStyles, value: string) => {
    const newStyles = { ...localStyles, [key]: value };
    setLocalStyles(newStyles);
    onUpdateStyles(selectedElement.id, { [key]: value });
  };

  const handleTagChange = (tag: ElementTag) => {
    onUpdateElement(selectedElement.id, { tag });
  };

  const handleContentChange = (content: string) => {
    onUpdateElement(selectedElement.id, { content });
  };

  return (
    <div className="h-full bg-gray-800 text-white overflow-auto text-xs">
      <div className="px-3 py-2 border-b border-gray-700">
        <h2 className="text-sm font-semibold">Attributes</h2>
      </div>

      <div className="p-3 space-y-3">
        {/* Element Type */}
        <div>
          <label className="block text-xs font-medium mb-1">Element Type</label>
          <select
            value={selectedElement.tag}
            onChange={(e) => handleTagChange(e.target.value as ElementTag)}
            className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            {AVAILABLE_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {(selectedElement.tag === 'button' ||
          selectedElement.tag === 'p' ||
          selectedElement.tag === 'span' ||
          selectedElement.tag.startsWith('h')) && (
          <div>
            <label className="block text-xs font-medium mb-1">Content</label>
            <input
              type="text"
              value={selectedElement.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Display */}
        <div>
          <label className="block text-xs font-medium mb-1">Display</label>
          <select
            value={localStyles.display || 'block'}
            onChange={(e) => handleStyleChange('display', e.target.value)}
            className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="block">Block</option>
            <option value="inline-block">Inline Block</option>
            <option value="inline">Inline</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* Position */}
        <div>
          <label className="block text-xs font-medium mb-1">Position</label>
          <select
            value={localStyles.position || 'static'}
            onChange={(e) => handleStyleChange('position', e.target.value)}
            className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="static">Static</option>
            <option value="relative">Relative</option>
            <option value="absolute">Absolute</option>
            <option value="fixed">Fixed</option>
            <option value="sticky">Sticky</option>
          </select>
        </div>

        {/* Size */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Width</label>
            <input
              type="text"
              value={localStyles.width || ''}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="auto"
              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Height</label>
            <input
              type="text"
              value={localStyles.height || ''}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              placeholder="auto"
              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Padding */}
        <div>
          <label className="block text-xs font-medium mb-1">Padding</label>
          <input
            type="text"
            value={localStyles.padding || ''}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
            placeholder="e.g., 16px or 1rem"
            className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Margin */}
        <div>
          <label className="block text-xs font-medium mb-1">Margin</label>
          <input
            type="text"
            value={localStyles.margin || ''}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
            placeholder="e.g., 16px or 1rem"
            className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Background</label>
            <input
              type="color"
              value={localStyles.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-7 bg-gray-700 border border-gray-600 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Text Color</label>
            <input
              type="color"
              value={localStyles.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-full h-7 bg-gray-700 border border-gray-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Border */}
        <div className="space-y-2">
          <label className="block text-xs font-medium">Border</label>
          
          {/* Border Style & Color */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-gray-400 mb-0.5">Style</label>
              <select
                value={localStyles.borderStyle || 'solid'}
                onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
                className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 mb-0.5">Color</label>
              <input
                type="color"
                value={localStyles.borderColor || '#000000'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="w-full h-7 bg-gray-700 border border-gray-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Border Width */}
          <div className="flex items-center gap-1">
            {!borderWidthExpanded ? (
              <div className="relative flex-1">
                <TbBorderAll size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={localStyles.borderWidth || ''}
                  onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                  placeholder="0px"
                  className="w-full pl-7 pr-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-2 gap-1">
                <div className="relative">
                  <TbBorderTop size={10} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={localStyles.borderTopWidth || ''}
                    onChange={(e) => handleStyleChange('borderTopWidth', e.target.value)}
                    placeholder="0"
                    className="w-full pl-5 pr-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <TbBorderRight size={10} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={localStyles.borderRightWidth || ''}
                    onChange={(e) => handleStyleChange('borderRightWidth', e.target.value)}
                    placeholder="0"
                    className="w-full pl-5 pr-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <TbBorderBottom size={10} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={localStyles.borderBottomWidth || ''}
                    onChange={(e) => handleStyleChange('borderBottomWidth', e.target.value)}
                    placeholder="0"
                    className="w-full pl-5 pr-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <TbBorderLeft size={10} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={localStyles.borderLeftWidth || ''}
                    onChange={(e) => handleStyleChange('borderLeftWidth', e.target.value)}
                    placeholder="0"
                    className="w-full pl-5 pr-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
            
            <button
              onClick={() => setBorderWidthExpanded(!borderWidthExpanded)}
              className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
              title="Toggle individual sides"
            >
              <TbBorderAll size={12} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Border Radius */}
        <div className="flex items-center gap-1">
          {!borderRadiusExpanded ? (
            <div className="relative flex-1">
              <TbBorderCorners size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={localStyles.borderRadius || ''}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                placeholder="0px"
                className="w-full pl-7 pr-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-4 gap-1">
              <div className="relative">
                <TbBorderRadius size={10} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={localStyles.borderTopLeftRadius || ''}
                  onChange={(e) => handleStyleChange('borderTopLeftRadius', e.target.value)}
                  placeholder="0"
                  className="w-full pl-5 pr-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <TbBorderRadius size={10} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={localStyles.borderTopRightRadius || ''}
                  onChange={(e) => handleStyleChange('borderTopRightRadius', e.target.value)}
                  placeholder="0"
                  className="w-full pl-5 pr-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <TbBorderRadius size={10} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={localStyles.borderBottomRightRadius || ''}
                  onChange={(e) => handleStyleChange('borderBottomRightRadius', e.target.value)}
                  placeholder="0"
                  className="w-full pl-5 pr-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <TbBorderRadius size={10} className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={localStyles.borderBottomLeftRadius || ''}
                  onChange={(e) => handleStyleChange('borderBottomLeftRadius', e.target.value)}
                  placeholder="0"
                  className="w-full pl-5 pr-1 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
          
          <button
            onClick={() => setBorderRadiusExpanded(!borderRadiusExpanded)}
            className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
            title="Toggle individual corners"
          >
            <TbBorderCorners size={12} className="text-gray-400" />
          </button>
        </div>

        {/* Flexbox options (when display is flex) */}
        {localStyles.display === 'flex' && (
          <>
            <div>
              <label className="block text-xs font-medium mb-1">Flex Direction</label>
              <div className="flex gap-1">
                <button
                  onClick={() => handleStyleChange('flexDirection', 'row')}
                  className={`flex-1 p-1.5 rounded transition-colors ${
                    localStyles.flexDirection === 'row' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title="Row"
                >
                  <TbLayoutDistributeHorizontal size={14} className="mx-auto" />
                </button>
                <button
                  onClick={() => handleStyleChange('flexDirection', 'column')}
                  className={`flex-1 p-1.5 rounded transition-colors ${
                    localStyles.flexDirection === 'column' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title="Column"
                >
                  <TbLayoutDistributeVertical size={14} className="mx-auto" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Justify Content</label>
              <select
                value={localStyles.justifyContent || 'flex-start'}
                onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="flex-start">Start</option>
                <option value="flex-end">End</option>
                <option value="center">Center</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
                <option value="space-evenly">Space Evenly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Align Items</label>
              <select
                value={localStyles.alignItems || 'stretch'}
                onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="flex-start">Start</option>
                <option value="flex-end">End</option>
                <option value="center">Center</option>
                <option value="stretch">Stretch</option>
                <option value="baseline">Baseline</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Gap</label>
              <input
                type="text"
                value={localStyles.gap || ''}
                onChange={(e) => handleStyleChange('gap', e.target.value)}
                placeholder="e.g., 16px"
                className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Typography */}
        <div>
          <label className="block text-xs font-medium mb-1">Font Size</label>
          <input
            type="text"
            value={localStyles.fontSize || ''}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            placeholder="e.g., 16px"
            className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Font Weight</label>
          <select
            value={localStyles.fontWeight || 'normal'}
            onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Text Align</label>
          <div className="flex gap-1">
            <button
              onClick={() => handleStyleChange('textAlign', 'left')}
              className={`flex-1 p-1.5 rounded transition-colors ${
                localStyles.textAlign === 'left' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Align Left"
            >
              <TbAlignLeft size={14} className="mx-auto" />
            </button>
            <button
              onClick={() => handleStyleChange('textAlign', 'center')}
              className={`flex-1 p-1.5 rounded transition-colors ${
                localStyles.textAlign === 'center' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Align Center"
            >
              <TbAlignCenter size={14} className="mx-auto" />
            </button>
            <button
              onClick={() => handleStyleChange('textAlign', 'right')}
              className={`flex-1 p-1.5 rounded transition-colors ${
                localStyles.textAlign === 'right' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Align Right"
            >
              <TbAlignRight size={14} className="mx-auto" />
            </button>
            <button
              onClick={() => handleStyleChange('textAlign', 'justify')}
              className={`flex-1 p-1.5 rounded transition-colors ${
                localStyles.textAlign === 'justify' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Justify"
            >
              <TbAlignJustified size={14} className="mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

