/**
 * Fashion Color Palette Map for Ronggoboti
 * Maps RGB color centroids to prestigious fashion color names and hex values
 */
export const FASHION_COLOR_PALETTE = [
  { name: 'Maroon', nameBn: 'মেরুন', hex: '#5e0f2b', rgb: [94, 15, 43] },
  { name: 'Crimson Red', nameBn: 'ক্রিমসন লাল', hex: '#991b1b', rgb: [153, 27, 27] },
  { name: 'Ruby Red', nameBn: 'লাল', hex: '#dc2626', rgb: [220, 38, 38] },
  { name: 'Wine / Burgundy', nameBn: 'বার্গান্ডি', hex: '#800020', rgb: [128, 0, 32] },
  { name: 'Emerald Green', nameBn: 'পান্না সবুজ', hex: '#047857', rgb: [4, 120, 87] },
  { name: 'Bottle Green', nameBn: 'বটল গ্রিন', hex: '#064e3b', rgb: [6, 78, 59] },
  { name: 'Olive Green', nameBn: 'অলিভ গ্রিন', hex: '#4d7c0f', rgb: [77, 124, 15] },
  { name: 'Teal Blue', nameBn: 'টিল ব্লু', hex: '#0f766e', rgb: [15, 118, 110] },
  { name: 'Royal Blue', nameBn: 'রয়্যাল ব্লু', hex: '#1d4ed8', rgb: [29, 78, 216] },
  { name: 'Navy Blue', nameBn: 'নেভি ব্লু', hex: '#1e3a8a', rgb: [30, 58, 138] },
  { name: 'Sky Blue', nameBn: 'আকাশি নীল', hex: '#0284c7', rgb: [2, 132, 199] },
  { name: 'Mustard Yellow', nameBn: 'সরিষা হলুদ', hex: '#d97706', rgb: [217, 119, 6] },
  { name: 'Golden Yellow', nameBn: 'সোনালী', hex: '#ca8a04', rgb: [202, 138, 4] },
  { name: 'Blush Pink', nameBn: 'গোলাপি', hex: '#f43f5e', rgb: [244, 63, 94] },
  { name: 'Pastel Pink', nameBn: 'হালকা গোলাপি', hex: '#f472b6', rgb: [244, 114, 182] },
  { name: 'Magenta / Rani Pink', nameBn: 'ম্যাজেন্টা', hex: '#c026d3', rgb: [192, 38, 211] },
  { name: 'Purple / Violet', nameBn: 'বেগুনী', hex: '#7e22ce', rgb: [126, 34, 206] },
  { name: 'Lavender', nameBn: 'ল্যাভেন্ডার', hex: '#c084fc', rgb: [192, 132, 252] },
  { name: 'Peach / Coral', nameBn: 'পীচ', hex: '#fb923c', rgb: [251, 146, 60] },
  { name: 'Beige / Cream', nameBn: 'ক্রিম / বেইজ', hex: '#fef08a', rgb: [254, 240, 138] },
  { name: 'Off-White / Ivory', nameBn: 'আইভরি / অফ-হোয়াইট', hex: '#f8fafc', rgb: [248, 250, 252] },
  { name: 'White', nameBn: 'সাদা', hex: '#ffffff', rgb: [255, 255, 255] },
  { name: 'Jet Black', nameBn: 'কালো', hex: '#0f172a', rgb: [15, 23, 42] },
  { name: 'Chocolate Brown', nameBn: 'বাদামী', hex: '#78350f', rgb: [120, 53, 15] },
  { name: 'Slate Grey', nameBn: 'ধূসর', hex: '#64748b', rgb: [100, 116, 139] }
];

/**
 * Calculates Euclidean distance between two RGB colors
 */
const getColorDistance = (rgb1, rgb2) => {
  const rDiff = rgb1[0] - rgb2[0];
  const gDiff = rgb1[1] - rgb2[1];
  const bDiff = rgb1[2] - rgb2[2];
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};

/**
 * Finds the closest prestigious fashion color for an RGB value
 */
