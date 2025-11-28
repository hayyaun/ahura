# Ahura

A UI development tool to visually design web pages and turn them into code.

## Features

- Visual interface for building UI components
- Real-time preview of your design
- Export to clean React code with Tailwind CSS classes
- Support for comprehensive CSS attributes (color, padding, margin, flexbox, etc.)
- Visual indicators for spacing and layout
- Element tree view for easy navigation
- Automatic conversion from CSS properties to Tailwind classes

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # React components
│   ├── LeftPanel/   # Element tree view
│   ├── Canvas/      # Main canvas area
│   └── RightPanel/  # Attributes editor
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── App.tsx          # Main application component
```

## Usage

1. Start with a root div element
2. Use the + button in the left panel to add child elements
3. Click on any element to select it
4. Edit attributes in the right panel
5. See your changes in real-time in the main canvas
6. Export your design as React code

