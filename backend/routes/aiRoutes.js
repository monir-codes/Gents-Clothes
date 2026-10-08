const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();

// Comprehensive list of Women's Fashion categories
const WOMEN_CATEGORIES = [
  "Two Piece Sets",
  "Three Piece Salwar Kameez",
  "Unstitched Three Piece",
  "Readymade Stitched Suits",
  "Pakistani Lawn & Silk Suits",
  "Indian Boutique Suits",
  "Sarees",
  "Jamdani Sarees",
  "Katan & Silk Sarees",
  "Cotton & Handloom Sarees",
  "Georgette & Chiffon Sarees",
  "Organza & Tissue Sarees",
  "Muslin & Linen Sarees",
  "Tangail & Monipuri Sarees",
  "Bridal & Party Sarees",
  "Single Kurtis",
  "Short Kurtis & Fusion Tops",
  "Long & A-Line Kurtis",
  "Frock & Anarkali Kurtis",
  "Casual Tops & Shirts",
  "Tunics & Kaftans",
  "Lehengas & Bridal Wear",
  "Party Lehengas",
  "Gowns & Anarkali",
  "Maxi & Western Gowns",
  "Modest Wear & Abaya",
  "Dubai Cherry Abayas",
  "Front-Open & Kimono Abayas",
  "Borka & Modest Sets",
  "Hijabs, Dupattas & Khimar",
  "Co-ord Sets",
  "Western Wear & Jumpsuits",
  "Nightwear & Loungewear",
  "Palazzos & Culottes",
  "Cigarette & Trousers",
  "Dhoti & Salwar Bottoms",
  "Skirts & Ghagras",
  "Shawls & Pashmina",
  "Winter Jackets & Shrugs",
  "Dupattas & Stoles",
  "Jewellery & Accessories"
];

// Helper to convert Bengali digits to Western digits
const convertBnToEnDigits = (str) => {
  if (!str) return '';
  const bnToEnMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
  return String(str).replace(/[০-৯]/g, d => bnToEnMap[d] || d);
};

// Helper to safely extract JSON from AI response text
const extractJsonObject = (rawText) => {
  if (!rawText) return null;
  try {
    let cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      cleaned = cleaned.substring(startIdx, endIdx + 1);
    }
    
    // Remove trailing commas before closing braces/brackets
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

    return JSON.parse(cleaned);
  } catch (err) {
    // Fallback: try removing unescaped newlines inside strings
    try {
      let sanitized = rawText
        .replace(/```(?:json)?/gi, '')
        .replace(/```/g, '')
        .trim();
      const start = sanitized.indexOf('{');
      const end = sanitized.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        sanitized = sanitized.substring(start, end + 1);
        sanitized = sanitized.replace(/\r?\n/g, ' ');
        return JSON.parse(sanitized);
      }
    } catch (e2) {
      console.error('Failed to parse AI JSON:', err.message, e2.message);
    }
    return null;
  }
};

