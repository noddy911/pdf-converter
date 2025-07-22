import React from 'react';
import { pdfjs } from 'react-pdf';

// CSS imports+
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Custom Hook for logic
import { usePdfExtractor } from './hooks/usePdfExtractor';

// Components
import Header from './components/common/Header';
import Workspace from './components/Workspace';

// Configure the PDF.js worker
// Using a reliable CDN like cdnjs is a good practice.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

function App() {
    // Call our custom hook to get all state and logic
    const extractor = usePdfExtractor();

    return (
        <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
            <Header onFileChange={extractor.onFileChange} pdfFile={extractor.pdfFile} />

            <main className="container mx-auto p-4">
                <Workspace {...extractor} />
            </main>
        </div>
    );
}

export default App;