import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface PropertyLocationProps {
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  location?: string;
  propertyName?: string;
  mapEmbedUrl?: string;
}


const PropertyLocation: React.FC<PropertyLocationProps> = ({ address, city, state, zipcode, location, propertyName, mapEmbedUrl }) => {
  const displayTitle = city || location?.split(',').pop()?.trim() || 'Location';
  const displayAddress = address
    ? `${address}, ${city || ''}, ${state || ''} ${zipcode || ''}`.replace(/,\s*,/g, ',').replace(/\s+/g, ' ').trim()
    : location || '';

  console.log('PropertyLocation mapEmbedUrl:', mapEmbedUrl);
  // Strictly use the backend-resolved embed URL
  let embedUrl = mapEmbedUrl;

  // If the link is a full iframe tag, extract the src URL
  if (embedUrl && embedUrl.includes('<iframe')) {
    const match = embedUrl.match(/src="([^"]+)"/);
    if (match) {
      embedUrl = match[1];
    }
  }

  const hasMap = !!embedUrl && embedUrl.trim() !== "";

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[#C5A059] rounded-full" />
        <h2 className="font-fraunces font-bold text-2xl text-[#1C1B1A]">
          Location
        </h2>
      </div>

      {/* Address Card */}
      <div className="bg-white border border-[#E6E0DA] rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[rgba(212,117,91,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div className="flex-1">
            <h3 className="font-red-hat font-bold text-base text-[#1C1B1A] mb-1">
              {displayTitle}
            </h3>
            <p className="font-red-hat font-medium text-sm text-[#5A5856] leading-relaxed">
              {displayAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Map / Placeholder */}
      <div className="relative aspect-[690/280] rounded-xl overflow-hidden border border-[#E6E0DA] bg-gray-100">
        {hasMap ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map — ${propertyName || displayTitle}`}
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          /* Placeholder when no map link */
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5F1E8] to-[#E6E0DA] flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
              <MapPin className="w-8 h-8 text-[#C5A059]/60" />
            </div>
            <p className="font-manrope text-sm text-[#64748B]">
              Map not available for this property
            </p>
            <p className="font-manrope text-xs text-[#94A3B8]">
              Contact us for directions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyLocation;
