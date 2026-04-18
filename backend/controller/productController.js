import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertyModel.js";
import { deleteImagesFromImageKit } from "../utils/imageKitCleanup.js";
import { getMapEmbedFromSharedLink } from "../utils/mapUtils.js";

const addproperty = async (req, res) => {
    try {
        const { title, location, price, beds, baths, length, breadth, sqft, type, description, amenities, phone, googleMapLink, city, instagramLink, youtubeLink, facing } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to ImageKit and delete after upload
        const imageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await imagekit.upload({
                    file: fs.readFileSync(item.path),
                    fileName: item.originalname,
                    folder: "Property",
                });
                fs.unlink(item.path, (err) => {
                    if (err) console.log("Error deleting the file: ", err);
                });
                return result.url;
            })
        );
        
        // Resolve Google Maps link if provided
        let mapEmbedUrl = '';
        let coordinates = { lat: '', lng: '' };
        if (googleMapLink) {
            try {
                const mapData = await getMapEmbedFromSharedLink(googleMapLink);
                if (mapData) {
                    mapEmbedUrl = mapData.embedUrl;
                }
            } catch (err) {
                console.warn("Failed to resolve map link during property creation:", err.message);
            }
        }

        // Create a new product
        const product = new Property({
            title,
            location,
            price,
            beds: beds ? Number(beds) : 0,
            baths: baths ? Number(baths) : 0,
            length: length ? Number(length) : 0,
            breadth: breadth ? Number(breadth) : 0,
            sqft,
            type,
            description,
            amenities,
            image: imageUrls,
            phone,
            googleMapLink: googleMapLink || '',
            mapEmbedUrl,
            city: city || '',
            instagramLink: instagramLink || '',
            youtubeLink: youtubeLink || '',
            facing: facing || '',
        });

        // Save the product to the database
        await product.save();

        res.json({ message: "Product added successfully", success: true });
    } catch (error) {
        console.log("Error adding product: ", error);
        res.status(500).json({ message: "Server Error", error: error.message, stack: error.stack, success: false });
    }
};

