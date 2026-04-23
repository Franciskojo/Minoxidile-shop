import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice.js';
import { useGetConversationWithUserQuery, useGetMessagesQuery } from '../store/slices/chatApiSlice.js';
import socket from '../utils/socket.js';
import { FiMessageSquare, FiX, FiSend, FiUser } from 'react-icons/fi';
import Loader from './Loader.jsx';

export default function ChatWidget({ receiverId, receiverName }) {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const user = useSelector(selectCurrentUser);
    const scrollRef = useRef(null);

    const { data: convData, isLoading: loadingConv } = useGetConversationWithUserQuery(receiverId, { skip: !isOpen });
    const conversationId = convData?.conversation?._id;

    const { data: msgData, isLoading: loadingMsgs } = useGetMessagesQuery(conversationId, {
        skip: !conversationId,
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        if (msgData?.messages) {
            setMessages(msgData.messages);
        }
    }, [msgData]);

    useEffect(() => {
        if (isOpen && user?._id) {
            socket.connect();
            socket.emit('join_room', user._id);

            socket.on('receive_message', (message) => {
                if (message.conversation === conversationId) {
                    setMessages((prev) => [...prev, message]);
                }
            });

            return () => {
                socket.off('receive_message');
                socket.disconnect();
            };
        }
    }, [isOpen, user?._id, conversationId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        socket.emit('send_message', {
            conversationId,
            senderId: user._id,
            receiverId,
            text
        });

        setText('');
    };

    if (!user) return null;

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            {isOpen ? (
                <div className="card animate-slideUp" style={{ width: 350, height: 450, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                    {/* Header */}
                    <div style={{ padding: '1rem', background: 'var(--gradient-primary)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiUser size={16} />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Chat with {receiverName}</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {loadingMsgs ? <Loader size="sm" /> : messages.map((m, i) => {
                            const isMine = m.sender._id === user._id || m.sender === user._id;
                            return (
                                <div key={i} style={{
                                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '0.65rem 1rem',
                                    borderRadius: isMine ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                    background: isMine ? 'var(--accent-primary)' : 'var(--bg-input)',
                                    color: isMine ? '#fff' : 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.4,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    {m.text}
                                </div>
                            );
                        })}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{ padding: '1rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                        <input
                            className="form-control"
                            placeholder="Type a message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem' }}
                        />
                        <button type="submit" className="btn btn-icon btn-primary" style={{ borderRadius: '50%' }}>
                            <FiSend size={18} />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary"
                    style={{ width: 60, height: 60, borderRadius: '50%', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <FiMessageSquare size={24} />
                </button>
            )}
        </div>
    );
}
