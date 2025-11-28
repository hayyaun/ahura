import { useState, useCallback } from 'react';
import { UIElement, ElementTag, ElementStyles } from '../types/element';
import {
  createDefaultElement,
  addChildToElement,
  updateElementById,
  removeElementById,
} from '../utils/elementUtils';

export function useEditorState() {
  const [elements, setElements] = useState<UIElement[]>([createDefaultElement('div')]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    elements[0]?.id || null
  );

  const addElement = useCallback((parentId: string, tag: ElementTag = 'div') => {
    const newElement = createDefaultElement(tag);
    setElements(prev => addChildToElement(prev, parentId, newElement));
    setSelectedElementId(newElement.id);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<UIElement>) => {
    setElements(prev =>
      updateElementById(prev, id, element => ({
        ...element,
        ...updates,
      }))
    );
  }, []);

  const updateElementStyles = useCallback((id: string, styles: Partial<ElementStyles>) => {
    setElements(prev =>
      updateElementById(prev, id, element => {
        const newStyles = { ...element.styles };
        
        // Update or remove properties
        Object.entries(styles).forEach(([key, value]) => {
          if (value === undefined || value === '') {
            delete newStyles[key as keyof ElementStyles];
          } else {
            newStyles[key as keyof ElementStyles] = value as any;
          }
        });
        
        return {
          ...element,
          styles: newStyles,
        };
      })
    );
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => removeElementById(prev, id));
    setSelectedElementId(null);
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  return {
    elements,
    selectedElementId,
    addElement,
    updateElement,
    updateElementStyles,
    deleteElement,
    selectElement,
  };
}

