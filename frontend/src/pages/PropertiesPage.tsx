import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FilterSidebar from '../components/properties/FilterSidebar';
import PropertiesHeader from '../components/properties/PropertiesHeader';
import PropertiesGrid from '../components/properties/PropertiesGrid';
import LoadingState from '../components/common/LoadingState';
import { propertiesAPI } from '../services/api';
import { useSEO } from '../hooks/useSEO';

export interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string[];
  beds: number;
  baths: number;
  length?: number;
  breadth?: number;
  sqft: number;
  type: string;
  facing?: string;
  description: string;
  amenities: string[];
  phone: string;
  city?: string;
  googleMapLink?: string;
  mapEmbedUrl?: string;
  instagramLink?: string;
  youtubeLink?: string;
}

const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  useSEO({
    title: 'Properties - Browse Listings',
    description: 'Browse apartments, houses, villas, and more. Filter by location, price, bedrooms, and amenities.',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isPending, startTransition] = React.useTransition();
  
  // Track location search separately for the header search bar
  const [locationSearch, setLocationSearch] = useState(urlSearch);

  const [filters, setFilters] = useState<{
    location?: string;
    propertyType?: string[];
    facing?: string;
    priceRange?: [number, number];
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
  }>({
    location: urlSearch
  });

  // Sync state if URL param changes
  useEffect(() => {
    if (urlSearch !== filters.location) {
      setFilters(prev => ({ ...prev, location: urlSearch }));
      setLocationSearch(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await propertiesAPI.getAll();
        if (data.success && data.property) {
          setProperties(data.property);
        }
      } catch (err: any) {
        console.error('Failed to fetch properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileFilterOpen]);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search by title or location or city
    if (locationSearch) {
      const term = locationSearch.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        (p.city && p.city.toLowerCase().includes(term))
      );
    }

    if (filters.propertyType && filters.propertyType.length > 0) {
      result = result.filter((p) =>
        filters.propertyType!.some(t => t.toLowerCase() === p.type.toLowerCase())
      );
    }

    if (filters.facing) {
      const facingVal = filters.facing.toLowerCase();
      result = result.filter((p) => 
        p.facing && p.facing.toLowerCase().includes(facingVal)
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => {
        const priceStr = String(p.price);
        const rawNum = parseFloat(priceStr.replace(/,/g, '').replace(/₹/g, ''));
        
        let priceInLakhs = rawNum;
        if (priceStr.toUpperCase().includes('CR')) {
          priceInLakhs = rawNum * 100;
        } else if (rawNum > 100000) {
          priceInLakhs = rawNum / 100000;
        }

        if (priceInLakhs < min) return false;
        if (max < 1000 && priceInLakhs > max) return false;
        return true;
      });
    }

    if (filters.bedrooms) {
      const beds = Number(filters.bedrooms);
      if (beds > 0) {
        result = result.filter(p => p.beds >= beds);
      }
    }

    if (filters.bathrooms && filters.bathrooms > 0) {
      result = result.filter(p => p.baths >= filters.bathrooms!);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter(p =>
        filters.amenities!.every(filterAmenity =>
          (p.amenities || []).some(propertyAmenity =>
            propertyAmenity.toLowerCase() === filterAmenity.toLowerCase()
          )
        )
      );
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'beds':
        result.sort((a, b) => b.beds - a.beds);
        break;
      case 'newest':
        result.sort((a, b) => b._id.localeCompare(a._id));
        break;
      case 'featured':
      default:
        break;
    }

    return result;
  }, [properties, locationSearch, filters, sortBy]);

  const handleSearch = (term: string) => {
    setLocationSearch(term);
    // Debounce or update URL optionally
    if (term) {
      setSearchParams({ search: term }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleFilterChange = React.useCallback((newFilters: any) => {
    startTransition(() => {
      setFilters(prev => ({ ...newFilters, location: locationSearch }));
    });
  }, [locationSearch]);

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const activeFilterCount = Object.values(filters).filter(v =>
    v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
  ).length;

  return (
    <div className="bg-[#FAF8F4] min-h-screen overflow-x-hidden relative">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-start gap-8 py-0 lg:py-8">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[280px] shrink-0 sticky top-28 h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar pr-1">
           <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 pb-20">
          <PropertiesHeader
            total={filteredProperties.length}
            viewMode={viewMode}
            onViewModeChange={handleViewChange}
            onSortChange={handleSortChange}
            onMobileFilterOpen={() => setMobileFilterOpen(true)}
            onSearch={handleSearch}
            searchValue={locationSearch}
          />

          {loading && <LoadingState message="Loading properties..." />}

          {error && !loading && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center px-4">
                <span className="material-icons text-4xl text-[#C5A059] mb-4">error_outline</span>
                <p className="font-manrope text-[#374151] mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#C5A059] text-white font-manrope font-bold px-6 py-2 rounded-lg hover:bg-[#B86851] transition-all"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredProperties.length === 0 && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center px-4">
                <span className="material-icons text-4xl text-[#9CA3AF] mb-4">search_off</span>
                <p className="font-fraunces text-2xl text-[#1C1B1A] mb-2 font-bold">No properties found</p>
                <p className="font-red-hat text-sm text-[#5A5856]">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            </div>
          )}

          {!loading && !error && filteredProperties.length > 0 && (
            <PropertiesGrid properties={filteredProperties} viewMode={viewMode} />
          )}
        </div>
      </div>

      <Footer />
      
      {/* Mobile filter drawer (integrated logic) */}
      <div
        className={`lg:hidden fixed inset-0 z-[110] bg-black/40 transition-opacity duration-300 ${
          mobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileFilterOpen(false)}
      />
      <div
        className={`lg:hidden fixed inset-y-0 right-0 z-[120] w-[85vw] max-w-[400px] bg-[#FAF8F4] shadow-2xl transition-transform duration-300 transform ${
          mobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E6E0DA]">
           <h2 className="font-fraunces text-2xl font-bold text-[#1C1B1A]">Filters</h2>
           <button onClick={() => setMobileFilterOpen(false)} className="text-[#1C1B1A]">
              <span className="material-icons">close</span>
           </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
           <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
