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
    
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse AI JSON:', err.message);
    return null;
  }
};

// Helper to call Gemini with model fallbacks
const callGemini = async (prompt, apiKey) => {
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-flash-latest'];
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
            temperature: 0.25,
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
    
    if (type === 'smart_extract' || type === 'product_details') {
      prompt = `You are the Master AI eCommerce Data Specialist for "রঙবতী" (Ronggoboti - https://www.ronggoboti.shop) - Bangladesh's elite luxury women's fashion and couture brand.

The user will provide messy, raw, unstructured product notes or supplier messages. The input may be in BENGALI (বাংলা), BANGLISH, or ENGLISH (with prices, emojis, garment specs, color names, wash instructions, fabric count, etc.).

YOUR GOAL:
Translate and structure ALL details into CLEAN, HIGH-END, PROFESSIONAL ENGLISH across ALL fields of our product database.

CATEGORY SELECTION (Must pick the SINGLE most accurate category from this EXACT list):
${WOMEN_CATEGORIES.map(c => `"${c}"`).join(', ')}

OUTPUT FORMAT:
Return a valid JSON object ONLY, with these EXACT keys:
{
  "name": "Luxury English product title (e.g. 'Royal Crimson Red Pure Handloom Dhakai Jamdani Saree', 'Designer Embroidered Lawn 2-Piece Kurti & Dupatta Set', 'Pakistani Luxury Embroidered Chiffon 3-Piece Salwar Kameez', 'Pure Dubai Cherry Silk Front-Open Abaya with Matching Hijab')",
  "price": Numeric value for selling price (e.g. 3500). Number only without ৳, Tk, /- symbols,
  "oldPrice": Numeric value for regular/previous price if a discount was mentioned (e.g. 4200), else null,
  "category": "Pick the most accurate matching category from the list above",
  "sizes": "Garment-intelligent sizing string in English:
            - For Sarees: Saree length & blouse piece info (e.g. '12 Haat with Unstitched Blouse Piece', '12 Haat (Free Size)', '14 Haat with Blouse Piece') - NEVER write S/M/L for Sarees!
            - For Two Piece / 2-Piece: 'Unstitched (Free Size)' or '36, 38, 40, 42' or 'S, M, L, XL'.
            - For Three Piece / Unstitched Salwar Kameez: 'Unstitched (Free Size)' or 'Kamiz 3 yds, Salwar 2.5 yds, Dupatta 2.5 yds' or '36, 38, 40, 42, 44'.
            - For Kurtis / Tops: '36, 38, 40, 42, 44' or 'S, M, L, XL, XXL' or 'Free Size'.
            - For Abayas / Modest Wear: '52, 54, 56' or '52, 54, 56, 58'.
            - For Lehengas / Gowns: 'Semi-Stitched (Free Size)' or 'Ready-to-Wear (38, 40, 42)'.
            - For Co-ord Sets: 'S, M, L, XL' or 'Free Size'.
            - For Bottoms / Pants: 'Free Size (Stretchable)' or '28, 30, 32, 34, 36'.
            - For Accessories / Jewellery / Shawls: 'Free Size' or 'Adjustable' or 'Standard Size'.",
  "colors": "Clean comma-separated English color names (e.g. 'Crimson Red, Antique Gold, Emerald Green')",
  "material": "Specific luxury English textile name (e.g. '84 Count Pure Combed Cotton', 'Pure Katan Silk with Golden Zari', 'Premium Dubai Cherry Georgette', 'Luxury Embroidered Lawn with Pure Chiffon Dupatta', 'Pure Dhakai Muslin', 'Organza Silk with Resham Thread')",
  "gsm": "Fabric count/density (e.g. '84 Count Fine Handloom', '140 GSM Lightweight', 'Heavy Festive Weave', 'N/A')",
  "washInstruction": "Garment care instruction in English (e.g. 'Dry clean recommended to preserve delicate zari work', 'Gentle cold hand wash with mild liquid detergent, dry in shade', 'Dry clean only')",
  "description": "An informative, elegant, 2-paragraph luxury English product description detailing the fabric weave, embroidery craftsmanship, drape comfort, matching pieces, and ideal styling/occasion advice (Festivals, Weddings, Formal, Casual Chic).",
  "sku": "Generate a clean SKU code based on category e.g. RGB-JAM-350, RGB-2PC-120, RGB-3PC-450, RGB-SAR-890, RGB-ABY-230"
}

Do NOT wrap the JSON in markdown codeblocks (no \`\`\`json). Output pure JSON only.

Input Text:
"""${context}"""`;

    } else if (type === 'seo') {
      prompt = `Act as an eCommerce SEO specialist for fashion brand "রঙবতী" (Ronggoboti - https://www.ronggoboti.shop).
Generate 10-15 high-converting, popular SEO keywords (mix of English and Bengali high-intent terms) and an irresistible meta description (under 160 characters) for: "${context}".
Format the response clearly as:
Keywords: [comma-separated keywords]

Meta Description: [compelling meta description]`;

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
