export type ElementTag = 
  | 'div' 
  | 'span' 
  | 'p' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'button' 
  | 'input' 
  | 'textarea'
  | 'a'
  | 'img'
  | 'ul'
  | 'ol'
  | 'li'
  | 'section'
  | 'header'
  | 'footer'
  | 'nav'
  | 'main'
  | 'article'
  | 'aside';

export type PositionType = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

export type DisplayType = 'block' | 'inline-block' | 'inline' | 'flex' | 'grid' | 'none';

export interface ElementStyles {
  // Layout
  display?: DisplayType;
  position?: PositionType;
  
  // Spacing
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  
  // Size
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  
  // Colors
  backgroundColor?: string;
  color?: string;
  
  // Border
  border?: string;
  borderWidth?: string;
  borderTopWidth?: string;
  borderRightWidth?: string;
  borderBottomWidth?: string;
  borderLeftWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  
  // Flexbox (when display is flex)
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: string;
  
  // Grid (when display is grid)
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;
  
  // Typography
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Position coordinates (for absolute/fixed)
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface UIElement {
  id: string;
  tag: ElementTag;
  styles: ElementStyles;
  children: UIElement[];
  content?: string; // For text content
  attributes?: Record<string, string>; // For HTML attributes like href, src, etc.
}

export interface EditorState {
  elements: UIElement[];
  selectedElementId: string | null;
}

