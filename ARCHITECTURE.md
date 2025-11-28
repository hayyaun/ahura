# Ahura - Architecture Documentation

## Overview

Ahura is a visual UI builder that allows users to design web pages visually and export them as React code. The application follows a clean, component-based architecture with proper separation of concerns.

## Core Concepts

### 1. Element Tree Structure

The application maintains a hierarchical tree of UI elements, where each element can have multiple children. This is represented by the `UIElement` interface:

```typescript
interface UIElement {
  id: string;                    // Unique identifier
  tag: ElementTag;               // HTML tag name
  styles: ElementStyles;         // CSS styles
  children: UIElement[];         // Child elements
  content?: string;              // Text content
  attributes?: Record<string, string>; // HTML attributes
}
```

### 2. State Management

State is managed using React hooks with a custom `useEditorState` hook that provides:

- **elements**: Array of root-level UI elements
- **selectedElementId**: Currently selected element
- **addElement**: Add a new child element
- **updateElement**: Update element properties
- **updateElementStyles**: Update element styles
- **deleteElement**: Remove an element
- **selectElement**: Select an element for editing

### 3. Component Architecture

The application is divided into three main panels:

#### Left Panel - Element Tree
- **Location**: `src/components/LeftPanel/ElementTree.tsx`
- **Purpose**: Display hierarchical tree of elements
- **Features**: 
  - Collapsible tree nodes
  - Add child elements with + button
  - Delete elements with trash icon
  - Visual selection highlighting

#### Center Panel - Canvas
- **Location**: `src/components/Canvas/Canvas.tsx`
- **Purpose**: Live preview of the design
- **Features**:
  - Real-time rendering of elements
  - Click to select elements
  - Visual padding indicators (green overlay)
  - Visual margin indicators (orange dashed border)
  - Hover effects for better UX

#### Right Panel - Attributes Editor
- **Location**: `src/components/RightPanel/AttributesEditor.tsx`
- **Purpose**: Edit selected element's properties
- **Features**:
  - Change element type (tag)
  - Edit text content
  - Modify display and position
  - Adjust sizing (width, height)
  - Set spacing (padding, margin)
  - Configure colors
  - Set typography properties
  - Flexbox controls (when display is flex)

### 4. Code Export

- **Location**: `src/components/CodeExportModal.tsx`
- **Purpose**: Export design as React code with Tailwind CSS
- **Features**:
  - Generate clean React code with Tailwind classes
  - Intelligent CSS-to-Tailwind conversion
  - Automatic spacing scale mapping
  - Arbitrary value support for custom sizes
  - Copy to clipboard functionality
  - Modal interface

## File Organization

### Types (`src/types/`)

- `element.ts`: Core type definitions
  - `ElementTag`: Supported HTML tags
  - `PositionType`: CSS position types
  - `DisplayType`: CSS display types
  - `ElementStyles`: CSS style properties
  - `UIElement`: Element structure
  - `EditorState`: Application state

### Utils (`src/utils/`)

- `elementUtils.ts`: Utility functions
  - `generateId()`: Create unique element IDs
  - `createDefaultElement()`: Create new elements with defaults
  - `findElementById()`: Search element tree
  - `updateElementById()`: Update elements immutably
  - `addChildToElement()`: Add child to parent
  - `removeElementById()`: Delete elements
  - `stylesToInlineCSS()`: Convert styles to React CSS
  - `exportToReactCode()`: Generate React code

### Hooks (`src/hooks/`)

- `useEditorState.ts`: Main state management hook
  - Manages element tree
  - Provides CRUD operations
  - Handles element selection

## Data Flow

```
User Action (Click, Edit, etc.)
    ↓
Event Handler in Component
    ↓
Hook Function (useEditorState)
    ↓
State Update (React setState)
    ↓
Re-render Components
    ↓
Updated UI
```

## Key Design Decisions

### 1. Immutable State Updates

