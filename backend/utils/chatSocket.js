import { Conversation, Message } from '../models/chatModel.js';

const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected to chat:', socket.id);

        // User joins a personal room based on their ID
        socket.on('join_room', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        // Send message logic
        socket.on('send_message', async ({ conversationId, senderId, receiverId, text }) => {
            try {
                let conversation;

                if (conversationId) {
                    conversation = await Conversation.findById(conversationId);
                } else {
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

                const message = await Message.create({
                    conversation: conversation._id,
                    sender: senderId,
                    text
                });

                conversation.lastMessage = text;
                conversation.lastMessageTime = Date.now();
                await conversation.save();

                const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

                // Emit to both parties
                io.to(senderId).emit('receive_message', populatedMessage);
                io.to(receiverId).emit('receive_message', populatedMessage);

                // Notify of new message for listing update
                io.to(receiverId).emit('new_chat_notification', {
                    conversationId: conversation._id,
                    lastMessage: text
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
