const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config(); // Force env reload

// Generate Content with Gemini AI
router.post('/generate', async (req, res) => {
  try {
    const { type, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key is not configured in backend' });
    }

    if (!context || !type) {
      return res.status(400).json({ message: 'Type and context are required' });
    }

    let prompt = '';
    
    if (type === 'description') {
      prompt = `Act as an expert luxury fashion copywriter. I will provide you with either a product name, details, or an existing product description. Your task is to generate or rewrite it into a highly engaging, premium product description. The tone MUST ALWAYS be elegant, professional, and persuasive, suited for a high-end menswear brand named Gents Clothes. Maintain this exact tone regardless of the input. Do not include markdown formatting or asterisks, just plain text in paragraphs.\n\nInput: "${context}"`;
    } else if (type === 'product_details') {
      prompt = `Act as an expert luxury fashion copywriter and product specialist for a menswear brand named Gents Clothes. I will provide a basic product name or description. You need to generate a complete product profile in JSON format ONLY. Do NOT include markdown code block formatting (like \`\`\`json). Return a valid JSON object with the following keys:
      - "description": A highly engaging, elegant, meaningful, and SHORT product description (strictly 2-3 concise sentences maximum).
      - "material": e.g., "100% Premium Egyptian Cotton"
      - "gsm": e.g., "160 GSM" or "N/A" if not applicable
      - "washInstruction": e.g., "Machine wash cold, tumble dry low"
      
      Input: "${context}"`;
    } else if (type === 'seo') {
      prompt = `Act as an SEO expert. Generate a comma-separated list of 10-15 highly relevant, high-traffic SEO keywords and a compelling meta description (under 160 characters) for the following product: "${context}". Format the response clearly as: "Keywords: [your keywords]\n\nMeta Description: [your description]".`;
    } else if (type === 'smart_extract') {
      prompt = `Act as an expert data-entry assistant for an eCommerce store. I will give you a raw, messy block of text containing various product details. Parse it and extract the data into a valid JSON object ONLY. Do NOT include markdown formatting or backticks (e.g. no \`\`\`json). The JSON must have these exact keys (leave as empty string or 0 if missing):
      - "name": String (Product Title)
      - "price": Number (Numeric value only)
      - "category": String (E.g. T-Shirts, Shirts, Panjabis, Pants)
      - "sizes": String (Comma separated, e.g. "S, M, L, XL")
      - "colors": String (Comma separated, e.g. "Black, White, Navy")
      - "description": String (A neat 2-3 sentence summary)
      - "material": String (e.g. "100% Cotton")
      - "gsm": String (e.g. "160 GSM")
      - "washInstruction": String (e.g. "Machine wash cold")
      
      Input text: "${context}"`;
    } else {
      return res.status(400).json({ message: 'Invalid generation type' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate AI content');
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    res.json({ result: generatedText });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ message: error.message || 'Server error during AI generation' });
  }
});

module.exports = router;