export const findClosestFashionColor = (r, g, b) => {
  let closest = FASHION_COLOR_PALETTE[0];
  let minDistance = Infinity;

  for (const item of FASHION_COLOR_PALETTE) {
    const dist = getColorDistance([r, g, b], item.rgb);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return closest;
};

/**
 * Maps any color string (name, hex, or bengali) to a displayable CSS hex color
 */
export const getColorHex = (colorName) => {
  if (!colorName || typeof colorName !== 'string') return '#5e0f2b';
  const clean = colorName.trim().toLowerCase();

  if (clean.startsWith('#') || clean.startsWith('rgb')) return colorName.trim();

  // Keyword lookup in palette
  for (const item of FASHION_COLOR_PALETTE) {
    if (
      clean.includes(item.name.toLowerCase()) || 
      item.name.toLowerCase().includes(clean) ||
      (item.nameBn && clean.includes(item.nameBn))
    ) {
      return item.hex;
    }
  }

  // Common color aliases
  if (clean.includes('red') || clean.includes('লাল')) return '#dc2626';
  if (clean.includes('maroon') || clean.includes('মেরুন')) return '#5e0f2b';
  if (clean.includes('green') || clean.includes('সবুজ')) return '#047857';
  if (clean.includes('blue') || clean.includes('নীল')) return '#1d4ed8';
  if (clean.includes('navy') || clean.includes('নেভি')) return '#1e3a8a';
  if (clean.includes('yellow') || clean.includes('হলুদ')) return '#ca8a04';
  if (clean.includes('mustard') || clean.includes('সরিষা')) return '#d97706';
  if (clean.includes('pink') || clean.includes('গোলাপি')) return '#f43f5e';
  if (clean.includes('purple') || clean.includes('বেগুনী')) return '#7e22ce';
  if (clean.includes('magenta') || clean.includes('ম্যাজেন্টা')) return '#c026d3';
  if (clean.includes('black') || clean.includes('কালো')) return '#0f172a';
  if (clean.includes('white') || clean.includes('সাদা')) return '#ffffff';
  if (clean.includes('gold') || clean.includes('সোনালী')) return '#ca8a04';
  if (clean.includes('silver') || clean.includes('রূপালী')) return '#94a3b8';
  if (clean.includes('orange') || clean.includes('কমলা')) return '#ea580c';
  if (clean.includes('peach') || clean.includes('পীচ')) return '#fb923c';
  if (clean.includes('teal') || clean.includes('টিল')) return '#0f766e';
  if (clean.includes('olive') || clean.includes('অলিভ')) return '#4d7c0f';
  if (clean.includes('brown') || clean.includes('বাদামী')) return '#78350f';
  if (clean.includes('grey') || clean.includes('ধূসর')) return '#64748b';

  return '#5e0f2b';
};

/**
 * Extracts dominant fashion color from an Image Element, File or URL using HTML5 Canvas
 */
export const extractDominantColorFromImage = (imageSource) => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          const size = 64; // downsample for high performance
          canvas.width = size;
          canvas.height = size;

          ctx.drawImage(img, 0, 0, size, size);
          const imageData = ctx.getImageData(0, 0, size, size).data;

          // Color bucket frequency
          const colorFrequency = {};

          for (let i = 0; i < imageData.length; i += 16) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            if (a < 128) continue; // Skip transparent

            const maxVal = Math.max(r, g, b);
            const minVal = Math.min(r, g, b);
            const saturation = maxVal === 0 ? 0 : (maxVal - minVal) / maxVal;
            const brightness = (r + g + b) / 3;

            const matchedColor = findClosestFashionColor(r, g, b);
            const key = matchedColor.name;

            // Prioritize saturated garment cloth over studio white or grey backgrounds
            const weight = saturation > 0.18 ? 4 : (brightness > 240 ? 0.2 : 1);
            colorFrequency[key] = (colorFrequency[key] || 0) + weight;
          }

          // Find dominant color
          let bestColor = null;
          let maxCount = -1;

          for (const [colorName, count] of Object.entries(colorFrequency)) {
            if (count > maxCount) {
              maxCount = count;
              bestColor = colorName;
            }
          }

          const result = FASHION_COLOR_PALETTE.find(c => c.name === bestColor) || FASHION_COLOR_PALETTE[0];
          resolve(result);
        } catch (canvasErr) {
          console.warn('Canvas color extraction error:', canvasErr);
          resolve(null);
        }
      };

      img.onerror = () => {
        resolve(null);
      };

      if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else if (imageSource instanceof File || imageSource instanceof Blob) {
        img.src = URL.createObjectURL(imageSource);
      } else {
        resolve(null);
      }
    } catch (err) {
      console.warn('Image color extraction failed:', err);
      resolve(null);
    }
  });
};

/**
 * Extracts distinct dominant colors from multiple images
 */
export const extractColorsFromMultipleImages = async (imageSources) => {
  if (!Array.isArray(imageSources) || imageSources.length === 0) return [];

  const detectedNames = new Set();
  const detectedList = [];

  for (const src of imageSources) {
    if (!src) continue;
    const colorObj = await extractDominantColorFromImage(src);
    if (colorObj && !detectedNames.has(colorObj.name)) {
      detectedNames.add(colorObj.name);
      detectedList.push(colorObj);
    }
  }

  return detectedList;
};
