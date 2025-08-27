import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkLogin } from "../../redux/session";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import SignupModal from "../SignupModal";
import "./LoginModal.css";

function LoginModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="login-modal">
      <div className="modal-header">
        <h1 className="modal-title">🏰 Enter the Tavern</h1>
        <p className="modal-subtitle">Welcome back, adventurer!</p>
      </div>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="Enter your email"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            placeholder="Enter your password"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <button type="submit" className="submit-btn">
          ⚔️ Login
        </button>
        
        {errors.credential && (
          <p className="error-message">{errors.credential}</p>
        )}
      </form>
      
      <div className="modal-footer">
        <p className="switch-prompt">
          New to the realm?{" "}
          <OpenModalButton
            buttonText="Join the Guild"
            modalComponent={<SignupModal />}
            className="switch-link"
          />
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
