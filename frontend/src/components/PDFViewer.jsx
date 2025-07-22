import React from 'react';
import { Document, Page } from 'react-pdf';
import Spinner from './common/Spinner';

const PDFViewer = ({ pdfFile, onDocumentLoadSuccess, currentPage, numPages, onExtract, isLoading, goToPrevPage, goToNextPage }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">PDF Preview</h2>
            <div className="bg-slate-200 p-2 rounded-md min-h-[600px] flex justify-center items-center">
                <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="text-slate-500">Loading PDF...</div>}
                >
                    <Page pageNumber={currentPage} width={600} />
                </Document>
            </div>
            {numPages && (
                <div className="flex items-center justify-between mt-4">
                    <button onClick={goToPrevPage} disabled={currentPage <= 1} className="px-4 py-2 bg-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-300 transition">Prev</button>
                    <p>Page {currentPage} of {numPages}</p>
                    <button onClick={goToNextPage} disabled={currentPage >= numPages} className="px-4 py-2 bg-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-300 transition">Next</button>
                </div>
            )}
            <div className="mt-6 text-center">
                <button
                    onClick={onExtract}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 disabled:bg-indigo-300 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <Spinner />
                            <span className="ml-2">Extracting Data...</span>
                        </>
                    ) : 'Extract Data from This Page'}
                </button>
            </div>
        </div>
    );
};

export default PDFViewer;