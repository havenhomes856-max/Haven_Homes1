import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, MapPin, Share2 } from 'lucide-react';

interface PropertyHeroImageProps {
  images?: string[];
}

const PropertyHeroImage: React.FC<PropertyHeroImageProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayImages = images?.length 
    ? images 
    : ["https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=1200"];

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      <div className="relative w-full bg-[#FAF8F4] overflow-hidden">
        {/* Main Image Container */}
        <div 
          className="relative h-[45vh] sm:h-[500px] lg:h-[700px] w-full overflow-hidden cursor-pointer sm:px-8 sm:py-6"
          onClick={(e) => {
             if ((e.target as HTMLElement).closest('button')) return;
             setIsModalOpen(true);
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-full h-full sm:rounded-2xl overflow-hidden shadow-2xl relative">
            <img 
              src={displayImages[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />


            {/* Navigation Arrows (Desktop) */}
            {displayImages.length > 1 && (
              <div className="hidden sm:block">
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-[#1C1B1A] backdrop-blur-md rounded-full opacity-80 hover:opacity-100 transition-all duration-300 border border-white/30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-[#1C1B1A] backdrop-blur-md rounded-full opacity-80 hover:opacity-100 transition-all duration-300 border border-white/30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Pagination Indicators (Bottom Center) */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full">
                {displayImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === currentIndex 
                        ? 'w-6 bg-white' 
                        : 'w-1.5 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Modal - Kept for accessibility */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white z-[110] transition-colors"
            onClick={() => setIsModalOpen(false)}
          >
            <span className="material-icons text-4xl">close</span>
          </button>
          
          <img 
            src={displayImages[currentIndex]} 
            className="max-h-[90vh] max-w-[95vw] object-contain select-none" 
            alt="Full size"
            onClick={(e) => e.stopPropagation()}
          />

          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default PropertyHeroImage;