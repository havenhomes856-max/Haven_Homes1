import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Move, Square } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  location: string;
  city?: string;
  beds: number | string;
  baths: number | string;
  length?: number;
  breadth?: number;
  type?: string;
  facing?: string;
  sqft: number | string;
  badge?: string;
  tags?: string[];
  instagramLink?: string;
  youtubeLink?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  image,
  name,
  price,
  location,
  city,
  beds,
  baths,
  length,
  breadth,
  type,
  facing,
  sqft,
  badge,
  tags = [],
  instagramLink,
  youtubeLink
}) => {

  return (
    <Link to={`/property/${id}`} className="block group">
      {/* Image Container — compact on mobile, full on desktop */}
      <div className="relative rounded-xl sm:rounded-3xl overflow-hidden mb-2 sm:mb-4 h-[220px] sm:h-[350px] shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-gray-100">
        <img 
          src={(() => {
            if (!image) return '';
            try {
              if (image.includes('ik.imagekit.io')) {
                const url = new URL(image);
                url.searchParams.set("tr", "w-400,q-70");
                return url.toString();
              }
            } catch (e) {
              return image;
            }
            return image;
          })()}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Badge */}
        {badge && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white font-red-hat text-[9px] font-bold shadow-md ${
            badge === 'HOT' ? 'bg-[var(--gold-400)]' :
            badge === 'SOLD' ? 'bg-[var(--charcoal-ink)]' :
            badge === 'FOR RENT' ? 'bg-blue-600' :
            'bg-[#059669]'
          } tracking-widest uppercase`}>
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-1 sm:px-2 space-y-1">
        <div className="flex justify-between items-start gap-2">
           <h3 className="font-fraunces font-bold text-sm sm:text-xl text-[var(--charcoal-ink)] truncate flex-1">
             {name}
           </h3>
           <span className="font-space-mono font-bold text-base sm:text-xl text-[var(--charcoal-ink)]">
             {price}
           </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[var(--slate-gray)]">
           <span className="font-red-hat text-[11px] sm:text-sm font-medium">
             {location}{city ? `, ${city}` : ''}
           </span>
        </div>

        {/* Specs Row */}
        <div className="flex items-center gap-3 sm:gap-4 pt-2">
           {type !== 'Plot' ? (
             <>
               <div className="flex items-center gap-1 text-[var(--slate-gray)]">
                  <Bed className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                  <span className="font-red-hat text-[10px] sm:text-xs font-bold">{beds || 0}</span>
               </div>
               <div className="flex items-center gap-1 text-[var(--slate-gray)]">
                  <Bath className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                  <span className="font-red-hat text-[10px] sm:text-xs font-bold">{baths || 0}</span>
               </div>
             </>
           ) : (
             <div className="flex items-center gap-1 text-[var(--slate-gray)]">
                <Move className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                <span className="font-red-hat text-[10px] sm:text-xs font-bold">{length || 0}x{breadth || 0}</span>
             </div>
           )}
           <div className="flex items-center gap-1 text-[var(--slate-gray)]">
              <Square className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span className="font-red-hat text-[10px] sm:text-xs font-bold">{sqft} sqft</span>
           </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
