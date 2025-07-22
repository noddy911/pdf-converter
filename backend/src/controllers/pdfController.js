// common logic for ai model

const axios = require('axios');

const extractDataFromImage = async (req, res) => {
    const { imageData } = req.body;

    if (!imageData) {
        return res.status(400).json({ message: "No image data provided." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;

    const prompt = `
        You are an expert data extraction assistant.
        Analyze the image of a product catalogue page.
        Extract all distinct products. For each, provide its name, price, and description.
        Respond ONLY with a valid JSON array of objects. Do not include markdown.
        Schema: { "productName": "string", "price": "string", "description": "string" }
    `;

    const payload = {
        contents: [{
            parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/png", data: imageData } }
            ]
        }],
    };

    try {
        const response = await axios.post(apiUrl, payload);
        const textResponse = response.data.candidates[0]?.content?.parts[0]?.text;

        if (!textResponse) {
             throw new Error("The AI model did not return any data.");
        }
        
        // The model might still wrap the response in markdown, so we clean it.
        const cleanedJsonString = textResponse.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanedJsonString);
        
        res.status(200).json(parsedData);

    } catch (error) {
        console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to extract data from AI model.", details: error.message });
    }
};

module.exports = { extractDataFromImage };