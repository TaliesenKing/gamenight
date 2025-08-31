import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginModal from "../LoginModal";
import SignupModal from "../SignupModal";
import './ProfileButton.css';

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <div className="profile-button-container">
      <button onClick={toggleMenu} className="profile-button" title="⚔️ Adventurer Menu">
        <FaUserCircle />
      </button>
      {showMenu && (
        <ul className="profile-dropdown" ref={ulRef}>
          {user ? (
            <>
              <li>
                <span className="user-info">🏰 {user.username}</span>
              </li>
              <li>
                <span className="user-email">{user.email}</span>
              </li>
              <li>
                <button onClick={logout} className="logout-button">
                  Leave the Tavern
                </button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="🏰 Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginModal />}
              />
              <OpenModalMenuItem
                itemText="📜 Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupModal />}
              />
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
