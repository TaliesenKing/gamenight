import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, fetchConversation, createMessage } from '../../redux/messages';
import './Messages.css';

function MessagesPage() {
    const dispatch = useDispatch();
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    
    const conversations = useSelector(state => state.messages.conversations);
    const currentConversation = useSelector(state => state.messages.currentConversation);
    const currentUser = useSelector(state => state.session.user);

    useEffect(() => {
        const loadConversations = async () => {
            await dispatch(fetchConversations());
            setLoading(false);
        };
        
        if (currentUser) {
            loadConversations();
        }
    }, [dispatch, currentUser]);

    useEffect(() => {
        if (selectedUserId) {
            dispatch(fetchConversation(selectedUserId));
        }
    }, [dispatch, selectedUserId]);

    const handleSelectConversation = (userId) => {
        setSelectedUserId(userId);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedUserId) return;

        const messageData = {
            recipient_id: selectedUserId,
            content: messageText.trim()
        };

        const result = await dispatch(createMessage(messageData));
        if (!result.error) {
            setMessageText('');
            // Refresh conversations to update latest message
            dispatch(fetchConversations());
        }
    };

    // const formatTime = (timestamp) => {
    //     const date = new Date(timestamp);
    //     const now = new Date();
    //     const diffMs = now - date;
    //     const diffMins = Math.floor(diffMs / 60000);
    //     const diffHours = Math.floor(diffMs / 3600000);
    //     const diffDays = Math.floor(diffMs / 86400000);

    //     if (diffMins < 1) return 'Just now';
    //     if (diffMins < 60) return `${diffMins}m ago`;
    //     if (diffHours < 24) return `${diffHours}h ago`;
    //     if (diffDays < 7) return `${diffDays}d ago`;
    //     return date.toLocaleDateString();
    // };

    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="messages-container">
                <div className="loading">
                    🔮 Summoning messages from the ethereal realm...
                </div>
            </div>
        );
    }

    const conversationsList = Object.values(conversations);
    const selectedConversation = selectedUserId ? conversations[selectedUserId] : null;

    return (
        <div className="messages-container">
            <div className="conversations-sidebar">
                <div className="conversations-header">
                    <h1 className="conversations-title">🏰 Tavern Messages</h1>
                    <button className="new-message-btn">
                        📜 New Message
                    </button>
                </div>
                
                <ul className="conversations-list">
                    {conversationsList.length === 0 ? (
                        <li className="empty-state">
                            <div className="empty-state-icon">🗡️</div>
                            <div className="empty-state-text">No messages yet</div>
                            <div className="empty-state-subtext">Seek out fellow adventurers to begin your correspondence!</div>
                        </li>
                    ) : (
                        conversationsList.map(conversation => (
                            <li 
                                key={conversation.user.id}
                                className={`conversation-item ${selectedUserId === conversation.user.id ? 'active' : ''}`}
                                onClick={() => handleSelectConversation(conversation.user.id)}
                            >
                                <div className="conversation-username">
                                    🛡️ {conversation.user.username}
                                </div>
                                {conversation.unread_count > 0 && (
                                    <span className="unread-badge">{conversation.unread_count}</span>
                                )}
                                {conversation.latest_message && (
                                    <div className="conversation-preview">
                                        {conversation.latest_message.content.length > 40 
                                            ? `${conversation.latest_message.content.substring(0, 40)}...` 
                                            : conversation.latest_message.content}
                                    </div>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div className="chat-area">
                {selectedUserId ? (
                    <>
                        <div className="chat-header">
                            <h2>⚔️ Correspondence with {selectedConversation?.user.username}</h2>
                        </div>
                        
                        <div className="messages-list">
                            {currentConversation.map(message => (
                                <div 
                                    key={message.id}
                                    className={`message ${message.sender_id === currentUser.id ? 'own' : 'other'}`}
                                >
                                    <div className="message-bubble">
                                        <div className="message-content">{message.content}</div>
                                        <div className="message-time">
                                            {formatMessageTime(message.created_at)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="message-input-area">
                            <form onSubmit={handleSendMessage} className="message-input-form">
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Whisper your message into the void..."
                                    className="message-input"
                                    rows="1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!messageText.trim()}
                                    className="send-button"
                                >
                                    🏹 Send
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🏺</div>
                        <div className="empty-state-text">Choose thy correspondent</div>
                        <div className="empty-state-subtext">Select an adventurer from the tavern to begin your exchange of missives</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessagesPage;
