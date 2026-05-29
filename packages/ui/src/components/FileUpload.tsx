import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './Button';

export interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload, accept, maxSize = 5242880, maxFiles = 5, label, error, hint, className
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    if (onUpload) onUpload(newFiles);
  }, [files, maxFiles, onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    if (onUpload) onUpload(newFiles);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[#2C3E50]">{label}</label>}
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragActive ? 'border-[#E67E22] bg-[#E67E22]/5' : 'border-[#BDC3C7] hover:border-[#2C3E50] hover:bg-[#F4F6F7]',
          isDragReject && 'border-red-500 bg-red-50',
          error && 'border-red-500',
          files.length >= maxFiles && 'opacity-50 cursor-not-allowed hover:border-[#BDC3C7] hover:bg-transparent',
          className
        )}
      >
        <input {...getInputProps()} />
        <Upload className={cn('h-8 w-8 mb-2', isDragActive ? 'text-[#E67E22]' : 'text-[#BDC3C7]')} />
        <p className="text-sm font-medium text-[#2C3E50]">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max {maxFiles} files, up to {Math.round(maxSize / 1048576)}MB each
        </p>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}

      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-[#BDC3C7]/60 p-2 pr-3 bg-white">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="rounded-md bg-[#F4F6F7] p-2">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="h-4 w-4 text-[#2C3E50]" />
                  ) : (
                    <FileText className="h-4 w-4 text-[#2C3E50]" />
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-[#2C3E50] truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(i)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};