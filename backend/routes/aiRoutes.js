const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();

// Helper to safely extract JSON from AI response text
const extractJsonObject = (rawText) => {
  if (!rawText) return null;
  try {
    // 1. Clean markdown code blocks
    let cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    
    // 2. Find outermost JSON object
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      cleaned = cleaned.substring(startIdx, endIdx + 1);
    }
    
    // 3. Remove trailing commas before } or ]
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse AI JSON:', err.message);
    return null;
  }
};

// Helper to call Gemini with model fallbacks
const callGemini = async (prompt, apiKey) => {
  const models = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro'];
  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.95
          }
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
    
    if (type === 'description') {
      prompt = `Act as an expert luxury fashion copywriter for "রঙবতী" (Ronggoboti) - a premium South Asian fashion brand. 
I will provide you with a product name, specifications, or messy raw notes. 
Your task is to write a captivating, elegant, and persuasive 2-4 sentence product description in English.
Highlight the fabric quality, artistry (e.g. zari, embroidery, handloom), drape, occasion suitability (festive, wedding, party, casual luxury), and styling appeal.
The tone MUST be sophisticated, luxury-oriented, and enticing. Do NOT include markdown asterisks or bullet points; return clean flowing prose.

Input: "${context}"`;

    } else if (type === 'product_details') {
      prompt = `You are a Senior Product Specialist and Fashion Copywriter for "রঙবতী" (Ronggoboti) - a luxury South Asian women's and ethnic apparel brand.
Given the product name or notes: "${context}", generate a complete luxury product profile in JSON format ONLY.

Return a valid JSON object with these EXACT keys:
{
  "description": "A captivating, elegant 2-3 sentence luxury product description focusing on craftsmanship and beauty.",
  "category": "Sarees" | "Salwar Kameez" | "Kurtis & Tunics" | "Lehengas & Gowns" | "Western Wear" | "Modest Wear" | "Co-ord Sets" | "Jewelry & Accessories",
  "sizes": "Appropriate sizing (e.g. for Sarees: '12 Haat with Blouse Piece'; for 3-Piece: 'Unstitched (Free Size)' or '36, 38, 40, 42, 44'; for Kurti: '36, 38, 40, 42, 44'; for Abaya: '52, 54, 56'; for Western: 'S, M, L, XL')",
  "material": "e.g. Pure Katan Silk / 84 Count Cotton / Dubai Cherry / Pure Muslin / Heavy Georgette",
  "gsm": "e.g. 84 Count / 140 GSM / Lightweight / Heavy / N/A",
  "washInstruction": "e.g. Dry clean recommended / Gentle cold hand wash"
}

Do NOT wrap in markdown backticks or commentary. Return pure JSON only.`;

    } else if (type === 'seo') {
      prompt = `Act as an eCommerce SEO specialist for fashion brand "রঙবতী" (Ronggoboti).
Generate 10-15 high-converting, popular SEO keywords and an irresistible meta description (under 160 characters) for: "${context}".
Format the response clearly as:
Keywords: [comma-separated keywords]

Meta Description: [compelling meta description]`;

    } else if (type === 'smart_extract') {
      prompt = `You are an elite AI Data-Entry specialist for "রঙবতী" (Ronggoboti) - a high-end fashion and lifestyle brand in Bangladesh specializing in Sarees, Salwar Kameez / Three-Pieces, Kurtis, Lehengas, Modest Wear / Abayas, Co-ords, and Western Wear.

The user will provide messy, unorganized raw product text (could be in Bengali, English, Banglish, WhatsApp message, Facebook live sale post, invoice note, with emojis, prices, fabric notes, etc.).

Carefully parse all details and extract them into a clean, valid JSON object with the following fields:

{
  "name": "Clean, polished luxury product title in English or Bengali as appropriate (e.g. 'Royal Blue Zari Work Pure Katan Silk Saree', 'Embroidered Digital Print Lawn 3-Piece Salwar Kameez', 'Dubai Cherry Premium Abaya with Hijab')",
  "price": Numeric value only for current price (e.g. 3500). Remove ৳, Tk, /- symbols,
  "oldPrice": Numeric value only if previous/regular/discount price is mentioned (e.g. 4200), else null,
  "category": "Sarees" | "Salwar Kameez" | "Kurtis & Tunics" | "Lehengas & Gowns" | "Western Wear" | "Modest Wear" | "Co-ord Sets" | "Jewelry & Accessories",
  "sizes": "Garment-intelligent sizes:
            - For Sarees: Extract saree length & blouse piece info (e.g. '12 Haat with Blouse Piece', '12 Haat (Free Size)', '14 Haat with Unstitched Blouse Piece') - NEVER default to S/M/L for Sarees!
            - For Unstitched / 3-Piece / 2-Piece: 'Unstitched (Free Size)' or fabric length details.
            - For Readymade Salwar Kameez / Kurtis / Gowns: '36, 38, 40, 42, 44' or 'S, M, L, XL, XXL'.
            - For Abayas / Modest Wear: '52, 54, 56' or '52, 54, 56, 58'.
            - For Western / Co-ords: 'S, M, L, XL' or 'Free Size'.
            - For Jewelry: 'Free Size' or 'Adjustable'.",
  "colors": "Comma-separated clean color names in English (e.g. 'Maroon, Antique Gold, Royal Blue')",
  "description": "A rich, persuasive 2-3 sentence luxury product description highlighting elegance, fabric feel, and craftsmanship.",
  "material": "Primary fabric/fabric blend (e.g. 'Pure Katan Silk', '84 Count Pure Cotton', 'Dubai Cherry Georgette', 'Pure Muslin', 'Organza with Zari', 'Linen')",
  "gsm": "Fabric count/density/GSM if mentioned (e.g. '84 Count', '140 GSM', 'Heavy Weight', 'Lightweight', 'N/A')",
  "washInstruction": "Garment care instructions (e.g. 'Dry clean recommended', 'Gentle hand wash in cold water, do not bleach', 'Machine wash cold delicate')",
  "sku": "Existing SKU if mentioned, or auto-generate a sleek SKU like RGB-SAR-01, RGB-SK-02, RGB-KUR-03"
}

Do NOT wrap the JSON in backticks or markdown fences. Output strictly the JSON object.

Input Text:
"""${context}"""`;

    } else {
      return res.status(400).json({ message: 'Invalid generation type' });
    }

    const generatedText = await callGemini(prompt, apiKey);
    const parsedData = extractJsonObject(generatedText);
    
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
