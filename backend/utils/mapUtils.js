import axios from "axios";

/**
 * Resolves a Google Maps shared link to its final coordinates and embed URL.
 * @param {string} url - The shared Google Maps link
 * @returns {Promise<{lat: string, lng: string, embedUrl: string, finalUrl: string}>}
 */
export async function getMapEmbedFromSharedLink(url) {
  if (!url) return null;
  
  // Handle full iframe tags being pasted
  const iframeMatch = url.match(/src="([^"]+)"/);
  if (iframeMatch) {
    const src = iframeMatch[1];
    return {
      lat: '', // Coordinates might not be easily extractable from embed URL
      lng: '',
      embedUrl: src,
      finalUrl: src,
    };
  }

  try {
    const res = await axios.get(url, {
      maxRedirects: 10,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    const finalUrl = res.request?.res?.responseUrl || res.request?.responseURL || res.config.url;

    if (!finalUrl || finalUrl === url) {
      // If still the same URL, maybe axios didn't follow redirect (some status codes)
      // or it's already a complex URL.
    }

    return extractCoordsAndFormat(finalUrl, url);

  } catch (error) {
    console.error("Map resolution error:", error.message);
    // Fallback: Try to extract from original input
    try {
        return extractCoordsAndFormat(url, url);
    } catch (inner) {
        // Final fallback: if it's a valid http link, just use it as a query-based embed
        if (url.startsWith('http')) {
            return {
                lat: '',
                lng: '',
                embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(url)}&output=embed`,
                finalUrl: url
            };
        }
        throw error;
    }
  }
}

function extractCoordsAndFormat(finalUrl, originalUrl) {
    let lat, lng;

    // Pattern 1: @lat,lng
    let match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      lat = match[1];
      lng = match[2];
    }

    // Pattern 2: !3dLAT!4dLNG
    if (!lat || !lng) {
      match = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (match) {
        lat = match[1];
        lng = match[2];
      }
    }

    // Pattern 3: /maps/search/LAT,LNG
    if (!lat || !lng) {
      match = finalUrl.match(/\/maps\/search\/(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        lat = match[1];
        lng = match[2];
      }
    }

    // Pattern 4: query with q=LAT,LNG
    if (!lat || !lng) {
      match = finalUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        lat = match[1];
        lng = match[2];
      }
    }

    if (lat && lng) {
        return {
          lat,
          lng,
          embedUrl: `https://www.google.com/maps?q=${lat},${lng}&output=embed`,
          finalUrl,
        };
    }

    // Pattern 5: /place/NAME
    match = finalUrl.match(/\/place\/([^/@?]+)/);
    if (match) {
      const placeName = decodeURIComponent(match[1].replace(/\+/g, ' '));
      return {
        lat: '',
        lng: '',
        embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`,
        finalUrl
      };
    }

    // Pattern 6: search?q=NAME
    match = finalUrl.match(/[?&]q=([^&]+)/);
    if (match) {
      const query = decodeURIComponent(match[1].replace(/\+/g, ' '));
      return {
        lat: '',
        lng: '',
        embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`,
        finalUrl
      };
    }

    throw new Error("Could not extract location from URL");
}
