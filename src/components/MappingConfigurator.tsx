'use client';

import { useState, useEffect, useRef } from 'react';

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  matchKey: string;
  replaceWithKey: string;
  removeOriginal: boolean;
}

interface MappingConfiguratorProps {
  selectedFields: string[];
  assetsData: any[];
  onMappingConfigured: (mappings: FieldMapping[]) => void;
  currentMappings: FieldMapping[];
}

export default function MappingConfigurator({
  selectedFields,
  assetsData,
  onMappingConfigured,
  currentMappings
}: MappingConfiguratorProps) {
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [availableAssetKeys, setAvailableAssetKeys] = useState<string[]>([]);
  const previousSelectedFields = useRef<string[]>([]);

  useEffect(() => {
    if (assetsData.length > 0) {
      const keySet = new Set<string>();
      assetsData.forEach(asset => {
        Object.keys(asset).forEach(key => keySet.add(key));
      });
      setAvailableAssetKeys(Array.from(keySet).sort());
    }
  }, [assetsData]);

  useEffect(() => {
    // Only run when selected fields actually change
    const fieldsChanged = JSON.stringify(selectedFields) !== JSON.stringify(previousSelectedFields.current);
    
    if (fieldsChanged) {
      // Initialize mappings for selected fields
      const newMappings = selectedFields.map(field => {
        const existingMapping = currentMappings.find(m => m.sourceField === field);
        if (existingMapping) {
          return existingMapping;
        }
        
        // Smart defaults
        const targetField = field.endsWith('Id') ? field.slice(0, -2) : field;
        return {
          sourceField: field,
          targetField,
          matchKey: 'id',
          replaceWithKey: 'filename',
          removeOriginal: false
        };
      });
      
      setMappings(newMappings);
      
      // Only call onMappingConfigured when fields change
      if (selectedFields.length > 0) {
        onMappingConfigured(newMappings);
      }
      
      previousSelectedFields.current = selectedFields;
    }
  }, [selectedFields, currentMappings, onMappingConfigured]);

  const updateMapping = (index: number, updates: Partial<FieldMapping>) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], ...updates };
    setMappings(newMappings);
    onMappingConfigured(newMappings);
  };

  const setGlobalDefaults = (matchKey: string, replaceWithKey: string) => {
    const newMappings = mappings.map(mapping => ({
      ...mapping,
      matchKey,
      replaceWithKey
    }));
    setMappings(newMappings);
    onMappingConfigured(newMappings);
  };

  if (selectedFields.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400">Select fields to configure their mappings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Configure Field Mappings</h2>
        <p className="text-gray-400">
          Define how each selected field should be matched and replaced with data from assets.json
        </p>
      </div>

      {/* Global Defaults */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-3">Quick Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-100">Match Key (in assets.json)</label>
            <select
              onChange={(e) => setGlobalDefaults(e.target.value, mappings[0]?.replaceWithKey || 'filename')}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={mappings[0]?.matchKey || 'id'}
            >
              {availableAssetKeys.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-100">Replace With (from assets.json)</label>
            <select
              onChange={(e) => setGlobalDefaults(mappings[0]?.matchKey || 'id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={mappings[0]?.replaceWithKey || 'filename'}
            >
              {availableAssetKeys.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          These settings will be applied to all field mappings below
        </p>
      </div>

      {/* Individual Field Mappings */}
      <div className="space-y-4">
        {mappings.map((mapping, index) => (
          <div key={mapping.sourceField} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-100">Source Field</label>
                <div className="px-3 py-2 bg-gray-700 rounded-lg text-gray-100 font-mono text-sm truncate" title={mapping.sourceField}>
                  {mapping.sourceField}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-100">New Field Name</label>
                <input
                  type="text"
                  value={mapping.targetField}
                  onChange={(e) => updateMapping(index, { targetField: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., image"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-100">Match Key</label>
                <select
                  value={mapping.matchKey}
                  onChange={(e) => updateMapping(index, { matchKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableAssetKeys.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-100">Replace With</label>
                <select
                  value={mapping.replaceWithKey}
                  onChange={(e) => updateMapping(index, { replaceWithKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableAssetKeys.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mapping.removeOriginal}
                  onChange={(e) => updateMapping(index, { removeOriginal: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-100">Remove original field ({mapping.sourceField})</span>
              </label>
            </div>

            {/* Preview */}
            <div className="mt-3 p-3 bg-gray-700 rounded border border-gray-600 text-sm">
              <span className="text-gray-400">Preview: </span>
              <span className="font-mono text-gray-100">
                {mapping.sourceField} → {mapping.targetField} 
                <span className="text-gray-500">
                  {' '}(match entry.{mapping.sourceField} with asset.{mapping.matchKey}, replace with asset.{mapping.replaceWithKey})
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
        <h4 className="font-semibold text-green-400 mb-2">Configuration Summary</h4>
        <ul className="text-sm text-green-400 space-y-1">
          {mappings.map(mapping => (
            <li key={mapping.sourceField} className="font-mono">
              {mapping.sourceField} → {mapping.targetField} ({mapping.removeOriginal ? 'remove original' : 'keep original'})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}