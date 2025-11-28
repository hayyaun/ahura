import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { UIElement, ElementTag, ElementStyles } from '../types/element';
import { db, Design } from '../db/database';
import {
  createDefaultElement,
  addChildToElement,
  updateElementById,
  removeElementById,
} from '../utils/elementUtils';

export function useEditorState() {
  const { id } = useParams<{ id: string }>();
  const [elements, setElements] = useState<UIElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [designName, setDesignName] = useState('');

  // Load design from database
  useEffect(() => {
    if (id) {
      loadDesign(parseInt(id));
    } else {
      // New design
      const defaultElements = [createDefaultElement('div')];
      setElements(defaultElements);
      setSelectedElementId(defaultElements[0]?.id || null);
      setLoading(false);
    }
  }, [id]);

  const loadDesign = async (designId: number) => {
    try {
      const design = await db.designs.get(designId);
      if (design) {
        setElements(design.elements);
        setSelectedElementId(design.selectedElementId);
        setDesignName(design.name);
      }
    } catch (error) {
      console.error('Failed to load design:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save to database
  const saveDesign = useCallback(async () => {
    if (!id) return;
    
    try {
      const designId = parseInt(id);
      await db.designs.update(designId, {
        elements,
        selectedElementId,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Failed to save design:', error);
    }
  }, [id, elements, selectedElementId]);

  // Save on changes (debounced)
  useEffect(() => {
    if (!loading && id) {
      const timeoutId = setTimeout(() => {
        saveDesign();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [elements, selectedElementId, loading, id, saveDesign]);

  const addElement = useCallback((parentId: string, tag: ElementTag = 'div') => {
    const newElement = createDefaultElement(tag);
    setElements(prev => {
      const updated = addChildToElement(prev, parentId, newElement);
      return updated;
    });
    setSelectedElementId(newElement.id);
  }, []);

  const updateElement = useCallback((elementId: string, updates: Partial<UIElement>) => {
    setElements(prev =>
      updateElementById(prev, elementId, element => ({
        ...element,
        ...updates,
      }))
    );
  }, []);

  const updateElementStyles = useCallback((elementId: string, styles: Partial<ElementStyles>) => {
    setElements(prev =>
      updateElementById(prev, elementId, element => {
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

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => removeElementById(prev, elementId));
    setSelectedElementId(prev => prev === elementId ? null : prev);
  }, []);

  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
  }, []);

  const updateDesignName = useCallback(async (name: string) => {
    setDesignName(name);
    if (id) {
      try {
        await db.designs.update(parseInt(id), { name, updatedAt: Date.now() });
      } catch (error) {
        console.error('Failed to update design name:', error);
      }
    }
  }, [id]);

  return {
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
    setHoveredElement: setHoveredElementId,
    updateDesignName,
  };
}
