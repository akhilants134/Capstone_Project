const Message = require('../models/messageModel');

exports.sendMessage = async (req, res) => {
    try {
        const { receiver, text, matchId } = req.body;
        const sender = req.user.id;

        const newMessage = await Message.create({
            sender,
            receiver,
            text,
            match: matchId
        });

        res.status(201).json({
            status: 'success',
            data: { message: newMessage }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find all messages involving the user
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .sort('-createdAt')
        .populate('sender', 'name')
        .populate('receiver', 'name');

        // Simple logic to group messages into conversations (could be more robust)
        const convos = {};
        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
            if (!convos[otherUser._id]) {
                convos[otherUser._id] = {
                    user: otherUser,
                    lastMsg: msg.text,
                    time: msg.createdAt,
                    unread: msg.receiver._id.toString() === userId && !msg.isRead ? 1 : 0
                };
            } else if (msg.receiver._id.toString() === userId && !msg.isRead) {
                convos[otherUser._id].unread++;
            }
        });

        res.status(200).json({
            status: 'success',
            data: { conversations: Object.values(convos) }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        }).sort('createdAt');

        // Mark as read
        await Message.updateMany(
            { sender: otherUserId, receiver: userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            status: 'success',
            data: { messages }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
