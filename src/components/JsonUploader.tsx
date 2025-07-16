'use client';

import { useState, useRef } from 'react';

interface JsonUploaderProps {
  onFilesUpload: (entries: any[], assets: any[]) => void;
  onError: (error: string) => void;
}

export default function JsonUploader({ onFilesUpload, onError }: JsonUploaderProps) {
  const [entriesFile, setEntriesFile] = useState<File | null>(null);
  const [assetsFile, setAssetsFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const entriesRef = useRef<HTMLInputElement>(null);
  const assetsRef = useRef<HTMLInputElement>(null);

  const processFiles = async () => {
    if (!entriesFile || !assetsFile) {
      onError('Please upload both entries.json and assets.json files');
      return;
    }

    try {
      const entriesText = await entriesFile.text();
      const assetsText = await assetsFile.text();
      
      const entriesData = JSON.parse(entriesText);
      const assetsData = JSON.parse(assetsText);

      if (!Array.isArray(entriesData) || !Array.isArray(assetsData)) {
        onError('Both files must contain valid JSON arrays');
        return;
      }

      onFilesUpload(entriesData, assetsData);
    } catch (error) {
      onError('Invalid JSON format in one or both files');
    }
  };

  const handleFileChange = (type: 'entries' | 'assets', file: File | null) => {
    if (file && !file.name.endsWith('.json')) {
      onError('Please upload only JSON files');
      return;
    }

    if (type === 'entries') {
      setEntriesFile(file);
    } else {
      setAssetsFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'entries' | 'assets') => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.name.endsWith('.json'));
    
    if (jsonFile) {
      handleFileChange(type, jsonFile);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">Upload JSON Files</h2>
        <p className="text-gray-400">Upload your entries.json and assets.json files to merge them</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Entries File Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-100">Entries JSON</label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-blue-400 bg-blue-600/10' : 'border-gray-600 hover:border-blue-400'
            } ${entriesFile ? 'border-green-400 bg-green-600/10' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => handleDrop(e, 'entries')}
          >
            <input
              ref={entriesRef}
              type="file"
              accept=".json"
              onChange={(e) => handleFileChange('entries', e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-3">
              <div className="text-5xl">
                {entriesFile ? '✅' : '📄'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-100">
                  {entriesFile ? entriesFile.name : 'Drop entries.json here'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  or click to browse
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assets File Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-100">Assets JSON</label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-blue-400 bg-blue-600/10' : 'border-gray-600 hover:border-blue-400'
            } ${assetsFile ? 'border-green-400 bg-green-600/10' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => handleDrop(e, 'assets')}
          >
            <input
              ref={assetsRef}
              type="file"
              accept=".json"
              onChange={(e) => handleFileChange('assets', e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-3">
              <div className="text-5xl">
                {assetsFile ? '✅' : '🗂️'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-100">
                  {assetsFile ? assetsFile.name : 'Drop assets.json here'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  or click to browse
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={processFiles}
          disabled={!entriesFile || !assetsFile}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Continue to Field Selection →
        </button>
      </div>
    </div>
  );
}