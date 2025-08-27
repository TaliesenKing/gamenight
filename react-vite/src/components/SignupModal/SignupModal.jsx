import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkSignup } from "../../redux/session";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import LoginModal from "../LoginModal";
import "./SignupModal.css";

function SignupModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
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
    <div className="signup-modal">
      <div className="modal-header">
        <h1 className="modal-title">📜 Join the Guild</h1>
        <p className="modal-subtitle">Begin your epic adventure!</p>
      </div>
      
      <form onSubmit={handleSubmit} className="signup-form">
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
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
            placeholder="Choose your adventurer name"
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
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
            placeholder="Create a strong password"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-input"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" className="submit-btn">
          🌟 Create Account
        </button>
      </form>
      
      <div className="modal-footer">
        <p className="switch-prompt">
          Already have an account?{" "}
          <OpenModalButton
            buttonText="Enter the Tavern"
            modalComponent={<LoginModal />}
            className="switch-link"
          />
        </p>
      </div>
    </div>
  );
}

export default SignupModal;
