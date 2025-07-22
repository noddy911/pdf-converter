const axios = require('axios');

const extractDataFromImage = async (req, res) => {
    const { imageData } = req.body;

    if (!imageData) {
        return res.status(400).json({ message: "No image data provided." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // --- FIX: Updated the model from the deprecated 'gemini-pro-vision' ---
    // Switched to 'gemini-1.5-flash-latest' as recommended for better performance and support.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const prompt = `
        You are an expert data extraction assistant.
        Analyze the image of a product catalogue page.
        Extract all distinct products. For each, provide its name, price, and a brief description if available.
        Respond ONLY with a valid JSON array of objects. Do not include any markdown formatting or the json specifier.
        The schema for each object in the array should be:
        { "productName": "string", "price": "string", "description": "string" }
    `;

    const payload = {
        contents: [{
            parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/png", data: imageData } }
            ]
        }],
        // It's good practice to add safety settings
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE",
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE",
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE",
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE",
            },
        ],
    };

    try {
        const response = await axios.post(apiUrl, payload);
        
        // Defensive coding: Check if the response structure is as expected
        if (!response.data.candidates || !response.data.candidates[0]?.content?.parts[0]?.text) {
             throw new Error("The AI model returned an unexpected response structure.");
        }

        const textResponse = response.data.candidates[0].content.parts[0].text;
        
        // The model might still wrap the response in markdown, so we clean it.
        const cleanedJsonString = textResponse.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanedJsonString);
        
        res.status(200).json(parsedData);

    } catch (error) {
        // Log the detailed error on the server for debugging
        console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to extract data from AI model.", details: error.message });
    }
};

module.exports = { extractDataFromImage };