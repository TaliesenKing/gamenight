import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserQuests, fetchTutorialQuests, fetchQuestStats, updateQuestProgressThunk, completeQuestThunk } from '../../redux/quests';
import './QuestsPage.css';

function QuestsPage() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const { allQuests, tutorialQuests, stats } = useSelector(state => state.quests);
    const [activeTab, setActiveTab] = useState('tutorial');
    const [showCompleted, setShowCompleted] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserQuests());
            dispatch(fetchTutorialQuests());
            dispatch(fetchQuestStats());
        }
    }, [dispatch, user]);

    const handleQuestProgress = async (questId) => {
        await dispatch(updateQuestProgressThunk(questId));
        dispatch(fetchQuestStats()); // Refresh stats
    };

    const handleCompleteQuest = async (questId) => {
        await dispatch(completeQuestThunk(questId));
        dispatch(fetchQuestStats()); // Refresh stats
    };

    const renderQuestCard = (quest) => {
        const userQuest = quest.user_quest;
        const isCompleted = userQuest?.completed;
        const progress = userQuest?.current_progress || 0;
        const progressPercentage = (progress / quest.target_count) * 100;

        return (
            <div key={quest.id} className={`quest-card ${isCompleted ? 'completed' : ''}`}>
                <div className="quest-header">
                    <h3 className="quest-title">{quest.title}</h3>
                    <div className="quest-reward">
                        <span className="reward-points">⚡ {quest.reward_points} XP</span>
                    </div>
                </div>
                
                <p className="quest-description">{quest.description}</p>
                
                <div className="quest-progress">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">
                        {progress} / {quest.target_count}
                    </span>
                </div>

                {isCompleted ? (
                    <div className="quest-completed">
                        <span className="completed-icon">✅</span>
                        <span>Quest Completed!</span>
                        {userQuest.completed_at && (
                            <span className="completed-date">
                                Completed: {new Date(userQuest.completed_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="quest-actions">
                        {progress < quest.target_count && (
                            <button 
                                className="progress-btn"
                                onClick={() => handleQuestProgress(quest.id)}
                            >
                                Update Progress
                            </button>
                        )}
                        {progress >= quest.target_count && (
                            <button 
                                className="complete-btn"
                                onClick={() => handleCompleteQuest(quest.id)}
                            >
                                Complete Quest
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const filterQuests = (questsObj) => {
        return Object.values(questsObj).filter(quest => {
            if (showCompleted) return true;
            return !quest.user_quest?.completed;
        });
    };

    const currentQuests = activeTab === 'tutorial' ? tutorialQuests : allQuests;
    const displayQuests = filterQuests(currentQuests);

    return (
        <div className="quests-page">
            <div className="quests-header">
                <h1 className="page-title">🏰 Adventure Quests</h1>
                <p className="page-subtitle">Complete quests to earn experience and become a legendary adventurer!</p>
            </div>

            {stats && (
                <div className="quest-stats">
                    <div className="stat-card">
                        <h3>📊 Your Progress</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-label">Completed Quests</span>
                                <span className="stat-value">{stats.completed_quests} / {stats.total_quests}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Tutorial Progress</span>
                                <span className="stat-value">{stats.completed_tutorial_quests} / {stats.tutorial_quests}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Experience Points</span>
                                <span className="stat-value">⚡ {stats.earned_points} XP</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Completion Rate</span>
                                <span className="stat-value">{stats.completion_percentage}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="quest-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'tutorial' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tutorial')}
                >
                    📚 Tutorial Quests
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    ⚔️ All Quests
                </button>
            </div>

            <div className="quest-filters">
                <label className="filter-checkbox">
                    <input 
                        type="checkbox" 
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                    />
                    Show Completed Quests
                </label>
            </div>

            <div className="quests-container">
                {displayQuests.length > 0 ? (
                    displayQuests.map(renderQuestCard)
                ) : (
                    <div className="no-quests">
                        <p>{showCompleted ? 'No quests found.' : 'No active quests available. Great job completing everything!'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuestsPage;
