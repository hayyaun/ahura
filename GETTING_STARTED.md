# Getting Started with Ahura

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. Install dependencies:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
ahura/
├── src/
│   ├── components/        # React components
│   │   ├── Canvas/       # Main canvas area
│   │   │   └── Canvas.tsx
│   │   ├── LeftPanel/    # Element tree view
│   │   │   └── ElementTree.tsx
│   │   ├── RightPanel/   # Attributes editor
│   │   │   └── AttributesEditor.tsx
│   │   └── CodeExportModal.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useEditorState.ts
│   ├── types/            # TypeScript type definitions
│   │   └── element.ts
│   ├── utils/            # Utility functions
│   │   └── elementUtils.ts
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles with Tailwind
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## How to Use

### 1. Element Tree (Left Panel)

- View the hierarchy of all elements in your design
- Click on any element to select it
- Use the **+** button next to an element to add a child element
- Use the **trash** icon to delete an element (root element cannot be deleted)

### 2. Canvas (Main Area)

- See a live preview of your design
- Click on any element to select it
- Selected elements are highlighted with a blue outline
- Padding is shown with a green overlay
- Margin is shown with an orange dashed border

### 3. Attributes Editor (Right Panel)

- Edit the selected element's properties:
  - **Element Type**: Change the HTML tag (div, button, p, etc.)
  - **Content**: Edit text content for text elements
  - **Display**: Set display mode (block, flex, grid, etc.)
  - **Position**: Set position type (static, relative, absolute, fixed, sticky)
  - **Size**: Set width and height
  - **Spacing**: Set padding and margin
  - **Colors**: Set background and text colors
  - **Border**: Set border radius
  - **Flexbox**: Configure flex properties (when display is flex)
  - **Typography**: Set font size, weight, and alignment

### 4. Code Export

- Click the **Export Code** button in the header
- View the generated React code with Tailwind CSS classes
- Copy the code to clipboard
- Use it directly in your React + Tailwind project
- Styles are automatically converted to Tailwind classes:
  - Standard spacing values map to Tailwind's spacing scale
  - Custom values use arbitrary value syntax (e.g., `p-[18px]`)
  - Colors are converted to Tailwind color utilities when possible
  - All CSS properties are intelligently mapped to Tailwind classes

## Features

✅ Visual element tree hierarchy  
✅ Real-time preview  
✅ Comprehensive style editing  
✅ Support for flexbox layouts  
✅ Visual padding/margin indicators  
✅ Export to clean React code  
✅ Professional UI with dark theme  
✅ TypeScript for type safety  

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library

## Tips

- Start with the root div and build your layout from there
- Use flexbox (set display to "flex") for flexible layouts
- Set specific widths/heights or leave them as "auto"
- Use padding for inner spacing and margin for outer spacing
- Colors can be set using the color picker or by typing hex/rgb values
- The visual indicators help you see spacing in real-time

## Troubleshooting

### Port already in use

If you see an error about the port being in use, Vite will automatically try the next available port.

### Build errors

Make sure all dependencies are installed:

```bash
npm install
```

### TypeScript errors

The project is configured with strict TypeScript checking. Make sure your code follows TypeScript best practices.

## Future Enhancements

Potential features for future versions:
- Drag and drop elements
- Undo/redo functionality
- Save/load projects
- Component templates
- Responsive design preview
- CSS Grid support
- Image uploads
- More element types

## Contributing

This is a professional tool for UI development. Contributions are welcome!

## License

MIT License

