const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
    maintenanceMode: { type: Boolean, default: false },
    allowRegistration: { type: Boolean, default: true },
    autoMatchEnabled: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    notificationEmail: { type: String, default: 'noreply@resourcematch.com' }
}, { timestamps: true });

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
