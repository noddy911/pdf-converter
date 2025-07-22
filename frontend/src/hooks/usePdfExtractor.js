import { useState, useCallback, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { postImageForExtraction } from '../services/apiService';

// This custom hook encapsulates all the logic for PDF extraction.
export const usePdfExtractor = () => {
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

    // Navigation handlers
    const goToPrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
    const goToNextPage = () => setCurrentPage(p => Math.min(p + 1, numPages));

    // Core function to handle the data extraction process
    const handleExtractData = useCallback(async () => {
        if (!pdfFile) return;

        setIsLoading(true);
        setError(null);
        setExtractedData(null);

        try {
            const fileArrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjs.getDocument(fileArrayBuffer).promise;
            const page = await pdf.getPage(currentPage);
            const scale = 2.0;
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const context = canvas.getContext('2d');

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const base64ImageData = canvas.toDataURL('image/png').split(',')[1];
            
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
        try {
            const textArea = document.createElement("textarea");
            textArea.value = jsonString;
            textArea.style.position = "fixed";
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

    // Return all state and functions to be used by components
    return {
        pdfFile,
        numPages,
        currentPage,
        extractedData,
        isLoading,
        error,
        copySuccess,
        onFileChange,
        onDocumentLoadSuccess,
        goToPrevPage,
        goToNextPage,
        handleExtractData,
        copyToClipboard,
    };
};