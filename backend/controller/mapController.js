import { getMapEmbedFromSharedLink } from '../utils/mapUtils.js';

/**
 * POST /api/admin/resolve-map
 * Resolves a Google Maps shared link for preview in the admin panel.
 */
export const resolveMapLink = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: "URL is required" });
    }

    const data = await getMapEmbedFromSharedLink(url);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error resolving map link:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
