import React, { useState, useCallback, useEffect } from 'react';
import { pdfjs } from 'react-pdf';

// Corrected CSS imports for react-pdf v6+
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Header from './components/common/Header';
import PDFViewer from './components/PDFViewer';
import DataDisplay from './components/DataDisplay';
import { postImageForExtraction } from './services/apiService';

// --- FIX: Use a reliable CDN (cdnjs) to avoid CORS issues ---
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function App() {
    // --- State Management ---
    const [pdfFile, setPdfFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [extractedData, setExtractedData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');

    // --- Effects and Handlers ---

    // Reset state when a new PDF file is selected
    useEffect(() => {
        if (pdfFile) {
            setNumPages(null);
            setCurrentPage(1);
            setExtractedData(null);
            setError(null);
        }
    }, [pdfFile]);

    // Handle file input change
    const onFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            setError("Please select a valid PDF file.");
            setPdfFile(null);
        }
    };

    // Set the number of pages once the document is loaded
    const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
        setNumPages(nextNumPages);
    };

    // Core function to handle the data extraction process
    const handleExtractData = useCallback(async () => {
        if (!pdfFile) return;

        setIsLoading(true);
        setError(null);
        setExtractedData(null);

        try {
            // 1. Render the current PDF page to a hidden canvas to get an image
            const fileArrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjs.getDocument(fileArrayBuffer).promise;
            const page = await pdf.getPage(currentPage);
            const scale = 2.0; // Use a higher scale for better image quality
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const context = canvas.getContext('2d');

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            // 2. Convert the canvas to Base64 image data
            const base64ImageData = canvas.toDataURL('image/png').split(',')[1];
            
            // 3. Send the image data to our secure backend service for processing
            const data = await postImageForExtraction(base64ImageData);
            setExtractedData(data);

        } catch (err) {
            console.error("Extraction failed:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [pdfFile, currentPage]);

    // Handles copying the extracted JSON data to the clipboard
    const copyToClipboard = () => {
        if (!extractedData) return;
        const jsonString = JSON.stringify(extractedData, null, 2);
        
        // Use a reliable fallback for copying text that works in most environments
        try {
            const textArea = document.createElement("textarea");
            textArea.value = jsonString;
            textArea.style.position = "fixed"; // Hide the textarea from view
            textArea.style.top = "-9999px";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            setCopySuccess('Failed to copy.');
        }
    };

    // --- Render Method ---
    return (
        <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
            <Header onFileChange={onFileChange} pdfFile={pdfFile} />

            <main className="container mx-auto p-4">
                {!pdfFile ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <h2 className="mt-2 text-xl font-semibold text-slate-700">Upload a PDF to begin</h2>
                        <p className="mt-1 text-slate-500">Your document will be processed securely.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <PDFViewer 
                            pdfFile={pdfFile}
                            onDocumentLoadSuccess={onDocumentLoadSuccess}
                            currentPage={currentPage}
                            numPages={numPages}
                            onExtract={handleExtractData}
                            isLoading={isLoading}
                            goToPrevPage={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            goToNextPage={() => setCurrentPage(p => Math.min(p + 1, numPages))}
                        />
                        <DataDisplay 
                            extractedData={extractedData}
                            isLoading={isLoading}
                            error={error}
                            copyToClipboard={copyToClipboard}
                            copySuccess={copySuccess}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

