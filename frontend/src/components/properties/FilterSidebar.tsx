import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Minus, Search, Check } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  isOpen?: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = React.memo(({ onFilterChange, isOpen = true }) => {
  const [activeFilters, setActiveFilters] = useState({
    propertyType: [] as string[],
    facing: '',
    priceRange: [0, 1000] as [number, number],
    bedrooms: 0,
    bathrooms: 0,
    amenities: [] as string[]
  });

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    setLocalPriceRange(activeFilters.priceRange);
  }, [JSON.stringify(activeFilters.priceRange)]);

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Plot', 'Commercial'];
  const facings = ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'];
  const amenities = ['Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Clubhouse'];

  const toggleType = (type: string) => {
    const newTypes = activeFilters.propertyType.includes(type)
      ? activeFilters.propertyType.filter(t => t !== type)
      : [...activeFilters.propertyType, type];
    
    const next = { ...activeFilters, propertyType: newTypes };
    setActiveFilters(next);
    onFilterChange(next);
  };

  const setFacing = (facing: string) => {
    const next = { ...activeFilters, facing: activeFilters.facing === facing ? '' : facing };
    setActiveFilters(next);
    onFilterChange(next);
  };



  const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="border-b border-[#E6E0DA] py-6">
        <button 
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full mb-4 group"
        >
          <h3 className="font-red-hat text-xs font-bold uppercase tracking-[3px] text-[#1C1B1A]">{title}</h3>
          <div className="text-[#5A5856] group-hover:text-[#C5A059] transition-colors">
            {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </button>
        {open && <div className="space-y-3">{children}</div>}
      </div>
    );
  };

  return (
    <div className={`w-full h-full bg-transparent pb-20 ${isOpen ? 'block' : 'hidden lg:block'}`}>
      
      {/* Search Header */}
      <div className="flex items-center justify-between mb-8">
         <h2 className="font-fraunces text-2xl font-bold text-[#1C1B1A]">Filters</h2>
         <button 
           onClick={() => {
              const reset = { propertyType: [], facing: '', priceRange: [0, 1000] as [number, number], bedrooms: 0, bathrooms: 0, amenities: [] };
              setActiveFilters(reset);
              onFilterChange(reset);
           }}
           className="font-red-hat text-[10px] font-bold text-[#C5A059] uppercase tracking-widest hover:underline"
         >
            Clear All
         </button>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 hide-scrollbar">
        
        {/* Property Type */}
        <FilterSection title="Property Type">
           <div className="grid grid-cols-1 gap-2">
              {propertyTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-red-hat ${
                    activeFilters.propertyType.includes(type)
                      ? 'bg-[#1C1B1A] border-[#1C1B1A] text-white'
                      : 'bg-white border-[#E6E0DA] text-[#5A5856] hover:border-[#1C1B1A]'
                  }`}
                >
                  {type}
                  {activeFilters.propertyType.includes(type) && <Check className="w-4 h-4" />}
                </button>
              ))}
           </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
           <div className="px-2 pt-2">
             <Slider.Root
               className="relative flex items-center select-none touch-none w-full h-5"
               value={localPriceRange}
               max={1000}
               step={5}
               minStepsBetweenThumbs={1}
               onValueChange={(value: number[]) => {
                 setLocalPriceRange(value as [number, number]);
               }}
               onValueCommit={(value: number[]) => {
                 const next = { ...activeFilters, priceRange: value as [number, number] };
                 setActiveFilters(next);
                 onFilterChange(next);
               }}
             >
               <Slider.Track className="bg-[#E6E0DA] relative grow rounded-full h-[3px]">
                 <Slider.Range className="absolute bg-[#C5A059] rounded-full h-full" />
               </Slider.Track>
               <Slider.Thumb
                 className="block w-5 h-5 bg-white border-2 border-[#C5A059] shadow-md rounded-[10px] hover:scale-110 focus:outline-none transition-transform cursor-grab active:cursor-grabbing"
                 aria-label="Min Price"
               />
               <Slider.Thumb
                 className="block w-5 h-5 bg-white border-2 border-[#C5A059] shadow-md rounded-[10px] hover:scale-110 focus:outline-none transition-transform cursor-grab active:cursor-grabbing"
                 aria-label="Max Price"
               />
             </Slider.Root>
             
             <div className="flex justify-between mt-4">
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Min Price</span>
                 <span className="text-sm font-bold text-[#1C1B1A]">₹{localPriceRange[0]}L</span>
               </div>
               <div className="flex flex-col text-right">
                 <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Max Price</span>
                 <span className="text-sm font-bold text-[#1C1B1A]">
                   {localPriceRange[1] >= 1000 ? '₹10Cr+' : localPriceRange[1] >= 100 ? `₹${(localPriceRange[1]/100).toFixed(1)}Cr` : `₹${localPriceRange[1]}L`}
                 </span>
               </div>
             </div>
           </div>
        </FilterSection>

        {/* Facing */}
        <FilterSection title="Facing Direction">
           <div className="grid grid-cols-4 gap-2">
              {facings.map(f => (
                <button
                  key={f}
                  onClick={() => setFacing(f)}
                  className={`flex items-center justify-center h-10 rounded-lg border transition-all text-xs font-red-hat font-bold ${
                    activeFilters.facing === f
                      ? 'bg-[#C5A059] border-[#C5A059] text-white'
                      : 'bg-white border-[#E6E0DA] text-[#5A5856] hover:border-[#C5A059]'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>
        </FilterSection>

        {/* Bedrooms */}
        <FilterSection title="Bedrooms">
           <div className="flex gap-2">
              {[2,3,4,5].map(b => (
                <button
                  key={b}
                  onClick={() => {
                    const next = { ...activeFilters, bedrooms: activeFilters.bedrooms === b ? 0 : b };
                    setActiveFilters(next);
                    onFilterChange(next);
                  }}
                  className={`flex-1 h-12 rounded-xl border transition-all text-sm font-red-hat font-bold ${
                    activeFilters.bedrooms === b
                      ? 'bg-[#1C1B1A] border-[#1C1B1A] text-white'
                      : 'bg-white border-[#E6E0DA] text-[#5A5856] hover:border-[#1C1B1A]'
                  }`}
                >
                  {b}+
                </button>
              ))}
           </div>
        </FilterSection>

        {/* Amenities */}
        <FilterSection title="Amenities" defaultOpen={false}>
           <div className="space-y-2">
              {amenities.map(a => (
                <label key={a} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    activeFilters.amenities.includes(a) ? 'bg-[#1C1B1A] border-[#1C1B1A]' : 'bg-white border-[#E6E0DA] group-hover:border-[#1C1B1A]'
                  }`}>
                    {activeFilters.amenities.includes(a) && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="font-red-hat text-sm text-[#5A5856] group-hover:text-[#1C1B1A]">{a}</span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={activeFilters.amenities.includes(a)}
                    onChange={() => {
                      const newA = activeFilters.amenities.includes(a)
                        ? activeFilters.amenities.filter(item => item !== a)
                        : [...activeFilters.amenities, a];
                      const next = { ...activeFilters, amenities: newA };
                      setActiveFilters(next);
                      onFilterChange(next);
                    }}
                  />
                </label>
              ))}
           </div>
        </FilterSection>

      </div>
    </div>
  );
});

export default FilterSidebar;
