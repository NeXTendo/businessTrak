declare module 'react-signature-canvas' {
  import { Component } from 'react';
  export interface ReactSignatureCanvasProps {
    penColor?: string;
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    onEnd?: () => void;
  }
  export default class SignatureCanvas extends Component<ReactSignatureCanvasProps> {
    clear(): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    isEmpty(): boolean;
    getCanvas(): HTMLCanvasElement;
  }
}
