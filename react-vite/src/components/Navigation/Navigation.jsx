import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import NewMessageModal from "../NewMessage";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const location = useLocation();
  
  // Don't show the new message button if we're already on the messages page
  const isOnMessagesPage = location.pathname === '/messages';

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">🏠 Home</NavLink>
        </li>

        {sessionUser && (
          <li>
            <NavLink to="/messages" className="messages-link">Messages</NavLink>
          </li>
        )}

        {sessionUser && (
          <li>
            <NavLink to="/quests" className="quests-link">🏰 Quests</NavLink>
          </li>
        )}

        {sessionUser && !isOnMessagesPage && (
          <li>
            <OpenModalButton
              buttonText="New Message"
              modalComponent={<NewMessageModal />}
              className="new-message-button"
            />
          </li>
        )}

        <li>
          <ProfileButton />
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
