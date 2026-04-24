import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PropertyImageGallery = ({ images, propertyName, propertyStatus = 'Active' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  
  // Prevent body scroll when fullscreen is active & Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    })
  };

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index) => {
    setDirection(index > currentImageIndex ? 1 : -1);
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className="relative w-full overflow-hidden group bg-slate-900 rounded-3xl shadow-xl hover:shadow-2xl hover:border-primary/20 hover:scale-[1.005] transition-all duration-300">
        {/* Main image display area */}
        <div 
          onClick={() => setIsFullscreen(true)}
          className="relative aspect-[16/9] md:aspect-[2.4/1] overflow-hidden flex items-center justify-center cursor-pointer"
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentImageIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={images[currentImageIndex]}
                alt={`${propertyName} - ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent"></div>
            </motion.div>
          </AnimatePresence>

          {/* Status Badges */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-wrap gap-2 z-30">
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className={`px-3 py-1.5 rounded-xl backdrop-blur-md text-[9px] font-black uppercase tracking-widest border shadow-xl flex items-center gap-1.5 ${
                propertyStatus?.toLowerCase() === 'sold' ? 'bg-rose-500/90 text-white border-rose-400/30' : 'bg-white/90 text-primary border-white/20'
              }`}
            >
               <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${propertyStatus?.toLowerCase() === 'sold' ? 'bg-white' : 'bg-primary'}`}></div>
               {propertyStatus}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-emerald-400/30 shadow-xl flex items-center gap-1.5"
            >
               <Icon name="ShieldCheck" size={12} /> Verified
            </motion.div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex justify-between items-end z-30">
            <div className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5">
              <Icon name="Camera" size={12} />
              <span>{currentImageIndex + 1} / {images.length}</span>
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <div className="hidden md:block">
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90 z-40"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90 z-40"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="p-3 bg-white/50 backdrop-blur-md border-t border-slate-100/50 overflow-hidden">
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden transition-all transform ${
                    index === currentImageIndex ? 'ring-2 ring-primary ring-offset-1 scale-105 opacity-100 shadow-lg' : 'opacity-40 hover:opacity-100'
                  }`}
                >
                  <Image src={image} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isFullscreen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFullscreen(false)}
              className="fixed inset-0 z-[200000] bg-slate-950/98 backdrop-blur-2xl flex flex-col cursor-zoom-out"
            >
              {/* Floating Close Button */}
              <button
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                className="fixed top-6 right-6 z-[200005] w-12 h-12 bg-gray-700 hover:bg-gray-600 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 transition-all active:scale-90 group"
              >
                <Icon name="X" size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Header */}
              <div className="flex items-center justify-between p-6 z-[200001]">
                 <div className="text-white">
                    <h3 className="font-heading font-black text-xl tracking-tight leading-none">{propertyName}</h3>
                    <p className="text-white/40 font-black tracking-[0.2em] uppercase text-[9px] mt-2">
                      {currentImageIndex + 1} / {images.length}
                    </p>
                 </div>
                 <button
                   onClick={() => setIsFullscreen(false)}
                   className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 transition-all active:scale-90"
                 >
                   <Icon name="X" size={24} />
                 </button>
              </div>

              {/* Image Display */}
              <div className="flex-1 flex items-center justify-center relative px-4 py-8">
                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={currentImageIndex}
                     initial={{ scale: 0.9, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 1.1, opacity: 0, y: -20 }}
                     transition={{ type: "spring", damping: 25, stiffness: 200 }}
                     className="relative max-w-6xl w-full max-h-full flex items-center justify-center"
                   >
                     <Image
                       src={images[currentImageIndex]}
                       alt="preview"
                       className="max-w-full max-h-[75vh] object-contain rounded-3xl shadow-2xl"
                     />
                     
                     {images.length > 1 && (
                        <>
                           <button onClick={prevImage} className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/5 text-white flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all active:scale-90">
                              <Icon name="ChevronLeft" size={28} />
                           </button>
                           <button onClick={nextImage} className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/5 text-white flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all active:scale-90">
                              <Icon name="ChevronRight" size={28} />
                           </button>
                        </>
                     )}
                   </motion.div>
                 </AnimatePresence>
              </div>

              {/* Thumbs */}
              <div className="py-8 flex flex-col items-center justify-center bg-black/20 border-t border-white/5 backdrop-blur-sm">
                 <div className="flex gap-4 overflow-x-auto no-scrollbar container max-w-4xl px-8">
                    {images.map((img, idx) => (
                      <button
                        key={`fs-${idx}`}
                        onClick={() => selectImage(idx)}
                        className={`flex-shrink-0 w-20 h-14 rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                          idx === currentImageIndex 
                            ? 'border-primary ring-4 ring-primary/20 scale-110 opacity-100 shadow-2xl' : 'border-transparent opacity-30 hover:opacity-100'
                        }`}
                      >
                        <Image src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default PropertyImageGallery;