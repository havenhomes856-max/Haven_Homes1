import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { propertiesAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import PropertyCard from '../properties/PropertyCard';


interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string[];
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  facing?: string;
  length?: number;
  breadth?: number;
  city?: string;
  instagramLink?: string;
  youtubeLink?: string;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=800&fm=webp&q=80",
  "https://images.unsplash.com/photo-1695067440629-b5e513976100?w=800&fm=webp&q=80",
  "https://images.unsplash.com/photo-1738168279272-c08d6dd22002?w=800&fm=webp&q=80",
  "https://images.unsplash.com/photo-1769428003672-296f923d19b2?w=800&fm=webp&q=80",
  "https://images.unsplash.com/photo-1761509386107-9baefe0073f2?w=800&fm=webp&q=80",
];

const CuratedListingsSection: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await propertiesAPI.getAll();
        if (data.success && data.property) {
          setProperties(data.property.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch featured properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <section className="bg-white pt-8 pb-12 border-t border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">

        {/* Section Header with Explore link */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-red-hat text-xs uppercase tracking-[2px] text-[#6B7280] mb-2 font-bold">Featured Listings</p>
            <h2 className="font-fraunces font-bold text-3xl sm:text-4xl lg:text-5xl text-[#C5A059]">Our Premium Selection</h2>
          </div>
          <Link
            to="/properties"
            className="hidden sm:inline-flex items-center gap-2 font-red-hat text-sm font-bold text-[#C5A059] border-b-2 border-[#C5A059] pb-1 hover:text-[#4B5563] hover:border-[#4B5563] transition-colors uppercase tracking-widest"
          >
            Explore All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Explore link */}
        <Link
          to="/properties"
          className="sm:hidden flex items-center gap-2 font-red-hat text-sm font-bold text-[#C5A059] mb-8 uppercase tracking-widest"
        >
          Explore All Properties
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#F3F4F6] rounded-2xl h-[300px] mb-4" />
                <div className="h-5 bg-[#F3F4F6] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#F3F4F6] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <PropertyCard
                key={property._id}
                id={property._id}
                image={property.image?.[0] || fallbackImages[index % fallbackImages.length]}
                name={property.title}
                price={formatPrice(property.price)}
                location={property.location}
                city={property.city}
                beds={property.beds}
                baths={property.baths}
                length={property.length}
                breadth={property.breadth}
                type={property.type}
                facing={property.facing}
                sqft={property.sqft}
                tags={property.type ? [property.type] : []}
                instagramLink={property.instagramLink}
                youtubeLink={property.youtubeLink}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CuratedListingsSection;