const listproperty = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // Default 20 per page
        const skip = (page - 1) * limit;

        // Only return active properties publicly.
        // Legacy admin-added documents that pre-date the status field are also
        // included via the $exists check so they are not accidentally hidden.
        const query = {
            $or: [{ status: 'active' }, { status: { $exists: false } }],
        };

        // Get total count for pagination metadata
        const totalProperties = await Property.countDocuments(query);
        const totalPages = Math.ceil(totalProperties / limit);

        // Get properties with pagination
        const property = await Property.find(query)
            .sort({ createdAt: -1 }) // Most recent first
            .limit(limit)
            .skip(skip);

        res.json({
            property,
            success: true,
            pagination: {
                currentPage: page,
                totalPages,
                totalProperties,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                limit
            }
        });
    } catch (error) {
        console.log("Error listing products: ", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const removeproperty = async (req, res) => {
    try {
        const property = await Property.findById(req.body.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }

        // Delete images from ImageKit
        if (property.image && property.image.length > 0) {
            await deleteImagesFromImageKit(property.image);
        }

        await Property.findByIdAndDelete(req.body.id);
        return res.json({ message: "Property removed successfully", success: true });
    } catch (error) {
        console.log("Error removing product: ", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

const updateproperty = async (req, res) => {
    try {
        console.log("Update Property Request Body:", req.body);
        console.log("Update Property Files:", req.files);
        const { id, title, location, price, beds, baths, length, breadth, sqft, type, description, amenities, phone, googleMapLink, city, instagramLink, youtubeLink, facing } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            console.log("Property not found with ID:", id); // Debugging line
            return res.status(404).json({ message: "Property not found", success: false });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            // No new images provided
            property.title = title;
            property.location = location;
            property.price = price;
            if (beds !== undefined) property.beds = beds;
            if (baths !== undefined) property.baths = baths;
            if (length !== undefined) property.length = length;
            if (breadth !== undefined) property.breadth = breadth;
            property.sqft = sqft;
            property.type = type;
            property.description = description;
            property.amenities = amenities;
            property.phone = phone;
            // Re-resolve map if link changed OR if embed URL is missing
            if (googleMapLink && (googleMapLink !== property.googleMapLink || !property.mapEmbedUrl)) {
                try {
                    const mapData = await getMapEmbedFromSharedLink(googleMapLink);
                    if (mapData) {
                        property.mapEmbedUrl = mapData.embedUrl;
                    }
                } catch (err) {
                    console.warn("Failed to resolve map link during property update:", err.message);
                }
            } else if (!googleMapLink) {
                property.mapEmbedUrl = '';
            }

            property.googleMapLink = googleMapLink || '';

            property.city = city || '';
            property.instagramLink = instagramLink || '';
            property.youtubeLink = youtubeLink || '';
            property.facing = facing || '';
            
            // Check if there are existing images passed in body
            if (req.body.existingImages) {
                const existingImages = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
                property.image = existingImages;
            }
            
            console.log("Saving property. mapEmbedUrl:", property.mapEmbedUrl);
            await property.save();
            return res.json({ message: "Property updated successfully", success: true });
        }

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to ImageKit and delete after upload
        const newImageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await imagekit.upload({
                    file: fs.readFileSync(item.path),
                    fileName: item.originalname,
                    folder: "Property",
                });
                fs.unlink(item.path, (err) => {
                    if (err) console.log("Error deleting the file: ", err);
                });
                return result.url;
            })
        );

        let finalImages = [];
        if (req.body.existingImages) {
            const existingImages = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
            
            // Check for removed images to cleanup ImageKit
            const removedImages = property.image.filter(img => !existingImages.includes(img));
            if (removedImages.length > 0) {
                await deleteImagesFromImageKit(removedImages);
            }
            
            finalImages = [...existingImages];
        } else if (images.length > 0 && property.image.length > 0) {
            // If new images are uploaded and no existing images provided, 
            // assume all old images are being replaced.
            await deleteImagesFromImageKit(property.image);
        }
        finalImages = [...finalImages, ...newImageUrls];

        property.title = title;
        property.location = location;
        property.price = price;
        if (beds !== undefined) property.beds = beds;
        if (baths !== undefined) property.baths = baths;
        if (length !== undefined) property.length = length;
        if (breadth !== undefined) property.breadth = breadth;
        property.sqft = sqft;
        property.type = type;
        property.description = description;
        property.amenities = amenities;
        property.image = finalImages.length > 0 ? finalImages : property.image;
        property.phone = phone;
        // Re-resolve map if link changed OR if embed URL is missing
        if (googleMapLink && (googleMapLink !== property.googleMapLink || !property.mapEmbedUrl)) {
            try {
                const mapData = await getMapEmbedFromSharedLink(googleMapLink);
                if (mapData) {
                    property.mapEmbedUrl = mapData.embedUrl;
                }
            } catch (err) {
                console.warn("Failed to resolve map link during property update:", err.message);
            }
        } else if (!googleMapLink) {
            property.mapEmbedUrl = '';
        }

        property.googleMapLink = googleMapLink || '';

        property.city = city || '';
        property.instagramLink = instagramLink || '';
        property.youtubeLink = youtubeLink || '';
        property.facing = facing || '';

        console.log("Saving property (with images). mapEmbedUrl:", property.mapEmbedUrl);
        await property.save();
        res.json({ message: "Property updated successfully", success: true });
    } catch (error) {
        console.log("Error updating product: ", error);
        res.status(500).json({ message: "Server Error", error: error.message, stack: error.stack, success: false });
    }
};

const singleproperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        console.log("Fetching property. mapEmbedUrl in DB:", property.mapEmbedUrl);
        // Block public access to listings that are not yet approved or have been
        // rejected/expired. Legacy docs without a status field are always visible.
        if (property.status && property.status !== 'active') {
            return res.status(404).json({ message: "Property not found", success: false });
        }
        res.json({ property, success: true });
    } catch (error) {
        console.log("Error fetching property:", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};

export { addproperty, listproperty, removeproperty, updateproperty , singleproperty};