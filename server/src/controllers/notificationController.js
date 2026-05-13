const Notification = require('../models/notificationModel');

exports.getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ recipient: userId })
            .sort('-createdAt')
            .limit(20);

        res.status(200).json({
            status: 'success',
            results: notifications.length,
            data: { notifications }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Notifications marked as read'
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.createNotification = async (recipient, type, title, text, link, sender = null) => {
    try {
        await Notification.create({
            recipient,
            type,
            title,
            text,
            link,
            sender
        });
    } catch (err) {
        console.error('Failed to create notification:', err);
    }
};
