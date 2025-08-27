import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import LoginModal from '../LoginModal';
import SignupModal from '../SignupModal';
import AuthPromptModal from '../AuthPromptModal';
import './LandingPage.css';

function LandingPage() {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">⚔️ Welcome to GameNight ⚔️</h1>
          <p className="hero-subtitle">
            Gather your fellowship and embark on epic tabletop adventures
          </p>
          
          {!sessionUser ? (
            <div className="auth-buttons">
              <OpenModalButton
                buttonText="🏰 Enter the Tavern"
                modalComponent={<LoginModal />}
                className="btn btn-primary"
              />
              <OpenModalButton
                buttonText="📜 Join the Guild"
                modalComponent={<SignupModal />}
                className="btn btn-secondary"
              />
            </div>
          ) : (
            <div className="user-welcome">
              <h2 className="welcome-message">
                Welcome back, {sessionUser.username}! 🎲
              </h2>
              <div className="quick-actions">
                <Link to="/quests" className="btn btn-primary">
                  🏰 View Quests
                </Link>
                <Link to="/messages" className="btn btn-secondary">
                  📬 Messages
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2 className="features-title">⚡ Your Adventure Awaits ⚡</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎲</div>
            <h3>Host Game Nights</h3>
            <p>Organize epic tabletop gaming sessions with friends</p>
            {sessionUser ? (
              <button 
                onClick={() => navigate('/host')} 
                className="btn btn-feature"
              >
                🎲 Host a Game
              </button>
            ) : (
              <OpenModalButton
                buttonText="🎲 Host a Game"
                modalComponent={<AuthPromptModal action="host a game night" />}
                className="btn btn-feature"
              />
            )}
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📬</div>
            <h3>Message Fellow Adventurers</h3>
            <p>Connect with other players and plan your next quest</p>
            {sessionUser ? (
              <button 
                onClick={() => navigate('/messages')} 
                className="btn btn-feature"
              >
                📬 Send Messages
              </button>
            ) : (
              <OpenModalButton
                buttonText="📬 Send Messages"
                modalComponent={<AuthPromptModal action="send messages" />}
                className="btn btn-feature"
              />
            )}
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏰</div>
            <h3>Complete Quests</h3>
            <p>Earn XP and unlock achievements as you explore the platform</p>
            {sessionUser ? (
              <button 
                onClick={() => navigate('/quests')} 
                className="btn btn-feature"
              >
                🏰 View Quests
              </button>
            ) : (
              <OpenModalButton
                buttonText="🏰 View Quests"
                modalComponent={<AuthPromptModal action="complete quests" />}
                className="btn btn-feature"
              />
            )}
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚔️</div>
            <h3>Join Adventures</h3>
            <p>Discover and attend game nights hosted by the community</p>
            {sessionUser ? (
              <button 
                onClick={() => navigate('/browse')} 
                className="btn btn-feature"
              >
                ⚔️ Browse Games
              </button>
            ) : (
              <OpenModalButton
                buttonText="⚔️ Browse Games"
                modalComponent={<AuthPromptModal action="browse game nights" />}
                className="btn btn-feature"
              />
            )}
          </div>
        </div>
      </div>

      {!sessionUser && (
        <div className="cta-section">
          <h2 className="cta-title">Ready to Begin Your Quest?</h2>
          <p className="cta-subtitle">
            Join thousands of adventurers in the ultimate gaming community
          </p>
          <OpenModalButton
            buttonText="🌟 Start Your Adventure"
            modalComponent={<SignupModal />}
            className="btn btn-cta"
          />
        </div>
      )}
    </div>
  );
}

export default LandingPage;
