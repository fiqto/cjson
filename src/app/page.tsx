'use client';

import { useState, useReducer } from 'react';
import { Layers } from 'lucide-react';
import JsonUploader from '@/components/JsonUploader';
import FieldSelector from '@/components/FieldSelector';
import MappingConfigurator, { FieldMapping } from '@/components/MappingConfigurator';
import JsonReplacer, { MergeResult, mergeJsonData } from '@/components/JsonReplacer';
import JsonViewer from '@/components/JsonViewer';

interface AppState {
  entriesData: any[];
  assetsData: any[];
  selectedFields: string[];
  fieldMappings: FieldMapping[];
  mergeResult: MergeResult | null;
  error: string;
  step: 'upload' | 'select-fields' | 'configure-mapping' | 'process' | 'result';
}

type AppAction = 
  | { type: 'SET_FILES'; entriesData: any[]; assetsData: any[] }
  | { type: 'SET_SELECTED_FIELDS'; selectedFields: string[] }
  | { type: 'SET_FIELD_MAPPINGS'; fieldMappings: FieldMapping[] }
  | { type: 'SET_MERGE_RESULT'; mergeResult: MergeResult }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_STEP'; step: AppState['step'] }
  | { type: 'RESET' };

const initialState: AppState = {
  entriesData: [],
  assetsData: [],
  selectedFields: [],
  fieldMappings: [],
  mergeResult: null,
  error: '',
  step: 'upload'
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_FILES':
      return {
        ...state,
        entriesData: action.entriesData,
        assetsData: action.assetsData,
        error: '',
        step: 'select-fields'
      };
    case 'SET_SELECTED_FIELDS':
      return {
        ...state,
        selectedFields: action.selectedFields
      };
    case 'SET_FIELD_MAPPINGS':
      return {
        ...state,
        fieldMappings: action.fieldMappings
      };
    case 'SET_MERGE_RESULT':
      return {
        ...state,
        mergeResult: action.mergeResult,
        step: 'result'
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error
      };
    case 'SET_STEP':
      return {
        ...state,
        step: action.step
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleFilesUpload = (entries: any[], assets: any[]) => {
    dispatch({ type: 'SET_FILES', entriesData: entries, assetsData: assets });
  };

  const handleFieldsSelected = (selectedFields: string[]) => {
    dispatch({ type: 'SET_SELECTED_FIELDS', selectedFields });
  };

  const handleMappingConfigured = (fieldMappings: FieldMapping[]) => {
    dispatch({ type: 'SET_FIELD_MAPPINGS', fieldMappings });
  };

  const handleMergeComplete = (mergeResult: MergeResult) => {
    dispatch({ type: 'SET_MERGE_RESULT', mergeResult });
  };

  const handleError = (errorMessage: string) => {
    dispatch({ type: 'SET_ERROR', error: errorMessage });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const handleProcessMerge = () => {
    if (state.fieldMappings.length === 0) {
      handleError('Please configure at least one field mapping');
      return;
    }
    
    dispatch({ type: 'SET_STEP', step: 'process' });
    
    // Process the merge with a slight delay for UI feedback
    setTimeout(() => {
      const result = mergeJsonData(state.entriesData, state.assetsData, state.fieldMappings);
      handleMergeComplete(result);
    }, 1000);
  };

  const canProceedToMapping = state.selectedFields.length > 0;
  const canProcessMerge = state.fieldMappings.length > 0;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100">JSON Merger</h1>
                <p className="text-sm text-gray-400">Merge multiple JSON files with ease</p>
              </div>
            </div>
            {state.step !== 'upload' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-300 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Display */}
        {state.error && (
          <div className="mb-6">
            <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {state.error}
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-2 sm:space-x-4">
              {[
                { name: 'Upload', key: 'upload' },
                { name: 'Select Fields', key: 'select-fields' },
                { name: 'Configure', key: 'configure-mapping' },
                { name: 'Process', key: 'process' },
                { name: 'Download', key: 'result' }
              ].map((stepInfo, index) => {
                const isActive = state.step === stepInfo.key;
                const isCompleted = 
                  (state.step === 'select-fields' && index === 0) ||
                  (state.step === 'configure-mapping' && index <= 1) ||
                  (state.step === 'process' && index <= 2) ||
                  (state.step === 'result' && index <= 3);

                return (
                  <li key={stepInfo.key} className="flex items-center">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : isCompleted 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${isActive ? 'text-gray-100' : 'text-gray-400'}`}>
                        {stepInfo.name}
                      </span>
                    </div>
                    {index < 4 && (
                      <div className={`w-8 h-px mx-2 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-700'
                      }`} />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        {state.step === 'upload' && (
          <JsonUploader onFilesUpload={handleFilesUpload} onError={handleError} />
        )}

        {state.step === 'select-fields' && (
          <div className="space-y-6">
            <FieldSelector
              entriesData={state.entriesData}
              onFieldsSelected={handleFieldsSelected}
              selectedFields={state.selectedFields}
            />
            {canProceedToMapping && (
              <div className="text-center">
                <button
                  onClick={() => dispatch({ type: 'SET_STEP', step: 'configure-mapping' })}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                  Next: Configure Mappings →
                </button>
              </div>
            )}
          </div>
        )}

        {state.step === 'configure-mapping' && (
          <div className="space-y-6">
            <MappingConfigurator
              selectedFields={state.selectedFields}
              assetsData={state.assetsData}
              onMappingConfigured={handleMappingConfigured}
              currentMappings={state.fieldMappings}
            />
            {canProcessMerge && (
              <div className="text-center">
                <button
                  onClick={handleProcessMerge}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                  Process Merge →
                </button>
              </div>
            )}
          </div>
        )}

        {state.step === 'process' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">Processing Mappings</h2>
            <p className="text-gray-400">Applying field transformations...</p>
          </div>
        )}

        {state.step === 'result' && state.mergeResult && (
          <JsonViewer result={state.mergeResult} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>MJSON - Built with Next.js 15 and TypeScript • Advanced JSON Field Mapping Tool</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
