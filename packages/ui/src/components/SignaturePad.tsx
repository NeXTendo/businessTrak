import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './Button';

export interface SignaturePadProps {
  onEnd?: (dataUrl: string | null) => void;
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onEnd, label, error, hint, className }) => {
  const padRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleEnd = () => {
    if (padRef.current) {
      const empty = padRef.current.isEmpty();
      setIsEmpty(empty);
      if (onEnd) {
        onEnd(empty ? null : padRef.current.toDataURL());
      }
    }
  };

  const handleClear = () => {
    if (padRef.current) {
      padRef.current.clear();
      setIsEmpty(true);
      if (onEnd) onEnd(null);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#2C3E50]">{label}</label>
          {!isEmpty && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-6 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
              <Eraser className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      )}
      <div className={cn('relative rounded-md border bg-white overflow-hidden', error ? 'border-red-500' : 'border-[#BDC3C7]', className)}>
        <SignatureCanvas
          ref={padRef}
          penColor="#2C3E50"
          canvasProps={{ className: 'w-full h-40 cursor-crosshair' }}
          onEnd={handleEnd}
        />
        {isEmpty && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-300 text-xl font-medium select-none">
            Sign Here
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
};