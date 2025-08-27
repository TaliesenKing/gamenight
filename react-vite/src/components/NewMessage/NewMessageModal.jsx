import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createMessage } from '../../redux/messages';
import './NewMessageModal.css';

function NewMessageModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [selectedUserId, setSelectedUserId] = useState('');
    const [messageText, setMessageText] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const currentUser = useSelector(state => state.session.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users/');
                if (response.ok) {
                    const data = await response.json();
                    // Filter out the current user
                    const otherUsers = data.users.filter(user => user.id !== currentUser.id);
                    setUsers(otherUsers);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedUserId || !messageText.trim()) {
            setError('Please select a user and enter a message');
            return;
        }

        const messageData = {
            recipient_id: parseInt(selectedUserId),
            content: messageText.trim()
        };

        const result = await dispatch(createMessage(messageData));
        if (result.error) {
            setError(result.error);
        } else {
            closeModal();
        }
    };

    if (loading) {
        return (
            <div className="new-message-modal">
                <div className="loading">Gathering fellow adventurers...</div>
            </div>
        );
    }

    return (
        <div className="new-message-modal">
            <h2>Compose New Missive</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="new-message-form">
                <div className="form-group">
                    <label htmlFor="recipient">🛡️ To Fellow Adventurer:</label>
                    <select 
                        id="recipient"
                        value={selectedUserId} 
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="user-select"
                    >
                        <option value="">Choose thy correspondent...</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="message">📜 Your Message:</label>
                    <textarea
                        id="message"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Pen your words of wisdom, adventure, or fellowship..."
                        className="message-textarea"
                        rows="4"
                    />
                </div>

                <div className="form-buttons">
                    <button type="button" onClick={closeModal} className="cancel-button">
                        Abandon Quest
                    </button>
                    <button type="submit" className="send-button">
                        Send Missive
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewMessageModal;
