import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';
import { 
  Plus, Edit, Trash2, X, Upload, Sparkles, Search, 
  RefreshCw, Link as LinkIcon, Image as ImageIcon,
  CheckCircle2, ArrowRight, Wand2, Palette
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAuthStore from '../../store/useAuthStore';
import { extractColorsFromMultipleImages, extractDominantColorFromImage } from '../../utils/colorDetector';

// ImgBB API Key
const IMGBB_API_KEY = "affe71bc1ff1277c7d83bc8e9dfe4c3c";

// Comprehensive Women's Fashion Categories in Bangladesh & South Asia
const CATEGORIES = [
  // 2-Piece & 3-Piece Suits
  "Two Piece Sets",
  "Three Piece Salwar Kameez",
  "Unstitched Three Piece",
  "Readymade Stitched Suits",
  "Pakistani Lawn & Silk Suits",
  "Indian Boutique Suits",
  
  // Sarees
  "Sarees",
  "Jamdani Sarees",
  "Katan & Silk Sarees",
  "Cotton & Handloom Sarees",
  "Georgette & Chiffon Sarees",
  "Organza & Tissue Sarees",
  "Muslin & Linen Sarees",
  "Tangail & Monipuri Sarees",
  "Bridal & Party Sarees",

  // Kurtis & Tops
  "Single Kurtis",
  "Short Kurtis & Fusion Tops",
  "Long & A-Line Kurtis",
  "Frock & Anarkali Kurtis",
  "Casual Tops & Shirts",
  "Tunics & Kaftans",

  // Lehengas & Gowns
  "Lehengas & Bridal Wear",
  "Party Lehengas",
  "Gowns & Anarkali",
  "Maxi & Western Gowns",

  // Modest Wear & Abaya
  "Modest Wear & Abaya",
  "Dubai Cherry Abayas",
  "Front-Open & Kimono Abayas",
  "Borka & Modest Sets",
  "Hijabs, Dupattas & Khimar",

  // Co-ords, Western & Nightwear
  "Co-ord Sets",
  "Western Wear & Jumpsuits",
  "Nightwear & Loungewear",

  // Bottoms & Pants
  "Palazzos & Culottes",
  "Cigarette & Trousers",
  "Dhoti & Salwar Bottoms",
  "Skirts & Ghagras",

  // Winter & Accessories
  "Shawls & Pashmina",
  "Winter Jackets & Shrugs",
  "Dupattas & Stoles",
  "Jewellery & Accessories"
];

// Quick Category-Specific Size Presets
const SIZE_PRESETS = {
  "Two Piece Sets": ["Unstitched (Free Size)", "36, 38, 40, 42", "38, 40, 42, 44", "S, M, L, XL", "Free Size"],
  "Three Piece Salwar Kameez": ["Unstitched (Free Size)", "Semi-Stitched", "36, 38, 40, 42, 44", "38, 40, 42, 44, 46", "S, M, L, XL, XXL"],
  "Unstitched Three Piece": ["Unstitched (Free Size)", "Kamiz 3 yds, Salwar 2.5 yds, Orna 2.5 yds", "Kamiz 3.5 yds, Salwar 2.5 yds, Orna 2.5 yds"],
  "Readymade Stitched Suits": ["36, 38, 40, 42, 44", "38, 40, 42, 44, 46", "S, M, L, XL"],
  "Pakistani Lawn & Silk Suits": ["Unstitched (Free Size)", "36, 38, 40, 42, 44", "Semi-Stitched"],
  "Indian Boutique Suits": ["Unstitched (Free Size)", "38, 40, 42, 44", "Semi-Stitched"],
  "Sarees": ["12 Haat with Unstitched Blouse Piece", "12 Haat (Free Size)", "14 Haat with Blouse Piece", "Without Blouse Piece"],
  "Jamdani Sarees": ["12 Haat with Blouse Piece", "12 Haat (Free Size)", "Pure Handloom 12 Haat"],
  "Katan & Silk Sarees": ["12 Haat with Running Blouse Piece", "12 Haat with Contrast Blouse Piece"],
  "Cotton & Handloom Sarees": ["12 Haat (Free Size)", "12 Haat with Blouse Piece"],
  "Georgette & Chiffon Sarees": ["12 Haat with Heavy Embroidered Blouse Piece", "12 Haat (Free Size)"],
  "Organza & Tissue Sarees": ["12 Haat with Designer Blouse Piece"],
  "Muslin & Linen Sarees": ["12 Haat with Running Blouse Piece", "12 Haat (Free Size)"],
  "Tangail & Monipuri Sarees": ["12 Haat (Free Size)", "12 Haat with Blouse Piece"],
  "Bridal & Party Sarees": ["12 Haat with Heavy Embroidered Blouse Piece"],
  "Single Kurtis": ["36, 38, 40, 42, 44", "38, 40, 42", "S, M, L, XL, XXL", "Free Size"],
  "Short Kurtis & Fusion Tops": ["36, 38, 40, 42", "S, M, L, XL", "Free Size"],
  "Long & A-Line Kurtis": ["36, 38, 40, 42, 44", "S, M, L, XL, XXL"],
  "Frock & Anarkali Kurtis": ["36, 38, 40, 42, 44", "Free Size"],
  "Casual Tops & Shirts": ["S, M, L, XL", "XS, S, M, L, XL, XXL", "Free Size"],
  "Tunics & Kaftans": ["Free Size (Standard)", "S, M, L, XL"],
  "Lehengas & Bridal Wear": ["Semi-Stitched (Free Size)", "Custom Stitch (36-44)", "Ready-to-Wear"],
  "Party Lehengas": ["Semi-Stitched (Free Size)", "Ready-to-Wear"],
  "Gowns & Anarkali": ["38, 40, 42, 44", "Semi-Stitched (Free Size)", "Custom Fit"],
  "Maxi & Western Gowns": ["S, M, L, XL", "38, 40, 42, 44", "Free Size"],
  "Modest Wear & Abaya": ["52, 54, 56", "52, 54, 56, 58", "54, 56, 58", "Free Size with Hijab"],
  "Dubai Cherry Abayas": ["52, 54, 56", "52, 54, 56, 58", "Free Size with Matching Hijab"],
  "Front-Open & Kimono Abayas": ["52, 54, 56", "54, 56, 58"],
  "Borka & Modest Sets": ["52, 54, 56", "54, 56, 58", "Free Size (Standard)"],
  "Hijabs, Dupattas & Khimar": ["Standard Free Size", "Long Stole (72 x 30 inch)"],
  "Co-ord Sets": ["S, M, L, XL", "Free Size", "36, 38, 40, 42"],
  "Western Wear & Jumpsuits": ["S, M, L, XL", "XS, S, M, L", "Free Size"],
  "Nightwear & Loungewear": ["Free Size (Comfort Fit)", "M, L, XL, XXL"],
  "Palazzos & Culottes": ["Free Size (Elastic Waist 28-38)", "Length 38 inch", "Length 40 inch"],
  "Cigarette & Trousers": ["28, 30, 32, 34, 36", "M, L, XL, XXL"],
  "Dhoti & Salwar Bottoms": ["Free Size (Standard)"],
  "Skirts & Ghagras": ["Free Size (Adjustable Dori)"],
  "Shawls & Pashmina": ["Standard (Free Size 2.5 yds)", "Long Stole (2.5 yds)"],
  "Winter Jackets & Shrugs": ["S, M, L, XL", "Free Size"],
  "Dupattas & Stoles": ["Standard 2.5 yds", "2.75 yds Extra Long"],
  "Jewellery & Accessories": ["Free Size", "Adjustable", "Standard Size"]
};

// Quick Example Prompts for Magic AI
const MAGIC_EXAMPLES = [
  {
    label: "👗 2-Piece Set (Bangla/Messy)",
    text: "ডিজাইনার এমব্রয়ডারি ২-পিস কটন কুর্তি ও সাথে ম্যাচিং অরনা। জামার কাপড় ৩ গজ, অরনা ২.৫ গজ। সাইজ ৩৮, ৪০, ৪২, ৪৪। রেগুলার প্রাইস ২৩০০ টাকা, ডিসকাউন্ট প্রাইস ১৯৫০ টাকা। কালার নেভি ব্লু ও মাস্টার্ড ইয়েলো। নরম সুতি ফেব্রিক, হ্যান্ড ওয়াশ।"
  },
  {
    label: "👗 3-Piece Salwar Kameez",
    text: "Pakistani Luxury Embroidered Lawn 3-Piece Salwar Kameez with pure chiffon dupatta. Kamiz 3 yards, salwar 2.5 yards, dupatta 2.5 yards. Color: Emerald Green, Pastel Pink. Price 2850 BDT, regular 3400. Delicate cold wash."
  },
  {
    label: "🥻 Dhakai Jamdani Saree",
    text: "লাল ঢাকাই জামদানি শাড়ি ৮৪ কাউন্ট পিওর কটন। সাথে ম্যাচিং আনস্টিচড ব্লাউজ পিস আছে। শাড়ির সাইজ ১২ হাত। দাম ৩৫০০ টাকা, আগের দাম ছিল ৪২০০ টাকা। গোল্ডেন জরির কাজ করা। ড্রাই ওয়াশ করতে হবে।"
  },
  {
    label: "🧕 Dubai Cherry Abaya",
    text: "Premium Dubai Cherry Silk Front Open Abaya with matching Hijab. Available sizes: 52, 54, 56. Colors: Jet Black, Olive Green, Plum. Price 3200 Tk, old price 3800. Dry clean recommended."
  },
  {
    label: "👚 Designer Kurti",
    text: "Hand embroidery pure cotton single kurti. Available chest sizes 38, 40, 42, 44. Price 1450 Tk, previous price 1800 Tk. Gentle wash."
  },
  {
    label: "✨ Ethnic Co-ord Set",
    text: "Printed premium viscose silk 2-piece co-ord set top and palazzo pant. Size S, M, L, XL. Price 2250 Tk. Color: Teal Green, Coral."
  }
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' or 'url'
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const { token } = useAuthStore();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // AI Magic State (Single Top Master Auto-Fill)
  const [magicText, setMagicText] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  const initialFormState = {
    name: '',
    price: '',
    oldPrice: '',
    category: 'Two Piece Sets',
    brand: 'রঙবতী',
    countInStock: 10,
    description: '',
    image: '',
    hoverImage: '',
    images: [],
    sku: '',
    sizes: '',
    colors: '',
    fabricDetails: {
      material: '',
      gsm: '',
      washInstruction: ''
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products?limit=150');
      setProducts(Array.isArray(data?.products) ? data.products : (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFabricDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      fabricDetails: { ...prev.fabricDetails, [name]: value }
    }));
  };

  const handleSizePresetClick = (sizePreset) => {
    setFormData(prev => {
      if (!prev.sizes) return { ...prev, sizes: sizePreset };
      if (prev.sizes.includes(sizePreset)) return prev;
      return { ...prev, sizes: `${prev.sizes}, ${sizePreset}` };
    });
  };

  // Upload single or multiple images to ImgBB
  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    let uploadedUrls = [];

    try {
      for (const file of files) {
        const imgData = new FormData();
        imgData.append('image', file);
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: imgData,
        });
        const data = await response.json();
        if (data.success && data.data?.url) {
          uploadedUrls.push(data.data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => {
          const currentImages = Array.isArray(prev.images) ? prev.images : [];
          const combined = Array.from(new Set([...currentImages, ...uploadedUrls]));
          return {
            ...prev,
            image: prev.image || combined[0] || '',
            hoverImage: prev.hoverImage || combined[1] || '',
            images: combined
          };
        });

        // Automatically extract colors from newly uploaded images in background
        extractColorsFromMultipleImages(uploadedUrls).then(detectedColors => {
          if (detectedColors && detectedColors.length > 0) {
            const newNames = detectedColors.map(c => c.name);
            setFormData(prev => {
              const currentColors = typeof prev.colors === 'string'
                ? prev.colors.split(',').map(c => c.trim()).filter(Boolean)
                : (Array.isArray(prev.colors) ? prev.colors : []);
              const merged = Array.from(new Set([...currentColors, ...newNames]));
              return {
                ...prev,
                colors: merged.join(', ')
              };
            });
          }
        });

        Swal.fire({ 
          title: 'Images Uploaded!', 
          text: `Added ${uploadedUrls.length} photos. Auto-detecting colors...`, 
          icon: 'success', 
          toast: true, 
          position: 'top-end', 
          showConfirmButton: false, 
          timer: 2500 
        });
      }
    } catch (error) {
      console.error("Upload error", error);
      Swal.fire('Upload Error', 'Image upload service failed. You can paste direct image URLs instead.', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  // Add image URL manually
  const handleAddImageUrl = async () => {
    if (!newImageUrl.trim()) return;
    const url = newImageUrl.trim();
    setFormData(prev => {
      const mainImg = prev.image || url;
      const hoverImg = prev.hoverImage || (prev.image && prev.image !== url ? url : '');
      const currentImages = Array.isArray(prev.images) ? prev.images : [];
      return {
        ...prev,
        image: mainImg,
        hoverImage: hoverImg,
        images: Array.from(new Set([...currentImages, url]))
      };
    });

    // Auto extract color from URL
    extractDominantColorFromImage(url).then(detected => {
      if (detected) {
        setFormData(prev => {
          const currentColors = typeof prev.colors === 'string'
            ? prev.colors.split(',').map(c => c.trim()).filter(Boolean)
            : (Array.isArray(prev.colors) ? prev.colors : []);
          const merged = Array.from(new Set([...currentColors, detected.name]));
          return {
            ...prev,
            colors: merged.join(', ')
          };
        });
      }
    });

    setNewImageUrl('');
  };

  // Dedicated Auto-Detect Colors from all Gallery Images
  const handleAutoDetectColors = async () => {
    const allGalleryImgs = Array.from(new Set([
      formData.image,
      formData.hoverImage,
      ...(Array.isArray(formData.images) ? formData.images : [])
    ])).filter(Boolean);

    if (allGalleryImgs.length === 0) {
      Swal.fire('No Images', 'Please upload or add product photos first.', 'info');
      return;
    }

    try {
      const detected = await extractColorsFromMultipleImages(allGalleryImgs);
      if (detected && detected.length > 0) {
        const detectedNames = detected.map(c => c.name);
        setFormData(prev => {
          const currentColors = typeof prev.colors === 'string'
            ? prev.colors.split(',').map(c => c.trim()).filter(Boolean)
            : (Array.isArray(prev.colors) ? prev.colors : []);
          const merged = Array.from(new Set([...currentColors, ...detectedNames]));
          return {
            ...prev,
            colors: merged.join(', ')
          };
        });

        Swal.fire({
          title: '🎨 Colors Auto-Detected!',
          text: `Added colors: ${detectedNames.join(', ')}`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        Swal.fire('Color Detection', 'Could not extract distinct colors. You can type them manually.', 'info');
      }
    } catch (err) {
      console.error('Color scan error:', err);
    }
  };

  // Set specific image as main
  const setAsMainImage = (url) => {
    setFormData(prev => ({
      ...prev,
      image: url
    }));
  };

  // Set specific image as hover
  const setAsHoverImage = (url) => {
    setFormData(prev => ({
      ...prev,
      hoverImage: url
    }));
  };

  // Remove specific image
  const removeGalleryImage = (url) => {
    setFormData(prev => {
      const filtered = (prev.images || []).filter(img => img !== url);
      return {
        ...prev,
        image: prev.image === url ? (filtered[0] || '') : prev.image,
        hoverImage: prev.hoverImage === url ? (filtered[1] || '') : prev.hoverImage,
        images: filtered
      };
    });
  };

  // Helper to convert Bengali digits to English digits
  const toEnglishDigits = (str) => {
    if (str === null || str === undefined) return '';
    const bnToEnMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
    return String(str).replace(/[০-৯]/g, d => bnToEnMap[d] || d);
  };

  // Clean numeric price for HTML number inputs
  const cleanNumericValue = (val) => {
    if (val === null || val === undefined || val === '') return '';
    const withEnDigits = toEnglishDigits(val);
    const cleaned = withEnDigits.replace(/,/g, '').replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return !isNaN(parsed) && parsed >= 0 ? parsed : '';
  };

  // Match category intelligently to CATEGORIES list
  const matchCategory = (catInput) => {
    if (!catInput || typeof catInput !== 'string') return { category: 'Two Piece Sets', isCustom: false };
    const trimmed = catInput.trim();
    
    // Exact match
    const exact = CATEGORIES.find(c => c.toLowerCase() === trimmed.toLowerCase());
    if (exact) return { category: exact, isCustom: false };

    // Substring or keyword matching
    const lower = trimmed.toLowerCase();
    if (lower.includes('jamdani')) return { category: 'Jamdani Sarees', isCustom: false };
    if (lower.includes('katan') || lower.includes('silk saree')) return { category: 'Katan & Silk Sarees', isCustom: false };
    if (lower.includes('saree') || lower.includes('shari') || lower.includes('sari')) return { category: 'Sarees', isCustom: false };
    if (lower.includes('two piece') || lower.includes('2 piece') || lower.includes('2-piece')) return { category: 'Two Piece Sets', isCustom: false };
    if (lower.includes('three piece') || lower.includes('3 piece') || lower.includes('3-piece') || lower.includes('salwar')) return { category: 'Three Piece Salwar Kameez', isCustom: false };
    if (lower.includes('pakistani')) return { category: 'Pakistani Lawn & Silk Suits', isCustom: false };
    if (lower.includes('abaya') || lower.includes('borka') || lower.includes('cherry')) return { category: 'Dubai Cherry Abayas', isCustom: false };
    if (lower.includes('kurti') || lower.includes('kurta')) return { category: 'Single Kurtis', isCustom: false };
    if (lower.includes('lehenga')) return { category: 'Party Lehengas', isCustom: false };
    if (lower.includes('gown')) return { category: 'Gowns & Anarkali', isCustom: false };
    if (lower.includes('co-ord') || lower.includes('coord')) return { category: 'Co-ord Sets', isCustom: false };
    if (lower.includes('shawl')) return { category: 'Shawls & Pashmina', isCustom: false };
    
    // Custom category fallback
    return { category: trimmed, isCustom: true };
  };

  // Single Master AI Auto-Fill Handler
  const handleMagicFill = async () => {
    if (!magicText.trim()) {
      Swal.fire('Empty Input', 'Please paste raw product text or click one of the quick examples below.', 'warning');
      return;
    }
    
    setIsMagicLoading(true);
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await axios.post('/api/ai/generate', { type: 'smart_extract', context: magicText }, config);
      
      const parsedData = data.data || (typeof data.result === 'string' ? JSON.parse(data.result.replace(/```json/gi, '').replace(/```/g, '').trim()) : null);
      
      if (parsedData) {
        const cleanPrice = cleanNumericValue(parsedData.price);
        const cleanOldPrice = cleanNumericValue(parsedData.oldPrice);

        const categoryMatch = matchCategory(parsedData.category);
        setIsCustomCategory(categoryMatch.isCustom);

        let safeSizes = '';
        if (Array.isArray(parsedData.sizes)) {
          safeSizes = parsedData.sizes.map(s => toEnglishDigits(s)).join(', ');
        } else if (parsedData.sizes) {
          safeSizes = toEnglishDigits(parsedData.sizes);
        }

        let safeColors = '';
        if (Array.isArray(parsedData.colors)) {
          safeColors = parsedData.colors.join(', ');
        } else if (parsedData.colors) {
          safeColors = String(parsedData.colors);
        }

        const materialVal = parsedData.material || parsedData.fabricDetails?.material || parsedData.fabric || '';
        const safeMaterial = Array.isArray(materialVal) ? materialVal.join(' / ') : String(materialVal);
        const safeGsm = parsedData.gsm || parsedData.fabricDetails?.gsm || '';
        const safeWash = parsedData.washInstruction || parsedData.fabricDetails?.washInstruction || parsedData.washCare || '';

        setFormData(prev => ({
          ...prev,
          name: parsedData.name || prev.name,
          price: cleanPrice !== '' ? cleanPrice : prev.price,
          oldPrice: cleanOldPrice !== '' ? cleanOldPrice : prev.oldPrice,
          category: categoryMatch.category || prev.category,
          sizes: safeSizes || prev.sizes,
          colors: safeColors || prev.colors,
          sku: parsedData.sku || prev.sku,
          description: parsedData.description || prev.description,
          fabricDetails: {
            material: safeMaterial || prev.fabricDetails?.material || '',
            gsm: safeGsm || prev.fabricDetails?.gsm || '',
            washInstruction: safeWash || prev.fabricDetails?.washInstruction || ''
          }
        }));

        Swal.fire({ 
          title: '✨ Master Auto-Fill Success!', 
          text: `All fields populated in English for "${parsedData.name || 'Product'}".`, 
          icon: 'success', 
          toast: true, 
          position: 'top-end', 
          showConfirmButton: false, 
          timer: 3500 
        });
      } else {
        Swal.fire('Extraction Error', 'Could not parse response into fields. Please verify your text.', 'error');
      }
    } catch (error) {
      console.error('Magic Fill Error:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to auto-fill product details.', 'error');
    } finally {
      setIsMagicLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire('Required Field', 'Product title is required.', 'warning');
      return;
    }

    try {
      const allImages = Array.from(new Set([
        formData.image,
        formData.hoverImage,
        ...(Array.isArray(formData.images) ? formData.images : [])
      ])).filter(Boolean);

      const submissionData = {
        ...formData,
        image: formData.image || allImages[0] || '',
        hoverImage: formData.hoverImage || allImages[1] || '',
        images: allImages,
        price: Number(formData.price) || 0,
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        countInStock: Number(formData.countInStock) >= 0 ? Number(formData.countInStock) : 0,
        sizes: typeof formData.sizes === 'string' 
          ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) 
          : formData.sizes,
        colors: typeof formData.colors === 'string' 
          ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) 
          : formData.colors
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, submissionData, config);
        Swal.fire('Updated!', 'Product updated successfully in live catalog.', 'success');
      } else {
        await axios.post('/api/products', submissionData, config);
        Swal.fire('Published!', 'New product added to live catalog.', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Save product error:', error);
      Swal.fire('Error Saving Product', error.response?.data?.message || error.message || 'Failed to save product to database.', 'error');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setMagicText('');
    setIsCustomCategory(false);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setMagicText('');
    const allImgs = Array.from(new Set([
      product.image,
      product.hoverImage,
      ...(Array.isArray(product.images) ? product.images : [])
    ])).filter(Boolean);

    setIsCustomCategory(!CATEGORIES.includes(product.category));

    setFormData({
      name: product.name || '',
      price: product.price || 0,
      category: product.category || 'Two Piece Sets',
      brand: product.brand || 'রঙবতী',
      countInStock: product.countInStock !== undefined ? product.countInStock : 0,
      description: product.description || '',
      image: product.image || '',
      hoverImage: product.hoverImage || '',
      images: allImgs,
      oldPrice: product.oldPrice || '',
      sku: product.sku || '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
      fabricDetails: {
        material: product.fabricDetails?.material || '',
        gsm: product.fabricDetails?.gsm || '',
        washInstruction: product.fabricDetails?.washInstruction || ''
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Product has been removed from catalog.', 'success');
        fetchProducts();
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error', 'Failed to delete product', 'error');
      }
    }
  };

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !searchQuery || 
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategoryFilter === 'ALL' || p.category === selectedCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategoryFilter]);

  // Current Category Size Presets
  const activeCategoryPresets = SIZE_PRESETS[formData.category] || SIZE_PRESETS["Two Piece Sets"] || [];

  // Aggregate current images for display
  const allCurrentImages = Array.from(new Set([
    formData.image,
    formData.hoverImage,
    ...(Array.isArray(formData.images) ? formData.images : [])
  ])).filter(Boolean);

  return (
    <div style={{ position: 'relative' }}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Products Catalog</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Manage two-piece, three-piece sets, sarees, kurtis, abayas, gowns & luxury couture
          </p>
        </div>
        <button 
          onClick={openAddModal} 
          style={{ 
            padding: '11px 22px', 
            background: 'var(--color-accent)', 
            color: 'white', 
            borderRadius: '6px', 
            border: 'none',
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(94, 15, 43, 0.25)'
          }}
        >
          <Plus size={19} /> Add New Product
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px', background: 'var(--color-background)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 250px', background: 'var(--color-surface)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
          <Search size={18} color="var(--color-text-secondary)" />
          <input 
            type="text" 
            placeholder="Search by product title, SKU, or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={16} color="var(--color-text-secondary)" />
            </button>
          )}
        </div>

        <select 
          value={selectedCategoryFilter} 
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          style={{ padding: '9px 14px', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-surface)', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <option value="ALL">All Categories ({products.length})</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button 
          onClick={fetchProducts} 
          title="Refresh List"
          style={{ padding: '9px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={15} className={loading ? styles.spin : ''} /> Refresh
        </button>
      </div>

      {/* Products Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Image</th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Stock Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                  Loading product catalog...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                  No products found matching your search.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200'} 
                      alt={product.name} 
                      style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }} 
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{product.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px', fontFamily: 'monospace' }}>
                      SKU: {product.sku || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', padding: '3px 8px', background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>৳{product.price}</div>
                    {product.oldPrice && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textDecoration: 'line-through' }}>
                        ৳{product.oldPrice}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes}>
                      {Array.isArray(product.sizes) && product.sizes.length > 0 
                        ? product.sizes.join(', ') 
                        : (typeof product.sizes === 'string' && product.sizes ? product.sizes : 'Free Size')}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      background: product.countInStock > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: product.countInStock > 0 ? '#16a34a' : '#ef4444' 
                    }}>
                      {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => openEditModal(product)} 
                        title="Edit Product"
                        style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', color: 'var(--color-accent)' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id, product.name)} 
                        title="Delete Product"
                        style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', color: 'var(--color-error)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          width: '100vw', 
          height: '100vh', 
          height: '100dvh',
          background: 'rgba(15, 23, 42, 0.75)', 
          backdropFilter: 'blur(5px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 10000, 
          padding: '16px' 
        }}>
          <div style={{ 
            background: 'var(--color-background)', 
            width: '100%', 
            maxWidth: '820px', 
            maxHeight: '92vh', 
            overflowY: 'auto', 
            padding: '28px', 
            borderRadius: '12px', 
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid var(--color-border)',
            overscrollBehaviorY: 'contain'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)} 
              aria-label="Close modal"
              style={{ 
                position: 'absolute', 
                top: '18px', 
                right: '18px', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '50%', 
                width: '34px', 
                height: '34px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer' 
              }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {editingId ? 'Update product specifications, gallery images, and live storefront data.' : 'Paste raw notes in the box below to auto-populate the entire form in English, or fill manually.'}
              </p>
            </div>
            
            {/* SINGLE MASTER GEMINI AI AUTO-FILL SECTION */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(94, 15, 43, 0.04) 0%, rgba(94, 15, 43, 0.1) 100%)', 
              padding: '18px', 
              borderRadius: '12px', 
              marginBottom: '26px', 
              border: '1.5px solid rgba(94, 15, 43, 0.25)',
              boxShadow: '0 4px 16px rgba(94, 15, 43, 0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="var(--color-accent)" />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-accent)' }}>
                    ✨ Gemini Master Auto-Fill (বাংলা / English / Messy Text → Complete English Form)
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', background: 'var(--color-accent)', color: '#fff', padding: '3px 9px', borderRadius: '50px', fontWeight: 600 }}>
                  Single Master AI
                </span>
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                যে কোনো এলোমেলো টেক্সট (বাংলা, বাংলিশ বা ইংরেজি, ফেসবুক পোস্ট, সাপ্লায়ার নোট, দাম ও সাইজের বিবরণ) এখানে পেস্ট করুন। Gemini AI স্বয়ংক্রিয়ভাবে সবকিছু প্রফেশনাল <strong>ইংরেজিতে</strong> নিচের প্রতিটি বক্সে বসিয়ে দেবে!
              </p>

              <textarea
                rows={4}
                value={magicText}
                onChange={(e) => setMagicText(e.target.value)}
                placeholder="Paste raw vendor message, product specs, or notes in Bangla / English... (e.g. লাল রঙের ঢাকাই জামদানি শাড়ি ৮৪ কাউন্ট পিওর কটন ১২ হাত ব্লাউজ পিস সহ দাম ৩৫০০ টাকা রেগুলার ৪২০০ টাকা ড্রাই ক্লিন)"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(94, 15, 43, 0.3)',
                  fontSize: '0.90rem',
                  fontFamily: 'inherit',
                  marginBottom: '12px',
                  background: 'var(--color-surface)',
                  resize: 'vertical',
                  lineHeight: '1.5'
                }}
              />

              {/* Quick Prompt Samples */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  💡 Try Quick Sample Text (click to paste):
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {MAGIC_EXAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMagicText(sample.text)}
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid rgba(94, 15, 43, 0.25)',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{sample.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Auto-Fill Button */}
              <button
                type="button"
                onClick={handleMagicFill}
                disabled={isMagicLoading}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: isMagicLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(94, 15, 43, 0.3)',
                  opacity: isMagicLoading ? 0.75 : 1
                }}
              >
                {isMagicLoading ? (
                  <>
                    <RefreshCw size={18} className={styles.spin} />
                    <span>Gemini AI is analyzing & translating to English...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>✨ Auto-Fill All Form Fields with Gemini AI</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Product Images & Multiple Gallery Management */}
              <div style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', background: 'var(--color-surface-dim, #fafafa)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={16} color="var(--color-accent)" />
                      <span>Product Images & Gallery (Multiple Photos) *</span>
                    </label>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                      Upload multiple high-resolution photos. First photo will be main, second will be hover.
                    </span>
                  </div>

                  {/* Gallery Actions & Mode Toggle */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleAutoDetectColors}
                      title="Scan all uploaded photos and automatically extract garment colors"
                      style={{
                        padding: '5px 12px',
                        fontSize: '0.78rem',
                        border: '1px solid rgba(94, 15, 43, 0.3)',
                        borderRadius: '6px',
                        background: 'rgba(94, 15, 43, 0.08)',
                        color: 'var(--color-accent)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Palette size={14} />
                      <span>Auto-Detect Colors from Photos</span>
                    </button>

                    <div style={{ display: 'flex', gap: '4px', background: 'var(--color-surface)', padding: '3px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          border: 'none',
                          borderRadius: '4px',
                          background: imageInputMode === 'upload' ? 'var(--color-accent)' : 'transparent',
                          color: imageInputMode === 'upload' ? '#fff' : 'var(--color-text-primary)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Upload Files
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          border: 'none',
                          borderRadius: '4px',
                          background: imageInputMode === 'url' ? 'var(--color-accent)' : 'transparent',
                          color: imageInputMode === 'url' ? '#fff' : 'var(--color-text-primary)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Paste URLs
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload Input Mode */}
                {imageInputMode === 'upload' ? (
                  <div style={{ marginBottom: '14px' }}>
                    <label 
                      style={{ 
                        border: '2px dashed var(--color-border)', 
                        borderRadius: '8px', 
                        padding: '16px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer',
                        background: 'var(--color-background)',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <Upload size={24} color="var(--color-accent)" style={{ marginBottom: '6px' }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {isUploading ? 'Uploading to ImgBB...' : 'Click to select and upload photos'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        Supports JPG, PNG, WEBP. You can select multiple photos at once.
                      </span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleMultipleImageUpload} 
                        disabled={isUploading} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <input 
                      type="url" 
                      placeholder="https://... direct image URL" 
                      value={newImageUrl} 
                      onChange={(e) => setNewImageUrl(e.target.value)} 
                      style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.9rem' }} 
                    />
                    <button 
                      type="button" 
                      onClick={handleAddImageUrl} 
                      style={{ padding: '9px 16px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                    >
                      + Add Photo
                    </button>
                  </div>
                )}

                {/* Gallery Thumbnails List */}
                {allCurrentImages.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                    {allCurrentImages.map((imgUrl, idx) => {
                      const isMain = formData.image === imgUrl;
                      const isHover = formData.hoverImage === imgUrl && !isMain;

                      return (
                        <div 
                          key={idx} 
                          style={{ 
                            position: 'relative', 
                            border: isMain ? '2px solid var(--color-accent)' : (isHover ? '2px solid #3b82f6' : '1px solid var(--color-border)'),
                            borderRadius: '8px', 
                            padding: '6px', 
                            background: 'var(--color-background)',
                            textAlign: 'center'
                          }}
                        >
                          <img 
                            src={imgUrl} 
                            alt={`Gallery ${idx + 1}`} 
                            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', display: 'block', marginBottom: '6px' }} 
                          />
                          
                          {/* Badges */}
                          {isMain && (
                            <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--color-accent)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                              Main
                            </span>
                          )}
                          {isHover && (
                            <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#3b82f6', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                              Hover
                            </span>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(imgUrl)}
                            style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Remove Photo"
                          >
                            <X size={12} />
                          </button>

                          {/* Action controls */}
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '4px' }}>
                            {!isMain && (
                              <button
                                type="button"
                                onClick={() => setAsMainImage(imgUrl)}
                                style={{ fontSize: '0.70rem', padding: '2px 6px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '3px', cursor: 'pointer' }}
                              >
                                Set Main
                              </button>
                            )}
                            {!isHover && (
                              <button
                                type="button"
                                onClick={() => setAsHoverImage(imgUrl)}
                                style={{ fontSize: '0.70rem', padding: '2px 6px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '3px', cursor: 'pointer' }}
                              >
                                Set Hover
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                    No photos added yet. Upload at least 1 image for the product.
                  </p>
                )}
              </div>

              {/* Title & SKU */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 350px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>Product Title / Name (English) *</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="e.g. Royal Crimson Zari Embroidered Pure Katan Saree" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
                <div style={{ flex: '1 1 180px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>SKU / Product Code</label>
                  <input 
                    type="text" 
                    name="sku" 
                    placeholder="e.g. RGB-SAR-101 (Auto generated if blank)" 
                    value={formData.sku} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
              </div>
              
              {/* Pricing & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>Selling Price (৳) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="e.g. 3500" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>Previous / Regular Price (৳)</label>
                  <input 
                    type="number" 
                    name="oldPrice" 
                    placeholder="e.g. 4200 (for discount badge)" 
                    value={formData.oldPrice} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>
                    <span>Stock Quantity</span>
                    <span style={{ color: Number(formData.countInStock) > 0 ? '#16a34a' : '#ef4444' }}>
                      {Number(formData.countInStock) > 0 ? ' (In Stock)' : ' (Out of Stock)'}
                    </span>
                  </label>
                  <input 
                    type="number" 
                    name="countInStock" 
                    placeholder="10" 
                    value={formData.countInStock} 
                    onChange={handleInputChange} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
              </div>

              {/* Category, Sizes, Colors */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category *</label>
                    <button 
                      type="button" 
                      onClick={() => setIsCustomCategory(!isCustomCategory)} 
                      style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {isCustomCategory ? 'Choose from list' : '+ Custom category'}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <input 
                      type="text" 
                      name="category" 
                      placeholder="Type custom category name..." 
                      value={formData.category} 
                      onChange={handleInputChange} 
                      required 
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                    />
                  ) : (
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange} 
                      required 
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem', background: 'var(--color-surface)', cursor: 'pointer' }}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>
                    Sizes / Measurements (comma separated)
                  </label>
                  <input 
                    type="text" 
                    name="sizes" 
                    placeholder="e.g. 12 Haat with Blouse Piece, Free Size, 38, 40, 42" 
                    value={formData.sizes} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Colors (comma separated)</label>
                    <button
                      type="button"
                      onClick={handleAutoDetectColors}
                      style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '3px' }}
                      title="Auto detect colors from uploaded images"
                    >
                      <Palette size={12} /> Auto-Detect
                    </button>
                  </div>
                  <input 
                    type="text" 
                    name="colors" 
                    placeholder="e.g. Crimson Red, Antique Gold, Forest Green" 
                    value={formData.colors} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
              </div>

              {/* Quick Size Presets for Current Category */}
              <div style={{ background: 'var(--color-surface)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  ⚡ Quick Size Presets for {formData.category} (click to add):
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {activeCategoryPresets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSizePresetClick(preset)}
                      style={{
                        background: 'var(--color-background)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        color: 'var(--color-accent)',
                        fontWeight: 500
                      }}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Fabric & Craft Details */}
              <div style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', background: 'var(--color-surface-dim, #fafafa)' }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.92rem' }}>Fabric, Material & Care Details (English)</label>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 600 }}>Material / Fabric</label>
                    <input 
                      type="text" 
                      name="material" 
                      placeholder="e.g. Pure Katan Silk / 84 Count Cotton" 
                      value={formData.fabricDetails.material} 
                      onChange={handleFabricDetailChange} 
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.88rem', background: 'var(--color-background)' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 600 }}>GSM / Weave Count</label>
                    <input 
                      type="text" 
                      name="gsm" 
                      placeholder="e.g. 84 Count / Heavy Weight / N/A" 
                      value={formData.fabricDetails.gsm} 
                      onChange={handleFabricDetailChange} 
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.88rem', background: 'var(--color-background)' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 600 }}>Wash & Care Instruction</label>
                    <input 
                      type="text" 
                      name="washInstruction" 
                      placeholder="e.g. Dry clean recommended" 
                      value={formData.fabricDetails.washInstruction} 
                      onChange={handleFabricDetailChange} 
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.88rem', background: 'var(--color-background)' }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 600 }}>Informative Luxury Product Description (English) *</label>
                  <textarea 
                    name="description" 
                    placeholder="Rich 2-paragraph description detailing fabric weave, embroidery motifs, drape, matching pieces, styling and occasion advice..." 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    required 
                    style={{ 
                      padding: '10px 12px', 
                      border: '1px solid var(--color-border)', 
                      borderRadius: '4px', 
                      minHeight: '110px', 
                      width: '100%', 
                      fontFamily: 'inherit', 
                      fontSize: '0.88rem',
                      resize: 'vertical',
                      background: 'var(--color-background)',
                      lineHeight: '1.6'
                    }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ 
                    padding: '12px 20px', 
                    background: 'var(--color-surface)', 
                    color: 'var(--color-text-primary)', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '6px', 
                    fontWeight: 600,
                    cursor: 'pointer' 
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '12px 26px', 
                    background: 'var(--color-accent)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(94, 15, 43, 0.25)'
                  }}
                >
                  {editingId ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
