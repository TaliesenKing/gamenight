import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import LoginModal from "../LoginModal";
import SignupModal from "../SignupModal";
import "./AuthPromptModal.css";

function AuthPromptModal({ action = "continue" }) {
  const { closeModal } = useModal();

  return (
    <div className="auth-prompt-modal">
      <div className="modal-header">
        <h2 className="modal-title">🏰 Authentication Required</h2>
        <p className="modal-subtitle">
          You must be logged in to {action}. Please sign in or create an account to continue your adventure.
        </p>
      </div>
      
      <div className="auth-buttons">
        <OpenModalButton
          buttonText="🏰 Login"
          modalComponent={<LoginModal />}
          className="auth-btn login-btn"
          onModalClose={closeModal}
        />
        
        <OpenModalButton
          buttonText="📜 Sign Up"
          modalComponent={<SignupModal />}
          className="auth-btn signup-btn"
          onModalClose={closeModal}
        />
      </div>
      
      <div className="modal-footer">
        <button onClick={closeModal} className="cancel-btn">
          ← Return to Tavern
        </button>
      </div>
    </div>
  );
}

export default AuthPromptModal;
