import asyncHandler from 'express-async-handler';
import { Conversation, Message } from '../models/chatModel.js';

// @desc    Get my conversations
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
        participants: req.user._id
    })
        .populate('participants', 'name avatar role')
        .sort({ lastMessageTime: -1 });

    res.json({ success: true, conversations });
});

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({
        conversation: req.params.conversationId
    })
        .populate('sender', 'name avatar')
        .sort({ createdAt: 1 });

    res.json({ success: true, messages });
});

// @desc    Get or Create conversation with user
// @route   GET /api/chat/with/:userId
// @access  Private
export const getConversationWithUser = asyncHandler(async (req, res) => {
    let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, req.params.userId] }
    }).populate('participants', 'name avatar role');

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user._id, req.params.userId]
        });
        conversation = await conversation.populate('participants', 'name avatar role');
    }

    res.json({ success: true, conversation });
});