// Helper to call Gemini with active modern model fallbacks
const callGemini = async (prompt, apiKey, isJson = false) => {
  const models = [
    'gemini-2.5-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro',
    'gemini-flash-lite-latest'
  ];
  
  let lastError = null;

  for (const model of models) {
    try {
      const generationConfig = {
        temperature: 0.2,
        topP: 0.95
      };

      if (isJson) {
        generationConfig.responseMimeType = 'application/json';
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || `Failed with status ${response.status}`);
      }

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (generatedText) {
        return generatedText;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Gemini model ${model} failed, trying fallback...`, err.message);
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content');
};

// Generate Content with Gemini AI
router.post('/generate', async (req, res) => {
  try {
    const { type, context } = req.body;
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key is not configured in backend' });
    }

    if (!context || !type) {
      return res.status(400).json({ message: 'Type and context are required' });
    }

    let prompt = '';
    let isJsonMode = false;
    
    if (type === 'smart_extract' || type === 'product_details') {
      isJsonMode = true;
      prompt = `You are the Master AI eCommerce Data Specialist for "রঙবতী" (Ronggoboti - https://www.ronggoboti.shop) - Bangladesh's premier luxury women's fashion and couture brand.

The user will provide unstructured, raw product notes or vendor text. It may be in BENGALI (বাংলা), BANGLISH, or ENGLISH (containing prices, measurements, color names, fabric specs, wash instructions, etc.).

YOUR TASK:
Extract and translate EVERY detail into CLEAN, PROFESSIONAL, HIGH-END ENGLISH.

ALLOWED CATEGORIES (Pick the single closest match):
${WOMEN_CATEGORIES.map(c => `"${c}"`).join(', ')}

OUTPUT A VALID JSON OBJECT WITH THESE EXACT KEYS:
{
  "name": "Luxury English product title (e.g. 'Royal Crimson Red Handloom Dhakai Jamdani Saree', 'Designer Embroidered Lawn 2-Piece Kurti Set', 'Pakistani Luxury Embroidered Chiffon 3-Piece Salwar Kameez', 'Pure Dubai Cherry Silk Front-Open Abaya with Matching Hijab')",
  "price": Numeric selling price as integer or float (e.g. 3500). Digits only without currency symbols,
  "oldPrice": Numeric previous/regular price for discount badge if mentioned (e.g. 4200), else null,
  "category": "One of the allowed categories listed above",
  "sizes": "Garment-appropriate sizing in English:
            - Sarees: '12 Haat with Unstitched Blouse Piece', '12 Haat (Free Size)', '14 Haat with Blouse Piece' (NEVER use S/M/L for Sarees)
            - 2-Piece & 3-Piece: 'Unstitched (Free Size)', '36, 38, 40, 42', '38, 40, 42, 44, 46', or 'S, M, L, XL'
            - Kurtis & Tops: '36, 38, 40, 42, 44' or 'S, M, L, XL, XXL'
            - Abayas & Modest Wear: '52, 54, 56' or '52, 54, 56, 58'
            - Lehengas & Gowns: 'Semi-Stitched (Free Size)' or 'Custom Fit (36-44)'
            - Western/Co-ords: 'S, M, L, XL' or 'Free Size'",
  "colors": "Clean comma-separated English color names (e.g. 'Crimson Red, Antique Gold, Forest Green')",
  "material": "Specific English luxury textile name (e.g. '84 Count Pure Combed Cotton', 'Pure Katan Silk with Zari', 'Dubai Cherry Georgette Silk', 'Embroidered Lawn with Chiffon Dupatta')",
  "gsm": "Fabric count/density (e.g. '84 Count Fine Handloom', '140 GSM Lightweight', 'Heavy Festive Weave', 'N/A')",
  "washInstruction": "Garment care instruction in English (e.g. 'Dry clean recommended', 'Gentle cold hand wash, dry in shade', 'Dry clean only')",
  "description": "An elegant, engaging 2-paragraph luxury English product description detailing craftsmanship, fabric comfort, matching pieces, and styling/occasion advice.",
  "sku": "Short clean SKU code (e.g. 'RGB-JAM-101', 'RGB-2PC-202', 'RGB-3PC-303', 'RGB-SAR-404', 'RGB-ABY-505')"
}

Input Text:
"""${context}"""`;

    } else if (type === 'description') {
      prompt = `Act as an elite luxury fashion copywriter for "রঙবতী" (Ronggoboti - https://www.ronggoboti.shop).
Write an irresistible, premium 2-paragraph product description in English for the following garment details:
"${context}"
Highlight the fabric weave quality, comfort, elegant silhouette, embellishments, matching accessories, and ideal occasions (Eid, Weddings, Parties, Casual Sophistication).`;

    } else if (type === 'seo') {
      prompt = `Act as an eCommerce SEO specialist for fashion brand "রঙবতী" (Ronggoboti - https://www.ronggoboti.shop).
Generate 10-15 high-converting, popular SEO keywords (mix of English and Bengali high-intent terms) and an irresistible meta description (under 160 characters) for: "${context}".
Format the response clearly as:
Keywords: [comma-separated keywords]

Meta Description: [compelling meta description]`;

    } else if (type === 'marketing') {
      prompt = `Act as a senior fashion marketing strategist for "রঙবতী" (Ronggoboti).
Create a high-converting Facebook/Instagram social media caption with emojis, compelling hooks, promotional hashtags, and a clear Call to Action (Shop Online at https://www.ronggoboti.shop) for: "${context}".`;

    } else {
      return res.status(400).json({ message: 'Invalid generation type' });
    }

    const generatedText = await callGemini(prompt, apiKey, isJsonMode);
    const parsedData = isJsonMode ? extractJsonObject(generatedText) : null;
    
    res.json({ 
      success: true,
      result: generatedText,
      data: parsedData 
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error during AI generation' 
    });
  }
});

module.exports = router;

