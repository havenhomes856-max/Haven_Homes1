import React from 'react';
import { Search, Grid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface PropertiesHeaderProps {
  total: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sort: string) => void;
  onMobileFilterOpen: () => void;
  onSearch: (term: string) => void;
  searchValue?: string;
}

const PropertiesHeader: React.FC<PropertiesHeaderProps> = ({
  total,
  viewMode,
  onViewModeChange,
  onSortChange,
  onMobileFilterOpen,
  onSearch,
  searchValue = ''
}) => {
  return (
    <div className="bg-[#FAF8F4] border-b border-[#E6E0DA] py-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Results Count & Title */}
          <div>
            <h1 className="font-fraunces text-3xl sm:text-4xl text-[#1C1B1A] font-bold mb-1">
               Property Listings
            </h1>
            <p className="font-red-hat text-sm text-[#5A5856]">
               <span className="font-bold text-[#1C1B1A]">{total}</span> premium results found
            </p>
          </div>

          {/* Controls Container */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
             
             {/* Search Bar Restoration */}
             <div className="relative flex-1 w-full sm:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5856]" />
                <input 
                  type="text" 
                  placeholder="Search properties..."
                  value={searchValue}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full bg-[#F8F6F6] border border-[#E6E0DA] rounded-xl pl-11 pr-4 py-3 font-red-hat text-sm text-[#1C1B1A] focus:outline-none focus:ring-2 focus:ring-[#1C1B1A] transition-all"
                />
             </div>

             <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Sort Select */}
                <div className="relative group flex-1 sm:flex-none">
                   <select 
                     onChange={(e) => onSortChange(e.target.value)}
                     className="w-full sm:w-auto appearance-none bg-[#F8F6F6] border border-[#E6E0DA] rounded-xl px-4 py-3 pr-10 font-red-hat text-sm font-bold text-[#1C1B1A] uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1C1B1A] transition-all cursor-pointer"
                   >
                     <option value="featured">Featured</option>
                     <option value="newest">Newest First</option>
                     <option value="price-low">Price: Low to High</option>
                     <option value="price-high">Price: High to Low</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1B1A] pointer-events-none group-hover:translate-y-[-40%] transition-transform" />
                </div>

                {/* View Mode Toggles */}
                <div className="hidden sm:flex items-center bg-[#F8F6F6] border border-[#E6E0DA] rounded-xl p-1 gap-1">
                   <button 
                     onClick={() => onViewModeChange('grid')}
                     className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                       viewMode === 'grid' ? 'bg-white text-[#1C1B1A] shadow-sm' : 'text-[#5A5856] hover:text-[#1C1B1A]'
                     }`}
                   >
                     <Grid className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={() => onViewModeChange('list')}
                     className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                       viewMode === 'list' ? 'bg-white text-[#1C1B1A] shadow-sm' : 'text-[#5A5856] hover:text-[#1C1B1A]'
                     }`}
                   >
                     <List className="w-5 h-5" />
                   </button>
                </div>

                {/* Mobile Filter Trigger */}
                <button 
                  onClick={onMobileFilterOpen}
                  className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1C1B1A] text-white px-5 py-3 rounded-xl font-red-hat text-xs font-bold uppercase tracking-widest"
                >
                   <SlidersHorizontal className="w-4 h-4" />
                   Filter
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesHeader;
