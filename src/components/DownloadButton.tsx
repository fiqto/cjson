'use client';

import { useState } from 'react';

interface DownloadButtonProps {
  data: any[];
  filename?: string;
  disabled?: boolean;
}

export default function DownloadButton({ 
  data, 
  filename = 'merged-data.json',
  disabled = false 
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (disabled || !data.length) return;

    setIsDownloading(true);
    
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatFileSize = (data: any[]) => {
    const jsonString = JSON.stringify(data, null, 2);
    const bytes = new Blob([jsonString]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Export Options Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Export Options</h3>
              <p className="text-sm text-gray-400">
                File size: {formatFileSize(data)} • Format: JSON
              </p>
            </div>
            
            <button
              onClick={handleDownload}
              disabled={disabled || !data.length || isDownloading}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download JSON
                </>
              )}
            </button>
          </div>
          
          {data.length === 0 && (
            <div className="mt-4 p-3 bg-orange-600/10 border border-orange-600/30 rounded text-orange-400 text-sm">
              No data available for download. Please upload and merge JSON files first.
            </div>
          )}
        </div>

        {/* Merge Statistics Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Merge Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Files merged:</div>
              <div className="text-xl font-semibold text-gray-100">2</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Items:</div>
              <div className="text-xl font-semibold text-gray-100">{data.length}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Total size:</div>
              <div className="text-xl font-semibold text-gray-100">{formatFileSize(data)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}