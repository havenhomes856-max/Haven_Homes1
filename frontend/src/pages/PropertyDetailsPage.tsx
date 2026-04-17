import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Calendar, MessageSquare, MapPin, ChevronLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import SimpleFooter from '../components/common/SimpleFooter';
import LoadingState from '../components/common/LoadingState';
import PropertyBreadcrumb from '../components/property-details/PropertyBreadcrumb';
import PropertyHeroImage from '../components/property-details/PropertyHeroImage';
import PropertyHeader from '../components/property-details/PropertyHeader';
import PropertyAbout from '../components/property-details/PropertyAbout';
import PropertyAmenities from '../components/property-details/PropertyAmenities';
import PropertyLocation from '../components/property-details/PropertyLocation';
import ScheduleViewingCard from '../components/property-details/ScheduleViewingCard';
import { propertiesAPI } from '../services/api';
import { useSEO } from '../hooks/useSEO';
import StructuredData from '../components/common/StructuredData';
import { formatPrice } from '../utils/formatPrice';

interface PropertyData {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string[];
  beds: number;
  baths: number;
  sqft: number;
  length?: number;
  breadth?: number;
  type: string;
  facing?: string;
  description: string;
  amenities: string[];
  phone: string;
  googleMapLink?: string;
  city?: string;
  instagramLink?: string;
  youtubeLink?: string;
}

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: property ? `${property.title} - ${property.location}` : 'Property Details',
    description: property
      ? `${property.title} in ${property.location}. ${property.beds} beds, ${property.baths} baths, ${property.sqft} sqft. ${property.type}.`
      : 'View property details on Haven Homes.',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const { data } = await propertiesAPI.getById(id);
        if (data.success && data.property) {
          setProperty(data.property);
          window.scrollTo(0, 0);
        } else {
          setError('Property not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch property:', err);
        setError('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#FAF8F4] min-h-screen">
        <Navbar />
        <LoadingState message="Fetching property details..." />
        <SimpleFooter />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-[#FAF8F4] min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32 px-4 shadow-sm">
          <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-[#E6E0DA]">
            <div className="w-16 h-16 bg-[#F8F6F6] rounded-full flex items-center justify-center mx-auto mb-6">
               <span className="material-icons text-3xl text-[#D4755B]">error_outline</span>
            </div>
            <h2 className="font-fraunces text-2xl text-[#1C1B1A] mb-2">{error || 'Property Not Found'}</h2>
            <p className="font-red-hat text-[#5A5856] mb-8">This property listing may have been removed or is currently unavailable.</p>
            <Link
              to="/properties"
              className="w-full bg-[#1C1B1A] text-white font-manrope font-bold py-4 rounded-xl hover:bg-black transition-all inline-block text-center"
            >
              Browse Other Properties
            </Link>
          </div>
        </div>
        <SimpleFooter />
      </div>
    );
  }

  const cityParts = property.location.split(',').map(s => s.trim());
  const city = property.city
    || (cityParts.length >= 3 ? cityParts[cityParts.length - 2]
    : cityParts.length === 2 ? cityParts[0]
    : cityParts[0]);

  const parseAmenities = (amenities: string[]): string[] => {
    if (!amenities || amenities.length === 0) return [];
    if (amenities.length === 1 && typeof amenities[0] === 'string' && amenities[0].startsWith('[')) {
      try {
        const parsed = JSON.parse(amenities[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch { /* fall through */ }
    }
    return amenities;
  };

  return (
    <div className="bg-[#FAF8F4] min-h-screen pb-24 lg:pb-0">
      <StructuredData
        type="property"
        data={{
          title: property.title,
          description: property.description,
          location: city,
          region: cityParts[cityParts.length - 1] || '',
          price: property.price,
          sqft: property.sqft,
          beds: property.beds,
          baths: property.baths,
          image: property.image?.[0],
        }}
      />

      <Navbar />

      {/* Breadcrumb - Hidden on very small mobile for cleaner look */}
      <div className="hidden sm:block">
        <PropertyBreadcrumb
          city={city}
          propertyName={property.title}
        />
      </div>

      <div className="block sm:hidden px-4 py-6">
         <Link 
           to="/properties" 
           className="flex items-center justify-start gap-1 text-[#5A5856] font-manrope font-bold text-xs uppercase tracking-widest border border-[#E6E0DA] py-4 px-5 rounded-xl active:bg-[#F8F6F6] transition-all bg-white shadow-sm w-fit"
         >
            <ChevronLeft className="w-4 h-4" />
            Back to Search
         </Link>
      </div>

      {/* Hero Image Section - Flush on mobile */}
      <PropertyHeroImage images={property.image} />

      {/* Property Main Info Header */}
      <PropertyHeader
        refNumber={`#${property._id.slice(-8).toUpperCase()}`}
        type={property.type}
        facing={property.facing}
        name={property.title}
        location={property.location}
        city={city}
        price={formatPrice(property.price)}
        beds={property.beds}
        baths={property.baths}
        length={property.length}
        breadth={property.breadth}
        sqft={property.sqft}
        instagramLink={property.instagramLink}
        youtubeLink={property.youtubeLink}
      />

      {/* Info & Details Grid */}
      <div className="py-8 sm:py-12 bg-[#FAF8F4]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Core Content */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white rounded-3xl border border-[#E6E0DA] overflow-hidden">

                  <div className="p-6 sm:p-10 space-y-12">
                     <PropertyAbout description={property.description} />
                     <div className="h-px bg-[#E6E0DA]/50" />
                     <PropertyAmenities amenities={parseAmenities(property.amenities)} />
                     <div className="h-px bg-[#E6E0DA]/50" />
                     <PropertyLocation
                       location={property.location}
                       propertyName={property.title}
                       googleMapLink={property.googleMapLink}
                     />
                  </div>
               </div>
            </div>

            {/* Right Column - Desktop Static Card */}
            <div className="hidden lg:block lg:col-span-1">
              <ScheduleViewingCard
                property={{ name: property.title, id: property._id }}
              />
            </div>
          </div>
        </div>
      </div>

      <SimpleFooter />

      {/* Mobile Sticky Action Bar (Inspired by reference screenshot) */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden bg-white border-t border-[#E6E0DA] px-4 py-4 flex items-center justify-between gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
         <a 
           href={`tel:${property.phone}`}
           className="flex-1 flex items-center justify-center gap-2 border border-[#1C1B1A] text-[#1C1B1A] font-manrope font-extrabold text-sm uppercase tracking-widest py-4 rounded-xl active:bg-[#F8F6F6] transition-all"
         >
            <Phone className="w-4 h-4" />
            Contact
         </a>
         <button 
           onClick={() => {
              window.location.href = '/#consultation-section';
           }}
           className="flex-1 flex items-center justify-center gap-2 bg-[#1C1B1A] text-white font-manrope font-extrabold text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg active:scale-95 transition-all"
         >
            <Calendar className="w-4 h-4" />
            Book Visit
         </button>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
