import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { X } from 'lucide-react';
import styles from './ImageCropperModal.module.css';

const ImageCropperModal = ({ imageSrc, onCropComplete, onCancel, aspectRatio }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Crop Image</h3>
          <button className={styles.closeBtn} onClick={onCancel} disabled={isProcessing}>
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.cropperContainer}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio} // If undefined, it allows free form
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
            classes={{
              containerClassName: styles.cropperMainContainer,
            }}
          />
        </div>

        <div className={styles.controlsContainer}>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(e.target.value)}
            className={styles.zoomSlider}
          />
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={isProcessing}>
            Cancel
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? 'Cropping...' : 'Crop & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
