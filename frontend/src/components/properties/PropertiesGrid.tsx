import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import { formatPrice } from '../../utils/formatPrice';
import type { Property } from '../../pages/PropertiesPage';

class PropertyErrorBoundary extends Component<{ property: Property, children: ReactNode }, { hasError: boolean, error: any }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-lg overflow-auto max-w-full">
          <strong>Error rendering property:</strong>
          <pre className="text-xs">{this.state.error?.toString()}</pre>
          <pre className="text-xs">{JSON.stringify(this.props.property, null, 2)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

interface PropertiesGridProps {
  properties: Property[];
  viewMode?: 'grid' | 'list';
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=800&fm=webp&q=80",
  "https://images.unsplash.com/photo-1695067440629-b5e513976100?w=800&fm=webp&q=80",
  "https://images.unsplash.com/photo-1738168279272-c08d6dd22002?w=800&fm=webp&q=80",
  "https://images.unsplash.com/photo-1769428003672-296f923d19b2?w=800&fm=webp&q=80",
  "https://images.unsplash.com/photo-1761509386107-9baefe0073f2?w=800&fm=webp&q=80",
  "https://images.unsplash.com/photo-1762732793012-8bdab3af00b4?w=800&fm=webp&q=80"
];

const PropertiesGrid: React.FC<PropertiesGridProps> = ({ properties, viewMode = 'grid' }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 p-1 sm:p-8">
      {/* Properties Grid */}
      <motion.div
        key={properties.length > 0 ? (properties[0]._id + properties.length) : 'empty'}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-12'
            : 'flex flex-col gap-6 mb-12'
        }
      >
        {properties.map((property, index) => (
          <motion.div key={property._id} variants={item}>
            <PropertyErrorBoundary property={property}>
              <PropertyCard
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
            </PropertyErrorBoundary>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PropertiesGrid;
