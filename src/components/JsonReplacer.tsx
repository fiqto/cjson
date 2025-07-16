'use client';

import { FieldMapping } from './MappingConfigurator';

export interface MergeResult {
  mergedData: any[];
  stats: {
    totalEntries: number;
    totalMappings: number;
    matchedMappings: number;
    unmatchedMappings: number;
    fieldStats: Array<{
      field: string;
      matched: number;
      unmatched: number;
    }>;
  };
}

export function mergeJsonData(
  entries: any[],
  assets: any[],
  mappings: FieldMapping[]
): MergeResult {
  // Create lookup maps for each mapping's match key
  const assetMaps = new Map<string, Map<any, any>>();
  
  mappings.forEach(mapping => {
    if (!assetMaps.has(mapping.matchKey)) {
      const assetMap = new Map();
      assets.forEach(asset => {
        if (asset[mapping.matchKey] !== undefined) {
          // Store both string and number versions to handle type mismatches
          const value = asset[mapping.matchKey];
          assetMap.set(value, asset);
          assetMap.set(value.toString(), asset);
          if (typeof value === 'string' && !isNaN(Number(value))) {
            assetMap.set(Number(value), asset);
          }
        }
      });
      assetMaps.set(mapping.matchKey, assetMap);
    }
  });

  const fieldStats: Array<{ field: string; matched: number; unmatched: number }> = [];
  let totalMatched = 0;
  let totalUnmatched = 0;

  // Process entries
  const mergedData = entries.map(entry => {
    const newEntry = { ...entry };
    
    mappings.forEach(mapping => {
      const assetMap = assetMaps.get(mapping.matchKey);
      if (!assetMap) return;

      const sourceValue = entry[mapping.sourceField];
      let fieldMatched = 0;
      let fieldUnmatched = 0;

      if (sourceValue !== undefined) {
        if (Array.isArray(sourceValue)) {
          // Handle array of IDs
          const results = sourceValue.map(id => {
            const matchedAsset = assetMap.get(id);
            if (matchedAsset && matchedAsset[mapping.replaceWithKey] !== undefined) {
              fieldMatched++;
              totalMatched++;
              return matchedAsset[mapping.replaceWithKey];
            } else {
              fieldUnmatched++;
              totalUnmatched++;
              return null;
            }
          });
          newEntry[mapping.targetField] = results;
        } else {
          // Handle single ID
          const matchedAsset = assetMap.get(sourceValue);
          
          if (matchedAsset && matchedAsset[mapping.replaceWithKey] !== undefined) {
            newEntry[mapping.targetField] = matchedAsset[mapping.replaceWithKey];
            fieldMatched = 1;
            totalMatched++;
          } else {
            newEntry[mapping.targetField] = null;
            fieldUnmatched = 1;
            totalUnmatched++;
          }
        }
        
        if (mapping.removeOriginal) {
          delete newEntry[mapping.sourceField];
        }
      } else {
        // Entry doesn't have the source field
        newEntry[mapping.targetField] = null;
        fieldUnmatched = 1;
        totalUnmatched++;
      }

      // Update field stats
      const existingFieldStat = fieldStats.find(s => s.field === mapping.sourceField);
      if (existingFieldStat) {
        existingFieldStat.matched += fieldMatched;
        existingFieldStat.unmatched += fieldUnmatched;
      } else {
        fieldStats.push({
          field: mapping.sourceField,
          matched: fieldMatched,
          unmatched: fieldUnmatched
        });
      }
    });
    
    return newEntry;
  });

  return {
    mergedData,
    stats: {
      totalEntries: entries.length,
      totalMappings: mappings.length * entries.length,
      matchedMappings: totalMatched,
      unmatchedMappings: totalUnmatched,
      fieldStats
    }
  };
}

interface JsonReplacerProps {
  entriesData: any[];
  assetsData: any[];
  mappings: FieldMapping[];
  onMergeComplete: (result: MergeResult) => void;
}

export default function JsonReplacer({ 
  entriesData, 
  assetsData, 
  mappings, 
  onMergeComplete 
}: JsonReplacerProps) {
  const handleMerge = () => {
    const result = mergeJsonData(entriesData, assetsData, mappings);
    onMergeComplete(result);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-muted rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">Processing Configuration</h3>
        
        <div className="space-y-3">
          {mappings.map((mapping, index) => (
            <div key={index} className="bg-background rounded p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-accent">
                  {mapping.sourceField} → {mapping.targetField}
                </span>
                <span className="text-foreground/60">
                  Match: {mapping.matchKey} | Replace: {mapping.replaceWithKey}
                </span>
              </div>
              {mapping.removeOriginal && (
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Will remove original field
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-foreground/70">
          <p>Entries: {entriesData.length} items</p>
          <p>Assets: {assetsData.length} items</p>
          <p>Field mappings: {mappings.length}</p>
        </div>
        <button
          onClick={handleMerge}
          disabled={mappings.length === 0}
          className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Process Merge
        </button>
      </div>
    </div>
  );
}