All state updates create new objects rather than modifying existing ones. This ensures proper React re-rendering and makes debugging easier.

### 2. Recursive Element Rendering

Elements are rendered recursively to support any depth of nesting. The `RenderedElement` component in Canvas renders itself for each child.

### 3. ID-Based Selection

Elements are identified and selected by unique IDs rather than array indices, making the tree manipulation more robust.

### 4. Inline Styles for Preview, Tailwind for Export

The canvas uses inline styles for precise WYSIWYG preview, ensuring exact rendering of any CSS value. However, the export function intelligently converts these styles to Tailwind CSS classes with comprehensive mapping:
- Standard spacing values → Tailwind spacing scale (e.g., 16px → p-4)
- Custom values → Arbitrary values (e.g., 18px → p-[18px])
- Colors → Tailwind color utilities or arbitrary values
- Display/Position → Direct Tailwind utilities
- Flexbox → Tailwind flex utilities

### 5. Component Separation

Each major feature is in its own component with clear props interfaces, making the code maintainable and testable.

## Styling Approach

### Application UI
- Uses Tailwind CSS for rapid development
- Dark theme for professional look
- Consistent spacing and colors

### User's Design (Canvas)
- Uses inline CSS styles
- Allows any valid CSS property
- Easy to export to React

## Extension Points

The architecture is designed to be extensible:

### Adding New Element Types
1. Add to `ElementTag` type in `types/element.ts`
2. Handle in `RenderedElement` component
3. Update element type selector in `AttributesEditor`

### Adding New Style Properties
1. Add to `ElementStyles` interface
2. Add UI controls in `AttributesEditor`
3. Update `stylesToInlineCSS` if needed

### Adding New Features
- **Undo/Redo**: Add history state to `useEditorState`
- **Drag & Drop**: Integrate with react-dnd
- **Templates**: Add preset element configurations
- **Save/Load**: Add serialization/deserialization

## Performance Considerations

1. **Immutable Updates**: Using spread operators for small trees is fine, but consider immer.js for larger trees
2. **Rendering**: Canvas re-renders on any state change; consider React.memo for optimization
3. **Selection**: Finding elements by ID is O(n); could be optimized with a Map

## Testing Strategy

Recommended testing approach:

1. **Unit Tests**: Test utility functions in isolation
2. **Component Tests**: Test each component with React Testing Library
3. **Integration Tests**: Test user workflows end-to-end
4. **Type Safety**: TypeScript provides compile-time safety

## Build and Deployment

- **Development**: Vite dev server with HMR
- **Production**: Optimized build with code splitting
- **Assets**: Vite handles all asset optimization
- **Deployment**: Static files, can deploy to any CDN/hosting

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features required
- No IE11 support

## Security Considerations

- No server-side code (pure client-side app)
- No user authentication required
- No data persistence (privacy-friendly)
- Code export is sanitized (no XSS risk)

## Accessibility

Current implementation:
- Keyboard navigation for buttons
- Semantic HTML where possible

Future improvements:
- ARIA labels for better screen reader support
- Keyboard shortcuts for common actions
- Focus management for modals

## Known Limitations

1. **Grid Layout**: Basic grid support, could be enhanced
2. **Responsive Design**: No breakpoint support yet
3. **Complex CSS**: No support for animations, transforms, etc.
4. **Images**: No image upload functionality
5. **Undo/Redo**: Not implemented yet

## Future Roadmap

### Phase 1 (Current)
✅ Basic element tree  
✅ Visual editor  
✅ Code export  

### Phase 2 (Next)
- Drag and drop reordering
- Undo/redo functionality
- Local storage persistence

### Phase 3 (Future)
- Component templates
- Responsive design preview
- Advanced CSS features
- Collaboration features

## Contributing Guidelines

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Keep components small and focused
4. Add proper type definitions
5. Write self-documenting code
6. Update this documentation when adding features

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

