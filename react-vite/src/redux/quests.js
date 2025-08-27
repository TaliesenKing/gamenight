// Action Types
const LOAD_QUESTS = 'quests/LOAD_QUESTS';
const LOAD_TUTORIAL_QUESTS = 'quests/LOAD_TUTORIAL_QUESTS';
const UPDATE_QUEST_PROGRESS = 'quests/UPDATE_QUEST_PROGRESS';
const COMPLETE_QUEST = 'quests/COMPLETE_QUEST';
const LOAD_QUEST_STATS = 'quests/LOAD_QUEST_STATS';
const LOAD_LEADERBOARD = 'quests/LOAD_LEADERBOARD';

// Action Creators
const loadQuests = (quests) => ({
    type: LOAD_QUESTS,
    payload: quests
});

const loadTutorialQuests = (quests) => ({
    type: LOAD_TUTORIAL_QUESTS,
    payload: quests
});

const updateQuestProgress = (questData) => ({
    type: UPDATE_QUEST_PROGRESS,
    payload: questData
});

const completeQuest = (questData) => ({
    type: COMPLETE_QUEST,
    payload: questData
});

const loadQuestStats = (stats) => ({
    type: LOAD_QUEST_STATS,
    payload: stats
});

const loadLeaderboard = (leaderboard) => ({
    type: LOAD_LEADERBOARD,
    payload: leaderboard
});

// Thunk Actions
export const fetchUserQuests = () => async (dispatch) => {
    const response = await fetch('/api/quests/');
    
    if (response.ok) {
        const quests = await response.json();
        dispatch(loadQuests(quests));
        return quests;
    }
};

export const fetchTutorialQuests = () => async (dispatch) => {
    const response = await fetch('/api/quests/tutorial');
    
    if (response.ok) {
        const quests = await response.json();
        dispatch(loadTutorialQuests(quests));
        return quests;
    }
};

export const updateQuestProgressThunk = (questId) => async (dispatch) => {
    const response = await fetch(`/api/quests/${questId}/progress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (response.ok) {
        const questData = await response.json();
        dispatch(updateQuestProgress(questData));
        return questData;
    }
};

export const completeQuestThunk = (questId) => async (dispatch) => {
    const response = await fetch(`/api/quests/${questId}/complete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (response.ok) {
        const questData = await response.json();
        dispatch(completeQuest(questData));
        return questData;
    }
};

export const fetchQuestStats = () => async (dispatch) => {
    const response = await fetch('/api/quests/stats');
    
    if (response.ok) {
        const stats = await response.json();
        dispatch(loadQuestStats(stats));
        return stats;
    }
};

export const fetchLeaderboard = () => async (dispatch) => {
    const response = await fetch('/api/quests/leaderboard');
    
    if (response.ok) {
        const leaderboard = await response.json();
        dispatch(loadLeaderboard(leaderboard));
        return leaderboard;
    }
};

// Initial State
const initialState = {
    allQuests: {},
    tutorialQuests: {},
    stats: null,
    leaderboard: []
};

// Reducer
export default function questsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_QUESTS: {
            const allQuests = {};
            action.payload.forEach(quest => {
                allQuests[quest.id] = quest;
            });
            return {
                ...state,
                allQuests
            };
        }
        
        case LOAD_TUTORIAL_QUESTS: {
            const tutorialQuests = {};
            action.payload.forEach(quest => {
                tutorialQuests[quest.id] = quest;
            });
            return {
                ...state,
                tutorialQuests
            };
        }
        
        case UPDATE_QUEST_PROGRESS: {
            const { quest, user_quest } = action.payload;
            const questId = quest.id;
            
            return {
                ...state,
                allQuests: {
                    ...state.allQuests,
                    [questId]: {
                        ...state.allQuests[questId],
                        user_quest
                    }
                },
                tutorialQuests: state.tutorialQuests[questId] ? {
                    ...state.tutorialQuests,
                    [questId]: {
                        ...state.tutorialQuests[questId],
                        user_quest
                    }
                } : state.tutorialQuests
            };
        }
        
        case COMPLETE_QUEST: {
            const { quest, user_quest } = action.payload;
            const questId = quest.id;
            
            return {
                ...state,
                allQuests: {
                    ...state.allQuests,
                    [questId]: {
                        ...state.allQuests[questId],
                        user_quest
                    }
                },
                tutorialQuests: state.tutorialQuests[questId] ? {
                    ...state.tutorialQuests,
                    [questId]: {
                        ...state.tutorialQuests[questId],
                        user_quest
                    }
                } : state.tutorialQuests
            };
        }
        
        case LOAD_QUEST_STATS: {
            return {
                ...state,
                stats: action.payload
            };
        }
        
        case LOAD_LEADERBOARD: {
            return {
                ...state,
                leaderboard: action.payload
            };
        }
        
        default:
            return state;
    }
}
