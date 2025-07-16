'use client';

import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, Download } from 'lucide-react';
import { MergeResult } from './JsonReplacer';

interface JsonViewerProps {
  result: MergeResult;
}

export default function JsonViewer({ result }: JsonViewerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Validate data before processing
  if (!result || !result.mergedData || !Array.isArray(result.mergedData)) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-6 text-center">
          <p className="text-red-400">Error: Invalid result data</p>
        </div>
      </div>
    );
  }

  const data = result.mergedData;
  const jsonString = JSON.stringify(data, null, 2);
  const lines = jsonString.split('\n');

  // Syntax highlighting for a single JSON line
  const highlightJsonLine = (line: string) => {
    // Escape HTML
    let escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"(.*?)"(?=\s*:)/g, '<span class="text-blue-300 font-medium">"$1"</span>') // keys
      .replace(/: (".*?")/g, ': <span class="text-green-400">$1</span>') // string values
      .replace(/: (\d+(?:\.\d+)?)/g, ': <span class="text-yellow-400">$1</span>') // numbers
      .replace(/: (true|false)/g, ': <span class="text-purple-400 font-medium">$1</span>') // booleans
      .replace(/: null/g, ': <span class="text-red-400 font-medium">null</span>') // null
      .replace(/([{}\[\]])/g, '<span class="text-gray-300 font-bold">$1</span>') // brackets
      .replace(/([:,])/g, '<span class="text-gray-400">$1</span>'); // punctuation
    return escaped;
  };

  // Render each line with a perfectly synced line number and syntax highlighting, using table layout for alignment
  const renderJsonWithLineNumbers = () => (
    <div className="h-96 overflow-y-auto overflow-x-auto bg-gray-900 border border-gray-700 rounded-lg">
      <div className="table w-full min-w-max">
        {lines.map((line, idx) => (
          <div key={idx} className="table-row">
            <div className="table-cell align-top w-12 text-right pr-4 select-none text-gray-500 bg-gray-800 border-r border-gray-700 font-mono">
              {idx + 1}
            </div>
            <div className="table-cell align-top pl-4 font-mono text-sm text-gray-100 whitespace-pre">
              <span dangerouslySetInnerHTML={{ __html: highlightJsonLine(line) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSummary = () => {
    const totalSize = JSON.stringify(data).length;
    if (Array.isArray(data)) {
      return `${data.length} items • ${(totalSize / 1024).toFixed(1)} KB`;
    } else {
      const keys = Object.keys(data);
      return `${keys.length} properties • ${(totalSize / 1024).toFixed(1)} KB`;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - JSON Viewer (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-1">Merged JSON Result</h2>
                <p className="text-sm text-gray-400">{getSummary()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 text-gray-400 hover:text-gray-300 rounded transition-colors duration-200"
                  aria-label={isCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isCollapsed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.62 6.623A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.293 5.07M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  )}
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm text-green-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                      <span className="text-sm font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* JSON Output */}
          {!isCollapsed && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-0">
              {renderJsonWithLineNumbers()}
            </div>
          )}
          {/* Collapsed view */}
          {isCollapsed && (
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">JSON viewer collapsed - click the eye icon to expand</p>
            </div>
          )}
        </div>

        {/* Right side - Export Options and Statistics (1/3 width) */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          {/* Export Options Section */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 w-full text-left">Export Options</h3>
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Download JSON</span>
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              File size: {(JSON.stringify(result.mergedData).length / 1024).toFixed(1)} KB • Format: JSON
            </p>
          </div>

          {/* Merge Statistics Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Merge Statistics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Files merged:</span>
                <span className="font-medium text-gray-100">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Items:</span>
                <span className="font-medium text-gray-100">{result.mergedData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total size:</span>
                <span className="font-medium text-gray-100">{(JSON.stringify(result.mergedData).length / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          </div>

          {/* Field Statistics */}
          {result.stats && result.stats.fieldStats && Array.isArray(result.stats.fieldStats) && result.stats.fieldStats.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Field Statistics</h3>
              <div className="space-y-3">
                {result.stats.fieldStats.map((fieldStat, index) => (
                  <div key={fieldStat.field || `field-${index}`} className="bg-gray-700 rounded-lg p-3">
                    <div className="font-mono text-sm font-medium text-gray-100 mb-1">
                      {fieldStat.field || 'Unknown field'}
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400 font-medium">
                        ✓ {fieldStat.matched || 0} matched
                      </span>
                      <span className="text-orange-400 font-medium">
                        ✗ {fieldStat.unmatched || 0} unmatched
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}