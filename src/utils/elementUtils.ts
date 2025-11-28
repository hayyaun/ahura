import { UIElement, ElementTag, ElementStyles } from '../types/element';

export function generateId(): string {
  return `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createDefaultElement(tag: ElementTag = 'div'): UIElement {
  const defaultStyles: ElementStyles = {
    display: 'block',
    position: 'relative',
    padding: '16px',
    backgroundColor: '#ffffff',
  };

  return {
    id: generateId(),
    tag,
    styles: defaultStyles,
    children: [],
    content: tag === 'button' || tag === 'p' || tag === 'span' ? 'Text content' : undefined,
  };
}

export function findElementById(elements: UIElement[], id: string): UIElement | null {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }
    const found = findElementById(element.children, id);
    if (found) {
      return found;
    }
  }
  return null;
}

export function updateElementById(
  elements: UIElement[],
  id: string,
  updater: (element: UIElement) => UIElement
): UIElement[] {
  return elements.map(element => {
    if (element.id === id) {
      return updater(element);
    }
    return {
      ...element,
      children: updateElementById(element.children, id, updater),
    };
  });
}

export function addChildToElement(
  elements: UIElement[],
  parentId: string,
  child: UIElement
): UIElement[] {
  return updateElementById(elements, parentId, parent => ({
    ...parent,
    children: [...parent.children, child],
  }));
}

export function removeElementById(elements: UIElement[], id: string): UIElement[] {
  return elements
    .filter(element => element.id !== id)
    .map(element => ({
      ...element,
      children: removeElementById(element.children, id),
    }));
}

// Map pixel values to Tailwind spacing scale
const pxToTailwindSpacing: Record<string, string> = {
  '0px': '0',
  '1px': 'px',
  '2px': '0.5',
  '4px': '1',
  '6px': '1.5',
  '8px': '2',
  '10px': '2.5',
  '12px': '3',
  '14px': '3.5',
  '16px': '4',
  '20px': '5',
  '24px': '6',
  '28px': '7',
  '32px': '8',
  '36px': '9',
  '40px': '10',
  '44px': '11',
  '48px': '12',
  '56px': '14',
  '64px': '16',
  '80px': '20',
  '96px': '24',
  '112px': '28',
  '128px': '32',
};

function convertToTailwindSpacing(value: string, prefix: string): string {
  if (!value) return '';
  
  // Check if it's in our standard scale
  if (pxToTailwindSpacing[value]) {
    return `${prefix}-${pxToTailwindSpacing[value]}`;
  }
  
  // Use arbitrary value for non-standard values
  return `${prefix}-[${value}]`;
}

function convertColorToTailwind(value: string, type: 'bg' | 'text' | 'border'): string {
  if (!value) return '';
  
  // Common color mappings
  const colorMap: Record<string, string> = {
    '#ffffff': 'white',
    '#000000': 'black',
    '#f3f4f6': 'gray-100',
    '#e5e7eb': 'gray-200',
    '#d1d5db': 'gray-300',
    '#9ca3af': 'gray-400',
    '#6b7280': 'gray-500',
    '#4b5563': 'gray-600',
    '#374151': 'gray-700',
    '#1f2937': 'gray-800',
    '#111827': 'gray-900',
  };
  
  const mappedColor = colorMap[value.toLowerCase()];
  if (mappedColor) {
    return `${type}-${mappedColor}`;
  }
  
  // Use arbitrary value for custom colors
  return `${type}-[${value}]`;
}

export function stylesToTailwind(styles: ElementStyles): string {
  const classes: string[] = [];
  
  // Display
  if (styles.display === 'flex') classes.push('flex');
  else if (styles.display === 'grid') classes.push('grid');
  else if (styles.display === 'inline-block') classes.push('inline-block');
  else if (styles.display === 'inline') classes.push('inline');
  else if (styles.display === 'none') classes.push('hidden');
  else if (styles.display === 'block') classes.push('block');
  
  // Position
  if (styles.position === 'relative') classes.push('relative');
  else if (styles.position === 'absolute') classes.push('absolute');
  else if (styles.position === 'fixed') classes.push('fixed');
  else if (styles.position === 'sticky') classes.push('sticky');
  else if (styles.position === 'static') classes.push('static');
  
  // Padding
  if (styles.padding) {
    classes.push(convertToTailwindSpacing(styles.padding, 'p'));
  } else {
    if (styles.paddingTop) classes.push(convertToTailwindSpacing(styles.paddingTop, 'pt'));
    if (styles.paddingRight) classes.push(convertToTailwindSpacing(styles.paddingRight, 'pr'));
    if (styles.paddingBottom) classes.push(convertToTailwindSpacing(styles.paddingBottom, 'pb'));
    if (styles.paddingLeft) classes.push(convertToTailwindSpacing(styles.paddingLeft, 'pl'));
  }
  
  // Margin
  if (styles.margin) {
    classes.push(convertToTailwindSpacing(styles.margin, 'm'));
  } else {
    if (styles.marginTop) classes.push(convertToTailwindSpacing(styles.marginTop, 'mt'));
    if (styles.marginRight) classes.push(convertToTailwindSpacing(styles.marginRight, 'mr'));
    if (styles.marginBottom) classes.push(convertToTailwindSpacing(styles.marginBottom, 'mb'));
    if (styles.marginLeft) classes.push(convertToTailwindSpacing(styles.marginLeft, 'ml'));
  }
  
  // Width & Height
  if (styles.width) {
    if (styles.width === 'auto') classes.push('w-auto');
    else if (styles.width === '100%') classes.push('w-full');
    else if (styles.width === '50%') classes.push('w-1/2');
    else if (styles.width === '33.333333%') classes.push('w-1/3');
    else if (styles.width === '25%') classes.push('w-1/4');
    else classes.push(`w-[${styles.width}]`);
  }
  
  if (styles.height) {
    if (styles.height === 'auto') classes.push('h-auto');
    else if (styles.height === '100%') classes.push('h-full');
    else if (styles.height === '100vh') classes.push('h-screen');
    else classes.push(`h-[${styles.height}]`);
  }
  
  if (styles.minWidth) classes.push(`min-w-[${styles.minWidth}]`);
  if (styles.maxWidth) classes.push(`max-w-[${styles.maxWidth}]`);
  if (styles.minHeight) classes.push(`min-h-[${styles.minHeight}]`);
  if (styles.maxHeight) classes.push(`max-h-[${styles.maxHeight}]`);
  
  // Colors
  if (styles.backgroundColor) {
    classes.push(convertColorToTailwind(styles.backgroundColor, 'bg'));
  }
  if (styles.color) {
    classes.push(convertColorToTailwind(styles.color, 'text'));
  }
  
  // Border Width
  if (styles.borderWidth) {
    const borderWidthMap: Record<string, string> = {
      '0px': 'border-0',
      '1px': 'border',
      '2px': 'border-2',
      '4px': 'border-4',
      '8px': 'border-8',
    };
    classes.push(borderWidthMap[styles.borderWidth] || `border-[${styles.borderWidth}]`);
  } else if (styles.borderTopWidth || styles.borderRightWidth || styles.borderBottomWidth || styles.borderLeftWidth) {
    // Individual border widths
    if (styles.borderTopWidth) {
      const width = styles.borderTopWidth === '1px' ? 'border-t' : `border-t-[${styles.borderTopWidth}]`;
      classes.push(width);
    }
    if (styles.borderRightWidth) {
      const width = styles.borderRightWidth === '1px' ? 'border-r' : `border-r-[${styles.borderRightWidth}]`;
      classes.push(width);
    }
    if (styles.borderBottomWidth) {
      const width = styles.borderBottomWidth === '1px' ? 'border-b' : `border-b-[${styles.borderBottomWidth}]`;
      classes.push(width);
    }
    if (styles.borderLeftWidth) {
      const width = styles.borderLeftWidth === '1px' ? 'border-l' : `border-l-[${styles.borderLeftWidth}]`;
      classes.push(width);
    }
  } else if (styles.border) {
    classes.push('border');
  }
  
  // Border Style
  if (styles.borderStyle && styles.borderStyle !== 'solid') {
    if (styles.borderStyle === 'dashed') classes.push('border-dashed');
    else if (styles.borderStyle === 'dotted') classes.push('border-dotted');
    else if (styles.borderStyle === 'double') classes.push('border-double');
    else if (styles.borderStyle === 'none') classes.push('border-none');
  }
  
  // Border Color
  if (styles.borderColor) {
    classes.push(convertColorToTailwind(styles.borderColor, 'border'));
  }
  
  // Border Radius - All corners
  if (styles.borderRadius) {
    if (styles.borderRadius === '0px') classes.push('rounded-none');
    else if (styles.borderRadius === '2px') classes.push('rounded-sm');
    else if (styles.borderRadius === '4px') classes.push('rounded');
    else if (styles.borderRadius === '6px') classes.push('rounded-md');
    else if (styles.borderRadius === '8px') classes.push('rounded-lg');
    else if (styles.borderRadius === '12px') classes.push('rounded-xl');
    else if (styles.borderRadius === '16px') classes.push('rounded-2xl');
    else if (styles.borderRadius === '24px') classes.push('rounded-3xl');
    else if (styles.borderRadius === '9999px') classes.push('rounded-full');
    else classes.push(`rounded-[${styles.borderRadius}]`);
  }
  
  // Border Radius - Individual corners
  if (styles.borderTopLeftRadius) {
    classes.push(`rounded-tl-[${styles.borderTopLeftRadius}]`);
  }
  if (styles.borderTopRightRadius) {
    classes.push(`rounded-tr-[${styles.borderTopRightRadius}]`);
  }
  if (styles.borderBottomRightRadius) {
    classes.push(`rounded-br-[${styles.borderBottomRightRadius}]`);
  }
  if (styles.borderBottomLeftRadius) {
    classes.push(`rounded-bl-[${styles.borderBottomLeftRadius}]`);
  }
  
  // Flexbox
  if (styles.display === 'flex') {
    if (styles.flexDirection === 'row') classes.push('flex-row');
    else if (styles.flexDirection === 'column') classes.push('flex-col');
    else if (styles.flexDirection === 'row-reverse') classes.push('flex-row-reverse');
    else if (styles.flexDirection === 'column-reverse') classes.push('flex-col-reverse');
    
    if (styles.justifyContent === 'flex-start') classes.push('justify-start');
    else if (styles.justifyContent === 'flex-end') classes.push('justify-end');
    else if (styles.justifyContent === 'center') classes.push('justify-center');
    else if (styles.justifyContent === 'space-between') classes.push('justify-between');
    else if (styles.justifyContent === 'space-around') classes.push('justify-around');
    else if (styles.justifyContent === 'space-evenly') classes.push('justify-evenly');
    
    if (styles.alignItems === 'flex-start') classes.push('items-start');
    else if (styles.alignItems === 'flex-end') classes.push('items-end');
    else if (styles.alignItems === 'center') classes.push('items-center');
    else if (styles.alignItems === 'stretch') classes.push('items-stretch');
    else if (styles.alignItems === 'baseline') classes.push('items-baseline');
    
    if (styles.gap) {
      classes.push(convertToTailwindSpacing(styles.gap, 'gap'));
    }
  }
  
  // Grid
  if (styles.display === 'grid') {
    if (styles.gridTemplateColumns) classes.push(`grid-cols-[${styles.gridTemplateColumns}]`);
    if (styles.gridTemplateRows) classes.push(`grid-rows-[${styles.gridTemplateRows}]`);
    if (styles.gridGap) classes.push(convertToTailwindSpacing(styles.gridGap, 'gap'));
  }
  
  // Typography
  if (styles.fontSize) {
    const fontSizeMap: Record<string, string> = {
      '12px': 'text-xs',
      '14px': 'text-sm',
      '16px': 'text-base',
      '18px': 'text-lg',
      '20px': 'text-xl',
      '24px': 'text-2xl',
      '30px': 'text-3xl',
      '36px': 'text-4xl',
      '48px': 'text-5xl',
    };
    classes.push(fontSizeMap[styles.fontSize] || `text-[${styles.fontSize}]`);
  }
  
  if (styles.fontWeight) {
    const weightMap: Record<string, string> = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      'normal': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      'bold': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black',
    };
    if (weightMap[styles.fontWeight]) {
      classes.push(weightMap[styles.fontWeight]);
    }
  }
  
  if (styles.textAlign === 'left') classes.push('text-left');
  else if (styles.textAlign === 'center') classes.push('text-center');
  else if (styles.textAlign === 'right') classes.push('text-right');
  else if (styles.textAlign === 'justify') classes.push('text-justify');
  
  // Position coordinates
  if (styles.top) classes.push(`top-[${styles.top}]`);
  if (styles.right) classes.push(`right-[${styles.right}]`);
  if (styles.bottom) classes.push(`bottom-[${styles.bottom}]`);
  if (styles.left) classes.push(`left-[${styles.left}]`);
  
  return classes.join(' ');
}

export function stylesToInlineCSS(styles: ElementStyles): React.CSSProperties {
  const cssProperties: React.CSSProperties = {};
  
  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined) {
      cssProperties[key as keyof React.CSSProperties] = value as string;
    }
  });
  
  return cssProperties;
}

export function exportToReactCode(elements: UIElement[], indent: number = 0): string {
  const indentStr = '  '.repeat(indent);
  
  return elements.map(element => {
    const tailwindClasses = stylesToTailwind(element.styles);
    const attrs = element.attributes 
      ? Object.entries(element.attributes).map(([k, v]) => `${k}="${v}"`).join(' ')
      : '';
    
    const classNameAttr = tailwindClasses ? ` className="${tailwindClasses}"` : '';
    const openTag = `${indentStr}<${element.tag}${classNameAttr}${attrs ? ' ' + attrs : ''}>`;
    const content = element.content || '';
    const children = element.children.length > 0 
      ? '\n' + exportToReactCode(element.children, indent + 1) + '\n' + indentStr
      : content;
    const closeTag = `</${element.tag}>`;
    
    return `${openTag}${children}${closeTag}`;
  }).join('\n');
}

