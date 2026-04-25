import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // Stored as plain URLs. Admin-panel listings use this directly.
    // User-submitted listings also store URLs here for full compatibility.
    image: {
      type: [String],
      required: true,
    },
    beds: {
      type: Number,
      default: 0,
    },
    baths: {
      type: Number,
      default: 0,
    },
    sqft: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      default: 0,
    },
    breadth: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    amenities: {
      type: Array,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    googleMapLink: {
      type: String,
      default: "",
    },
    mapEmbedUrl: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    instagramLink: {
      type: String,
      default: "",
    },
    youtubeLink: {
      type: String,
      default: "",
    },
    facing: {
      type: String,
      default: "",
    },
    // Legacy field — kept so old documents don't fail validation. No longer used in new listings.
    availability: {
      type: String,
      default: "",
    },

    // 'active'   — visible on the site
    // 'expired'  — passed its listing date
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  {
    // Adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

// Database indexes for common query patterns
propertySchema.index({ status: 1 }); // Status filtering
propertySchema.index({ createdAt: -1 }); // Sorting by creation date
propertySchema.index({ status: 1, createdAt: -1 }); // Compound: status + sort
propertySchema.index({ location: "text", title: "text", city: "text" }); // Text search
propertySchema.index({ price: 1, beds: 1, type: 1, location: 1 }); // Property filters

const Property = mongoose.model("Property", propertySchema);

export default Property;
