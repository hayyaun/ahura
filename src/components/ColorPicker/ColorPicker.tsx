import { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

// Convert hex to HSV
function hexToHSV(hex: string): { h: number; s: number; v: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6;
    else if (max === g) h = (b - r) / diff + 2;
    else h = (r - g) / diff + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return { h, s, v };
}

// Convert HSV to hex
function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hsv, setHsv] = useState(() => hexToHSV(value));
  const [hexInput, setHexInput] = useState(value);
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [isDraggingSaturation, setIsDraggingSaturation] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  useEffect(() => {
    setHsv(hexToHSV(value));
    setHexInput(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const updateColor = (newH: number, newS: number, newV: number) => {
    const hex = hsvToHex(newH, newS, newV);
    setHsv({ h: newH, s: newS, v: newV });
    setHexInput(hex);
    onChange(hex);
  };

  const handleSaturationMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSaturation(true);
    handleSaturationMove(e);
  };

  const handleSaturationMove = (e: React.MouseEvent | MouseEvent) => {
    if (!saturationRef.current) return;
    const rect = saturationRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    const s = x / rect.width;
    const v = 1 - y / rect.height;
    updateColor(hsv.h, s, v);
  };

  const handleHueMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHue(true);
    handleHueMove(e);
  };

  const handleHueMove = (e: React.MouseEvent | MouseEvent) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    const h = (y / rect.height) * 360;
    updateColor(h, hsv.s, hsv.v);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSaturation) handleSaturationMove(e);
      if (isDraggingHue) handleHueMove(e);
    };

    const handleMouseUp = () => {
      setIsDraggingSaturation(false);
      setIsDraggingHue(false);
    };

    if (isDraggingSaturation || isDraggingHue) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSaturation, isDraggingHue, hsv]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexInput(newValue);
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      const newHsv = hexToHSV(newValue);
      setHsv(newHsv);
      onChange(newValue);
    }
  };

  const pureHue = hsvToHex(hsv.h, 1, 1);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Color Swatch */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-6 h-6 rounded border border-gray-600 overflow-hidden hover:border-gray-500 transition-colors flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        
        {/* Label */}
        <span className="text-xs text-gray-300 flex-1">{label}</span>
        
        {/* Opacity */}
        <span className="text-xs text-gray-400">100%</span>
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full mt-1 left-0 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2.5 w-52"
        >
          <div className="flex gap-2 mb-2">
            {/* Saturation/Value Square */}
            <div
              ref={saturationRef}
              onMouseDown={handleSaturationMouseDown}
              className="relative w-full h-32 rounded cursor-crosshair"
              style={{
                background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${pureHue})`,
              }}
            >
              {/* Cursor */}
              <div
                className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${hsv.s * 100}%`,
                  top: `${(1 - hsv.v) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>

            {/* Hue Slider */}
            <div
              ref={hueRef}
              onMouseDown={handleHueMouseDown}
              className="relative w-4 h-32 rounded cursor-pointer"
              style={{
                background: 'linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
              }}
            >
              {/* Slider Handle */}
              <div
                className="absolute w-full h-0.5 bg-white shadow-lg pointer-events-none"
                style={{
                  top: `${(hsv.h / 360) * 100}%`,
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          </div>

          {/* Hex Input */}
          <input
            type="text"
            value={hexInput.toUpperCase()}
            onChange={handleHexChange}
            className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 font-mono text-center"
            placeholder="#000000"
          />
        </div>
      )}
    </div>
  );
}

