'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface CSVUploadProps {
  onFileUpload: (content: string) => void;
}

export default function CSVUpload({ onFileUpload }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFileType = (file: File): boolean => {
    const validTypes = ['text/plain', 'text/csv', 'text/tab-separated-values'];
    const validExtensions = ['.tsv', '.csv'];
    return validTypes.includes(file.type) || validExtensions.some(ext => file.name.endsWith(ext));
  };

  const handleFile = (file: File) => {
    if (!isValidFileType(file)) {
      alert('Please upload a CSV or TSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-green-500 bg-green-500/10'
            : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/50'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-16 h-16 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div>
            <p className="text-lg font-medium text-zinc-300">
              Drop your CSV file here, or click to browse
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              Tab-separated format from Seeking Alpha
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,text/csv,text/tab-separated-values,text/plain"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
