'use client';

import { useState, useEffect } from 'react';

interface FieldSelectorProps {
  entriesData: any[];
  onFieldsSelected: (selectedFields: string[]) => void;
  selectedFields: string[];
}

export default function FieldSelector({ 
  entriesData, 
  onFieldsSelected, 
  selectedFields 
}: FieldSelectorProps) {
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  useEffect(() => {
    if (entriesData.length > 0) {
      // Extract all unique field names from entries data
      const fieldSet = new Set<string>();
      entriesData.forEach(entry => {
        Object.keys(entry).forEach(key => fieldSet.add(key));
      });
      setAvailableFields(Array.from(fieldSet).sort());
    }
  }, [entriesData]);

  const handleFieldToggle = (field: string) => {
    const newSelectedFields = selectedFields.includes(field)
      ? selectedFields.filter(f => f !== field)
      : [...selectedFields, field];
    onFieldsSelected(newSelectedFields);
  };

  const selectAll = () => {
    onFieldsSelected(availableFields);
  };

  const clearAll = () => {
    onFieldsSelected([]);
  };

  if (availableFields.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
          <p className="text-gray-400">Upload entries.json to see available fields</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">Select Fields to Transform</h2>
        <p className="text-gray-400">
          Choose which fields from your entries.json should be replaced with matching data from assets.json. You can select multiple fields at once.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-100">
            Available Fields ({selectedFields.length}/{availableFields.length} selected)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1 text-sm border border-gray-600 text-gray-300 rounded hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableFields.map(field => (
            <label
              key={field}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedFields.includes(field)
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-gray-600 hover:border-blue-400 hover:bg-blue-600/10 text-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={() => handleFieldToggle(field)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
                selectedFields.includes(field)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-500'
              }`}>
                {selectedFields.includes(field) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-mono text-sm">{field}</span>
            </label>
          ))}
        </div>

        {selectedFields.length > 0 && (
          <div className="mt-6 p-4 bg-green-600/20 border border-green-600 rounded-lg">
            <p className="text-sm text-green-400">
              Selected {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''}: {selectedFields.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}