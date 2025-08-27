// Action Types
const GET_MESSAGES = 'messages/GET_MESSAGES';
const GET_CONVERSATIONS = 'messages/GET_CONVERSATIONS';
const GET_CONVERSATION = 'messages/GET_CONVERSATION';
const SEND_MESSAGE = 'messages/SEND_MESSAGE';
const MARK_MESSAGE_READ = 'messages/MARK_MESSAGE_READ';
const DELETE_MESSAGE = 'messages/DELETE_MESSAGE';
const GET_UNREAD_COUNT = 'messages/GET_UNREAD_COUNT';
const CLEAR_MESSAGES = 'messages/CLEAR_MESSAGES';

// Action Creators
const getMessages = (messages) => ({
    type: GET_MESSAGES,
    payload: messages
});

const getConversations = (conversations) => ({
    type: GET_CONVERSATIONS,
    payload: conversations
});

const getConversation = (messages) => ({
    type: GET_CONVERSATION,
    payload: messages
});

const sendMessage = (message) => ({
    type: SEND_MESSAGE,
    payload: message
});

const markMessageRead = (message) => ({
    type: MARK_MESSAGE_READ,
    payload: message
});

const deleteMessage = (messageId) => ({
    type: DELETE_MESSAGE,
    payload: messageId
});

const getUnreadCount = (count) => ({
    type: GET_UNREAD_COUNT,
    payload: count
});

const clearMessages = () => ({
    type: CLEAR_MESSAGES
});

// Thunks
export const fetchMessages = () => async (dispatch) => {
    const response = await fetch('/api/messages/', {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getMessages(data.messages));
        return data.messages;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const fetchConversations = () => async (dispatch) => {
    const response = await fetch('/api/messages/conversations', {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getConversations(data.conversations));
        return data.conversations;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const fetchConversation = (userId) => async (dispatch) => {
    const response = await fetch(`/api/messages/conversation/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getConversation(data.messages));
        return data.messages;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const createMessage = (messageData) => async (dispatch) => {
    const response = await fetch('/api/messages/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(sendMessage(data));
        return data;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const markAsRead = (messageId) => async (dispatch) => {
    const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(markMessageRead(data));
        return data;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const removeMessage = (messageId) => async (dispatch) => {
    const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        dispatch(deleteMessage(messageId));
        return { message: 'Message deleted successfully' };
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const fetchUnreadCount = () => async (dispatch) => {
    const response = await fetch('/api/messages/unread-count', {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getUnreadCount(data.unread_count));
        return data.unread_count;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const clearAllMessages = () => (dispatch) => {
    dispatch(clearMessages());
};

// Initial State
const initialState = {
    allMessages: {},
    conversations: {},
    currentConversation: [],
    unreadCount: 0
};

// Reducer
const messagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_MESSAGES: {
            const newState = { ...state };
            newState.allMessages = {};
            action.payload.forEach(message => {
                newState.allMessages[message.id] = message;
            });
            return newState;
        }
        case GET_CONVERSATIONS: {
            const newState = { ...state };
            newState.conversations = {};
            action.payload.forEach(conversation => {
                newState.conversations[conversation.user.id] = conversation;
            });
            return newState;
        }
        case GET_CONVERSATION: {
            const newState = { ...state };
            newState.currentConversation = action.payload;
            return newState;
        }
        case SEND_MESSAGE: {
            const newState = { ...state };
            newState.allMessages[action.payload.id] = action.payload;
            newState.currentConversation = [...newState.currentConversation, action.payload];
            return newState;
        }
        case MARK_MESSAGE_READ: {
            const newState = { ...state };
            if (newState.allMessages[action.payload.id]) {
                newState.allMessages[action.payload.id] = action.payload;
            }
            newState.currentConversation = newState.currentConversation.map(message =>
                message.id === action.payload.id ? action.payload : message
            );
            return newState;
        }
        case DELETE_MESSAGE: {
            const newState = { ...state };
            delete newState.allMessages[action.payload];
            newState.currentConversation = newState.currentConversation.filter(
                message => message.id !== action.payload
            );
            return newState;
        }
        case GET_UNREAD_COUNT: {
            const newState = { ...state };
            newState.unreadCount = action.payload;
            return newState;
        }
        case CLEAR_MESSAGES: {
            return initialState;
        }
        default:
            return state;
    }
};

export default messagesReducer;
