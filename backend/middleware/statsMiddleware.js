import Stats from '../models/statsModel.js';

/**
 * Track Daily Property Views
 * 
 * Instead of logging every request, this increments a single counter for the current day.
 * Only tracks GET requests to property detail pages.
 */
export const trackAPIStats = async (req, res, next) => {
  const path = req.path || req.originalUrl;

  // STRICT ALLOWLIST: ONLY track property views
  const isPropertyView = req.method === 'GET' && path.startsWith('/api/products/single/');
  
  if (!isPropertyView) {
    return next();
  }

  // Register the completion handler
  res.on('finish', async () => {
    // Only count successful views
    if (res.statusCode === 200) {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Atomic increment of the daily count
        await Stats.findOneAndUpdate(
          { date: today },
          { 
            $inc: { viewCount: 1 },
            $set: { lastUpdated: new Date() }
          },
          { upsert: true, new: true }
        );
      } catch (error) {
        // Silent fail for stats to not impact user experience
        console.error('Error updating daily stats:', error.message);
      }
    }
  });
  
  next();
};