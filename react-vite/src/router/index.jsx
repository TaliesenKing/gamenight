import { createBrowserRouter } from 'react-router-dom';
import MessagesPage from '../components/Messages';
import QuestsPage from '../components/QuestsPage';
import LandingPage from '../components/LandingPage';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "messages",
        element: <MessagesPage />,
      },
      {
        path: "quests",
        element: <QuestsPage />,
      },
    ],
  },
]);