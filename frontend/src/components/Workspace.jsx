import React from 'react';
import PDFViewer from './PDFViewer';
import DataDisplay from './DataDisplay';

// This component represents the main working area of the application.
const Workspace = ({
    pdfFile,
    onDocumentLoadSuccess,
    currentPage,
    numPages,
    handleExtractData,
    isLoading,
    goToPrevPage,
    goToNextPage,
    extractedData,
    error,
    copyToClipboard,
    copySuccess
}) => {
    if (!pdfFile) {
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h2 className="mt-2 text-xl font-semibold text-slate-700">Upload a PDF to begin</h2>
                <p className="mt-1 text-slate-500">Your document will be processed securely.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PDFViewer 
                pdfFile={pdfFile}
                onDocumentLoadSuccess={onDocumentLoadSuccess}
                currentPage={currentPage}
                numPages={numPages}
                onExtract={handleExtractData}
                isLoading={isLoading}
                goToPrevPage={goToPrevPage}
                goToNextPage={goToNextPage}
            />
            <DataDisplay 
                extractedData={extractedData}
                isLoading={isLoading}
                error={error}
                copyToClipboard={copyToClipboard}
                copySuccess={copySuccess}
            />
        </div>
    );
};

export default Workspace;