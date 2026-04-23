import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice.js';
import { useGetConversationsQuery, useGetMessagesQuery } from '../store/slices/chatApiSlice.js';
import socket from '../utils/socket.js';
import Loader from '../components/Loader.jsx';
import { FiMessageSquare, FiSend, FiUser, FiMoreVertical, FiArrowLeft } from 'react-icons/fi';

export default function VendorChatPage() {
    const user = useSelector(selectCurrentUser);
    const [selectedConv, setSelectedConv] = useState(null);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef(null);

    const { data: convsData, isLoading: loadingConvs, refetch: refetchConvs } = useGetConversationsQuery();
    const conversations = convsData?.conversations || [];

    const { data: msgData, isLoading: loadingMsgs } = useGetMessagesQuery(selectedConv?._id, {
        skip: !selectedConv?._id,
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        if (msgData?.messages) {
            setMessages(msgData.messages);
        }
    }, [msgData]);

    useEffect(() => {
        if (user?._id) {
            socket.connect();
            socket.emit('join_room', user._id);

            socket.on('receive_message', (message) => {
                if (selectedConv && message.conversation === selectedConv._id) {
                    setMessages((prev) => [...prev, message]);
                }
                refetchConvs();
            });

            socket.on('new_chat_notification', () => {
                refetchConvs();
            });

            return () => {
                socket.off('receive_message');
                socket.off('new_chat_notification');
                socket.disconnect();
            };
        }
    }, [user?._id, selectedConv, refetchConvs]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim() || !selectedConv) return;

        const receiver = selectedConv.participants.find(p => p._id !== user._id);

        socket.emit('send_message', {
            conversationId: selectedConv._id,
            senderId: user._id,
            receiverId: receiver._id,
            text
        });

        setText('');
    };

    if (loadingConvs) return <Loader />;

    return (
        <div className="animate-fadeIn chat-container" style={{ height: 'calc(100vh - 200px)', display: 'grid', gap: '1.5rem' }}>
            {/* Conversations List */}
            <div className={`card conv-list-card ${selectedConv ? 'hide-mobile' : ''}`} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Messages</h2>
                    <FiMessageSquare color="var(--accent-primary)" />
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No messages yet.</div>
                    ) : (
                        conversations.map((conv) => {
                            const otherUser = conv.participants.find(p => p._id !== user._id);
                            const isActive = selectedConv?._id === conv._id;
                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => setSelectedConv(conv)}
                                    style={{
                                        padding: '1.25rem',
                                        cursor: 'pointer',
                                        background: isActive ? 'var(--bg-input)' : 'transparent',
                                        borderBottom: '1px solid var(--border-color)',
                                        transition: 'var(--transition)',
                                        borderLeft: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                                            {otherUser?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{otherUser?.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {conv.lastMessage || 'Start a conversation'}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                            {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString() : ''}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`card chat-area-card ${!selectedConv ? 'hide-mobile' : ''}`} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {selectedConv ? (
                    <>
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <button
                                    className="btn btn-icon btn-sm show-mobile"
                                    onClick={() => setSelectedConv(null)}
                                    style={{ marginRight: '0.5rem' }}
                                >
                                    <FiArrowLeft />
                                </button>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-secondary)33', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiUser />
                                </div>
                                <span style={{ fontWeight: 800 }}>{selectedConv.participants.find(p => p._id !== user._id)?.name}</span>
                            </div>
                            <FiMoreVertical style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {loadingMsgs ? <Loader /> : messages.map((m, i) => {
                                const isMine = (m.sender?._id || m.sender) === user?._id;
                                return (
                                    <div key={i} style={{
                                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%',
                                        padding: '0.75rem 1.25rem',
                                        borderRadius: isMine ? '1.25rem 1.25rem 0 1.25rem' : '1.25rem 1.25rem 1.25rem 0',
                                        background: isMine ? 'var(--gradient-primary)' : 'var(--bg-input)',
                                        color: isMine ? '#fff' : 'var(--text-primary)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{m.text}</div>
                                        <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.8, textAlign: 'right' }}>
                                            {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        <form onSubmit={handleSend} style={{ padding: '1.25rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem' }}>
                            <input
                                className="form-control"
                                placeholder="Type your reply..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                style={{ borderRadius: 'var(--radius-md)' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
                                <FiSend /> <span className="hide-mobile">Send</span>
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <FiMessageSquare size={60} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

            <style>{`
                .chat-container { grid-template-columns: 1fr 2fr; }
                .show-mobile { display: none; }
                
                @media (max-width: 992px) {
                    .chat-container { grid-template-columns: 1fr; height: calc(100vh - 160px) !important; }
                    .hide-mobile { display: none !important; }
                    .show-mobile { display: flex !important; }
                    .chat-area-card { height: 100%; border: none; }
                    .conv-list-card { height: 100%; border: none; }
                }
            `}</style>
        </div>
    );
}
