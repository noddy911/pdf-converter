import React from 'react';
import ErrorMessage from './common/ErrorMessage';

const DataDisplay = ({ extractedData, isLoading, error, copyToClipboard, copySuccess }) => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Extracted Data</h2>
        {error && <ErrorMessage message={error} />}
        {isLoading && !error && <div className="text-center py-10 text-slate-500">Processing...</div>}
        
        {extractedData ? (
            <div className="relative">
                <button onClick={copyToClipboard} className="absolute top-0 right-0 bg-slate-200 text-slate-700 text-xs font-semibold py-1 px-2 rounded hover:bg-slate-300 transition">
                    {copySuccess || 'Copy JSON'}
                </button>
                <pre className="bg-slate-800 text-white p-4 rounded-md text-sm overflow-x-auto mt-8">
                    {JSON.stringify(extractedData, null, 2)}
                </pre>
            </div>
        ) : (
            !isLoading && !error && <p className="text-slate-500 text-center py-10">Data will appear here after extraction.</p>
        )}
    </div>
);

export default DataDisplay;