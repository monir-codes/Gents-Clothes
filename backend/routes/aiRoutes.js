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
    
    if (type === 'description') {
      prompt = `Act as an expert luxury fashion copywriter and textile specialist for "রঙবতী" (Ronggoboti) - Bangladesh's premier women's fashion and ethnic couture house.
I will provide you with a product name, specifications, or messy raw supplier notes.
Write an informative, highly detailed, and enticing luxury product description (2 short paragraphs).

Guidelines:
1. Paragraph 1 (Aesthetics & Craftsmanship): Describe the exact fabric texture, weave (e.g. Katan, Jamdani, Pure Muslin, Georgette, Organza, Lawn Cotton), intricate embroidery/zari motifs, and color brilliance.
2. Paragraph 2 (Details & Occasion): Mention garment drape, comfort, matching pieces (e.g. Blouse piece, Chiffon/Silk Dupatta), suitable occasions (Weddings, Eid, Festive, Parties, Formal, Casual Elegance), and styling advice.
Do NOT write vague, generic fluff. Base details on the specific garment type and textile mentioned. Do NOT wrap in markdown asterisks.

Input: "${context}"`;

    } else if (type === 'product_details') {
      prompt = `You are a Senior Fashion Product Specialist for "রঙবতী" (Ronggoboti) - an elite women's fashion brand in Bangladesh.
Given the product name or notes: "${context}", generate a comprehensive, highly accurate luxury product profile in valid JSON format ONLY.

Categories must be one of:
- "Sarees"
- "Jamdani Sarees"
- "Katan & Silk Sarees"
- "Cotton & Handloom Sarees"
- "Salwar Kameez & Three Piece"
- "Unstitched Three Piece"
- "Readymade Suits & Boutique Sets"
- "Kurtis & Tunics"
- "Lehengas & Bridal Wear"
- "Gowns & Anarkali"
- "Modest Wear & Abaya"
- "Borka & Hijab Collection"
- "Co-ord Sets"
- "Western Wear & Tops"
- "Shawls & Winter Wear"
- "Jewellery & Accessories"

Return a valid JSON object with these EXACT keys:
{
  "description": "An informative, elegant 2-paragraph luxury description highlighting fabric weave, artistry, drape, and occasion suitability.",
  "category": "Pick the most accurate category from the list above",
  "sizes": "Accurate sizing for the garment (e.g. for Sarees: '12 Haat with Unstitched Blouse Piece'; for Unstitched 3-Piece: 'Unstitched (Free Size)'; for Stitched/Kurti: '36, 38, 40, 42, 44'; for Abaya: '52, 54, 56'; for Co-ords: 'S, M, L, XL')",
  "material": "Specific luxury fabric name (e.g. 'Pure Katan Silk with Zari', '84 Count Pure Combed Cotton', 'Premium Dubai Cherry Georgette', 'Dhakai Muslin', 'Organza with Resham Thread', 'Pure Viscose Silk')",
  "gsm": "Fabric count/density (e.g. '84 Count Weave', '140 GSM Lightweight', 'Heavy Bridal Weave', 'N/A')",
  "washInstruction": "Appropriate garment care (e.g. 'Dry clean only to protect zari luster', 'Gentle cold hand wash with mild detergent, dry in shade')"
}

Do NOT wrap in markdown backticks or commentary. Return pure JSON only.`;

    } else if (type === 'seo') {
      prompt = `Act as an eCommerce SEO specialist for fashion brand "রঙবতী" (Ronggoboti - https://www.ronggoboti.shop).
Generate 10-15 high-converting, popular SEO keywords (mix of English and Bengali high-intent terms) and an irresistible meta description (under 160 characters) for: "${context}".
Format the response clearly as:
Keywords: [comma-separated keywords]

Meta Description: [compelling meta description]`;

    } else if (type === 'smart_extract') {
      prompt = `You are an elite AI Data-Entry specialist for "রঙবতী" (Ronggoboti - https://www.ronggoboti.shop) - a premier luxury women's fashion and lifestyle brand in Bangladesh.

The user will provide messy, unorganized raw product text (could be in Bengali, English, Banglish, WhatsApp message, Facebook live sale post, invoice note, with emojis, prices, fabric notes, etc.).

Carefully parse all details and extract them into a clean, valid JSON object with the following fields:

{
  "name": "Clean, polished luxury product title in English or Bengali (e.g. 'Royal Crimson Zari Embroidered Pure Katan Saree', 'Luxury Embroidered Lawn 3-Piece Salwar Kameez', 'Dubai Cherry Premium Front-Open Abaya with Matching Hijab')",
  "price": Numeric value only for current selling price (e.g. 3500). Remove ৳, Tk, /- symbols,
  "oldPrice": Numeric value only if previous/regular/discount price is mentioned (e.g. 4200), else null,
  "category": "Sarees" | "Jamdani Sarees" | "Katan & Silk Sarees" | "Cotton & Handloom Sarees" | "Salwar Kameez & Three Piece" | "Unstitched Three Piece" | "Readymade Suits & Boutique Sets" | "Kurtis & Tunics" | "Lehengas & Bridal Wear" | "Gowns & Anarkali" | "Modest Wear & Abaya" | "Borka & Hijab Collection" | "Co-ord Sets" | "Western Wear & Tops" | "Shawls & Winter Wear" | "Jewellery & Accessories",
  "sizes": "Garment-intelligent sizing:
            - For Sarees: Extract saree length & blouse piece info (e.g. '12 Haat with Unstitched Blouse Piece', '12 Haat (Free Size)', '14 Haat with Blouse Piece') - NEVER default to S/M/L for Sarees!
            - For Unstitched Three Piece / Dress Material: 'Unstitched (Free Size)' or fabric length details (e.g. 'Kamiz 3 yds, Salwar 2.5 yds, Dupatta 2.5 yds').
            - For Readymade Salwar Kameez / Kurtis / Gowns: '36, 38, 40, 42, 44' or 'S, M, L, XL, XXL'.
            - For Abayas / Modest Wear: '52, 54, 56' or '52, 54, 56, 58'.
            - For Western / Co-ords: 'S, M, L, XL' or 'Free Size'.
            - For Jewelry: 'Free Size' or 'Adjustable'.",
  "colors": "Comma-separated clean color names in English (e.g. 'Crimson Maroon, Antique Gold, Forest Green')",
  "description": "An informative, rich, and articulate 2-paragraph luxury description detailing the fabric weave, embroidery/craftsmanship, matching pieces, comfort, drape, and occasion styling advice.",
  "material": "Primary fabric/fabric blend (e.g. 'Pure Katan Silk', '84 Count Pure Cotton', 'Dubai Cherry Georgette', 'Pure Muslin', 'Organza with Zari', 'Linen Blend')",
  "gsm": "Fabric count/density/GSM if mentioned (e.g. '84 Count', '140 GSM', 'Heavy Bridal Weave', 'Lightweight', 'N/A')",
  "washInstruction": "Garment care instructions (e.g. 'Dry clean recommended to preserve zari sheen', 'Gentle hand wash in cold water, do not bleach', 'Dry clean only')",
  "sku": "Existing SKU if mentioned, or auto-generate a sleek SKU like RGB-SAR-101, RGB-3P-202, RGB-KUR-303, RGB-ABY-404"
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
