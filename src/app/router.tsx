import { createHashRouter } from "react-router-dom";
import AppShell from "./AppShell";
import CalendarPage from "../pages/CalendarPage";
import EntryDetailPage from "../pages/EntryDetailPage";
import HistoryPage from "../pages/HistoryPage";
import SettingsPage from "../pages/SettingsPage";
import TodayPage from "../pages/TodayPage";

export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <TodayPage /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/calendar", element: <CalendarPage /> },
      { path: "/entry/:id", element: <EntryDetailPage /> },
      { path: "/settings", element: <SettingsPage /> }
    ]
  }
]);
