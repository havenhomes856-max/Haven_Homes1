import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import apiClient from '../services/apiClient';
import { X, Upload, Home, MapPin, Phone, DollarSign, BedDouble, Bath, Maximize, Link as LinkIcon, CheckSquare, Square, Plus, ArrowLeft, Loader2, Instagram, Youtube, Building } from 'lucide-react';
import { AMENITIES_LIST } from '../constants/amenities';
import { cn } from '../lib/utils';
import { convertToWebP } from '../lib/imageUtils';

const PROPERTY_TYPES = ['House', 'Apartment', 'Office', 'Villa', 'Plot'];

const inputClass = "w-full px-4 py-3 bg-white border border-[#E6D5C3] rounded-xl text-[#1C1B1A] placeholder-[#9CA3AF] text-sm font-red-hat transition-all duration-200 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15";
const labelClass = "block text-sm font-bold font-red-hat text-[#1C1B1A] mb-2 uppercase tracking-wide";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-9 h-9 bg-[#C5A059]/10 rounded-xl flex items-center justify-center">
      <Icon className="w-4.5 h-4.5 text-[#C5A059]" />
    </div>
    <div>
      <h3 className="text-lg font-bold font-fraunces text-[#1C1B1A]">{title}</h3>
      {subtitle && <p className="text-xs font-red-hat text-[#9CA3AF]">{subtitle}</p>}
    </div>
  </div>
);

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', type: '', price: '', location: '', description: '',
    beds: '', baths: '', length: '', breadth: '', sqft: '', phone: '',
    amenities: [], googleMapLink: '', city: '', instagramLink: '', youtubeLink: '', facing: '', images: [],
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [mapPreview, setMapPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await apiClient.get(`/api/products/single/${id}`);
        if (response.data.success) {
          const property = response.data.property;
          let amenities = property.amenities || [];
          if (amenities.length === 1 && typeof amenities[0] === 'string' && amenities[0].startsWith('[')) {
            try { amenities = JSON.parse(amenities[0]); } catch { /* keep as-is */ }
          }
          setFormData({
            title: property.title, type: property.type, price: property.price,
            location: property.location, description: property.description,
            beds: property.beds, baths: property.baths, length: property.length || '', breadth: property.breadth || '', sqft: property.sqft,
            phone: property.phone,
            amenities, googleMapLink: property.googleMapLink || '',
            city: property.city || '', instagramLink: property.instagramLink || '',
            youtubeLink: property.youtubeLink || '', facing: property.facing || '', images: property.image,
          });
          setPreviewUrls(property.image);
          if (property.mapEmbedUrl) setMapPreview(property.mapEmbedUrl);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details.');
      } finally {
        setFetching(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
      setNewAmenity('');
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      toast.error('Maximum 4 images allowed');
      e.target.value = '';
      return;
    }
    
    const processingToast = toast.loading('Processing images...');
    try {
      const convertedFiles = await Promise.all(
        files.map(file => convertToWebP(file, 0.8))
      );

      const newPreviewUrls = convertedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...convertedFiles] }));
      toast.success('Images optimized successfully', { id: processingToast });
    } catch (error) {
      console.error('Image processing error:', error);
      toast.error('Failed to process some images', { id: processingToast });
    }

    e.target.value = '';
  };

  const removeImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append('id', id);
      // Auto-calculate sqft from length × breadth
      const sqftCalc = formData.length && formData.breadth
        ? Number(formData.length) * Number(formData.breadth)
        : (formData.sqft || 0);
      formdata.append('sqft', String(sqftCalc));
      ['title', 'type', 'price', 'location', 'description', 'beds', 'baths', 'length', 'breadth', 'phone', 'googleMapLink', 'city', 'instagramLink', 'youtubeLink', 'facing'].forEach((key) => {
        formdata.append(key, formData[key]);
      });
      formData.amenities.forEach((amenity, i) => formdata.append(`amenities[${i}]`, amenity));
      formData.images.forEach((image, i) => {
        if (typeof image === 'string') {
          formdata.append(`existingImages`, image);
        } else {
          formdata.append(`image${i + 1}`, image);
        }
      });

      const response = await apiClient.post('/api/products/update', formdata);
      if (response.data.success) {
        toast.success('Property updated successfully!');
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen pt-8 flex items-center justify-center bg-[#FAF8F4]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5A5856] font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-12 px-4 bg-[#FAF8F4]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate('/list')}
            className="flex items-center gap-2 text-sm text-[#5A5856] hover:text-[#C5A059] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </button>
          <h1 className="text-4xl font-bold font-fraunces text-[#1C1B1A] mb-1">Update Property</h1>
          <p className="text-[#5A5856] font-red-hat">Review and update the property information</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={Home} title="Basic Information" />
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClass}>Property Title</label>
                <input type="text" id="title" name="title" required value={formData.title}
                  onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea id="description" name="description" required value={formData.description}
                  onChange={handleInputChange} rows={4} className={cn(inputClass, 'resize-none')} />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="type" className={labelClass}>Property Type</label>
                  <select id="type" name="type" required value={formData.type}
                    onChange={handleInputChange} className={inputClass}>
                    <option value="">Select Type</option>
                    {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={MapPin} title="Location & Pricing" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={labelClass}>Price (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="number" id="price" name="price" required min="0"
                    value={formData.price} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="location" className={labelClass}>Locality</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="text" id="location" name="location" required
                    value={formData.location} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="text" id="city" name="city" required
                    value={formData.city} onChange={handleInputChange}
                    placeholder="e.g. Mumbai" className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="tel" id="phone" name="phone" required
                    value={formData.phone} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="googleMapLink" className={labelClass}>
                  Google Maps Link <span className="text-[#9CA3AF] font-normal">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input type="url" id="googleMapLink" name="googleMapLink"
                      value={formData.googleMapLink} onChange={handleInputChange}
                      placeholder="Paste Google Maps shared link here..." className={cn(inputClass, 'pl-10')} />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!formData.googleMapLink) return;
                      const t = toast.loading('Resolving map...');
                      try {
                        const res = await apiClient.post('/api/admin/resolve-map', { url: formData.googleMapLink });
                        if (res.data.success) {
                          setMapPreview(res.data.data.embedUrl);
                          toast.success('Map resolved successfully', { id: t });
                        }
                      } catch (err) {
                        toast.error('Failed to resolve map link', { id: t });
                      }
                    }}
                    className="px-4 py-2 bg-[#1C1B1A] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-colors"
                  >
                    Verify
                  </button>
                </div>
                {mapPreview && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-[#E6D5C3] aspect-video">
                    <iframe
                      src={mapPreview}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="instagramLink" className={labelClass}>
                  Instagram Link <span className="text-[#9CA3AF] font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="url" id="instagramLink" name="instagramLink"
                    value={formData.instagramLink} onChange={handleInputChange}
                    placeholder="https://instagram.com/..." className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="youtubeLink" className={labelClass}>
                  YouTube Link <span className="text-[#9CA3AF] font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="url" id="youtubeLink" name="youtubeLink"
                    value={formData.youtubeLink} onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=..." className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={Maximize} title="Property Details" />
            <div className={`grid gap-4 ${formData.type === 'Plot' ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {formData.type !== 'Plot' && [
                { id: 'beds', label: 'Bedrooms', icon: BedDouble },
                { id: 'baths', label: 'Bathrooms', icon: Bath },
              ].map(({ id: fieldId, label, icon: Icon }) => (
                <div key={fieldId}>
                  <label htmlFor={fieldId} className={labelClass}>{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input type="number" id={fieldId} name={fieldId} required min="0"
                      value={formData[fieldId]} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                  </div>
                </div>
              ))}
              {[
                { id: 'length', label: 'Length (ft)', icon: Maximize },
                { id: 'breadth', label: 'Breadth (ft)', icon: Maximize },
              ].map(({ id: fieldId, label, icon: Icon }) => (
                <div key={fieldId}>
                  <label htmlFor={fieldId} className={labelClass}>{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input type="number" id={fieldId} name={fieldId} min="0"
                      value={formData[fieldId]} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                  </div>
                </div>
              ))}
            </div>
            {/* Auto sqft preview */}
            {formData.length && formData.breadth ? (
              <div className="mt-3 px-4 py-2 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl flex items-center gap-2">
                <Maximize className="w-4 h-4 text-[#C5A059]" />
                <span className="text-sm font-space-mono text-[#5A5856]">
                  Auto sqft: <span className="font-bold text-[#1C1B1A]">{Number(formData.length) * Number(formData.breadth)}</span> sq ft
                </span>
              </div>
            ) : formData.sqft ? (
              <div className="mt-3 px-4 py-2 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl flex items-center gap-2">
                <Maximize className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-sm font-space-mono text-[#5A5856]">
                  Current sqft: <span className="font-bold text-[#1C1B1A]">{formData.sqft}</span>
                </span>
              </div>
            ) : null}
          </div>

          {/* Facing Direction */}
          {(() => {
            const FACING_OPTIONS = ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'];
            const FACING_LABELS = {
              N: 'North', S: 'South', E: 'East', W: 'West',
              NE: 'North-East', NW: 'North-West', SE: 'South-East', SW: 'South-West',
            };
            return (
              <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
                <SectionHeader icon={Maximize} title="Facing Direction" subtitle="Which direction does the property face?" />
                <div className="grid grid-cols-4 gap-2">
                  {FACING_OPTIONS.map((dir) => {
                    const selected = formData.facing === dir;
                    return (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, facing: prev.facing === dir ? '' : dir }))}
                        className={cn(
                          'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-sm font-semibold transition-all duration-200',
                          selected
                            ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-sm'
                            : 'bg-[#FAF8F4] text-[#5A5856] border-[#E6D5C3] hover:border-[#C5A059] hover:text-[#C5A059]'
                        )}
                      >
                        <span className="text-lg font-space-mono">{dir}</span>
                        <span className="text-[10px] font-normal opacity-80">{FACING_LABELS[dir]}</span>
                      </button>
                    );
                  })}
                </div>
                {formData.facing && (
                  <p className="mt-3 text-sm text-[#C5A059] font-medium font-red-hat">
                    ✓ Selected: {FACING_LABELS[formData.facing]} facing
                  </p>
                )}
              </div>
            );
          })()}

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={CheckSquare} title="Amenities" />
            <div className="flex flex-wrap gap-2 mb-4">
              {AMENITIES_LIST.map((amenity) => {
                const selected = formData.amenities.includes(amenity);
                return (
                  <button key={amenity} type="button" onClick={() => handleAmenityToggle(amenity)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                      selected
                        ? 'bg-[#C5A059] text-white shadow-sm'
                        : 'bg-[#FAF8F4] text-[#5A5856] border border-[#E6D5C3] hover:border-[#C5A059] hover:text-[#C5A059]'
                    )}>
                    {selected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                placeholder="Add custom amenity..." className={cn(inputClass, 'flex-1')} />
              <button type="button" onClick={handleAddAmenity}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1C1B1A] text-white rounded-xl text-sm font-medium hover:bg-[#C5A059] transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {formData.amenities.filter((a) => !AMENITIES_LIST.includes(a)).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.amenities.filter((a) => !AMENITIES_LIST.includes(a)).map((amenity) => (
                  <span key={amenity}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] rounded-full text-sm font-medium">
                    {amenity}
                    <button type="button" onClick={() => handleAmenityToggle(amenity)}
                      className="hover:text-[#C05E44]"><X size={13} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={Upload} title="Property Images" subtitle={`${previewUrls.length}/4 images`} />
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden aspect-square">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImage(index)}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#E6D5C3] rounded-xl cursor-pointer bg-[#FAF8F4] hover:border-[#C5A059] hover:bg-[#C5A059]/5 transition-all duration-200 group">
              <Upload className="w-6 h-6 text-[#9CA3AF] group-hover:text-[#C5A059] mb-1.5 transition-colors" />
              <span className="text-sm font-medium text-[#5A5856] group-hover:text-[#C5A059] transition-colors">
                Add more images
              </span>
              <input id="images" name="images" type="file" multiple accept="image/*"
                onChange={handleImageChange} className="sr-only" />
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/list')}
              className="flex-1 py-4 bg-white border border-[#E6D5C3] text-[#1C1B1A] rounded-xl font-semibold text-base hover:bg-[#FAF8F4] transition-colors">
              Cancel
            </button>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1C1B1A] hover:bg-[#C5A059] text-[#FAF8F4] rounded-xl font-bold font-red-hat text-base transition-all duration-300 shadow-lg hover:shadow-terracotta disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-widest">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Update;
