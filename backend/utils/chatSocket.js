import jwt from 'jsonwebtoken';
import { Conversation, Message } from '../models/chatModel.js';

// Parse cookie string into an object
const parseCookies = (cookieString) => {
    if (!cookieString) return {};
    return cookieString
        .split(';')
        .reduce((res, c) => {
            const [key, val] = c.trim().split('=');
            if (key && val) {
                res[key] = decodeURIComponent(val);
            }
            return res;
        }, {});
};

const chatSocket = (io) => {
    // Authenticate connections using the accessToken cookie
    io.use((socket, next) => {
        try {
            const cookieHeader = socket.request.headers.cookie;
            const cookies = parseCookies(cookieHeader);
            const token = cookies.accessToken;

            if (!token) {
                return next(new Error('Authentication error: No access token provided'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Attached decoded user { id }
            next();
        } catch (err) {
            return next(new Error('Authentication error: Invalid access token'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected to chat:', socket.id, 'User ID:', socket.user.id);

        // User joins a personal room based on their ID
        socket.on('join_room', (userId) => {
            if (userId !== socket.user.id) {
                console.warn(`[CHAT] User ${socket.user.id} tried to join unauthorized room ${userId}`);
                return;
            }
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        // Send message logic
        socket.on('send_message', async ({ conversationId, receiverId, text }) => {
            try {
                if (!text || !text.trim()) return;

                const senderId = socket.user.id;
                let conversation;

                if (conversationId) {
                    conversation = await Conversation.findById(conversationId);
                    if (!conversation) {
                        console.warn(`[CHAT] Conversation ${conversationId} not found`);
                        return;
                    }

                    // Enforce that the sender is actually one of the participants
                    const isParticipant = conversation.participants.some(
                        (p) => p.toString() === senderId
                    );
                    if (!isParticipant) {
                        console.warn(`[CHAT] User ${senderId} is not a participant in conversation ${conversationId}`);
                        return;
                    }

                    // Find the receiver from the conversation participants
                    receiverId = conversation.participants
                        .find((p) => p.toString() !== senderId)
                        ?.toString();
                } else {
                    if (!receiverId) return;

                    // Check if conversation already exists between these two
                    conversation = await Conversation.findOne({
                        participants: { $all: [senderId, receiverId] }
                    });

                    if (!conversation) {
                        conversation = await Conversation.create({
                            participants: [senderId, receiverId]
                        });
                    }
                }

                if (!receiverId) {
                    console.warn(`[CHAT] Receiver not found for message`);
                    return;
                }

                const message = await Message.create({
                    conversation: conversation._id,
                    sender: senderId,
                    text: text.trim()
                });

                conversation.lastMessage = text.trim();
                conversation.lastMessageTime = Date.now();
                await conversation.save();

                const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

                // Emit to both parties
                io.to(senderId).emit('receive_message', populatedMessage);
                io.to(receiverId).emit('receive_message', populatedMessage);

                // Notify of new message for listing update
                io.to(receiverId).emit('new_chat_notification', {
                    conversationId: conversation._id,
                    lastMessage: text.trim()
                });

            } catch (err) {
                console.error('Socket error:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from chat');
        });
    });
};

export default chatSocket;

