const cron = require('node-cron');
const Listing = require('../models/listingModel');
const { setCache } = require('../utils/redisClient');

const initCronJobs = () => {
  console.log('🕒 Initializing scheduled cron jobs...');

  // 1. Cron Job: Clean up expired/cancelled stale matches every midnight (0 0 * * *)
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🧹 [CRON] Running daily cleanup of stale cancelled listings...');
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const result = await Listing.deleteMany({
        status: 'cancelled',
        updatedAt: { $lt: thirtyDaysAgo }
      });
      console.log(`🧹 [CRON] Cleaned up ${result.deletedCount} old cancelled listings.`);
    } catch (err) {
      console.error('❌ [CRON Error] Cleanup failed:', err.message);
    }
  });

  // 2. Cron Job: Pre-calculate Category Analytics & Leaderboard and cache in Redis every 15 minutes (*/15 * * * *)
  cron.schedule('*/15 * * * *', async () => {
    try {
      console.log('📊 [CRON] Recalculating category & donation metrics for Redis cache...');
      const categoryStats = await Listing.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', total: { $sum: 1 }, requests: { $sum: { $cond: [{ $eq: ['$type', 'request'] }, 1, 0] } }, donations: { $sum: { $cond: [{ $eq: ['$type', 'donation'] }, 1, 0] } } } },
        { $sort: { total: -1 } }
      ]);

      await setCache('stats:category_analytics', categoryStats, 900);
      console.log('✅ [CRON] Analytics updated in Redis cache.');
    } catch (err) {
      console.error('❌ [CRON Error] Analytics aggregation failed:', err.message);
    }
  });

  // 3. Cron Job: System Health Pulse every 5 minutes (*/5 * * * *)
  cron.schedule('*/5 * * * *', () => {
    const memUsageMB = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    console.log(`💓 [CRON] Heartbeat | Memory: ${memUsageMB} MB | Uptime: ${Math.floor(process.uptime())}s`);
  });
};

module.exports = { initCronJobs };
