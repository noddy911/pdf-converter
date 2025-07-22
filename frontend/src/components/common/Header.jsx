import React from 'react';

const Header = ({ onFileChange, pdfFile }) => (
    <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">PDF Catalog Extractor</h1>
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={onFileChange}
                accept="application/pdf"
            />
            <label
                htmlFor="file-upload"
                className="cursor-pointer bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-300"
            >
                {pdfFile ? 'Change PDF' : 'Upload PDF'}
            </label>
        </div>
    </header>
);

export default Header;