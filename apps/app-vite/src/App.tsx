import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { LandingPage } from './pages/LandingPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ChatPage } from './pages/ChatPage';
import { HistoryPage } from './pages/HistoryPage';
import { JournalPage } from './pages/JournalPage';
import { MoodPage } from './pages/MoodPage';
import { InsightsPage } from './pages/InsightsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { BillingPage } from './pages/BillingPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminArticlesPage } from './pages/AdminArticlesPage';
import { AdminModerationPage } from './pages/AdminModerationPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:slug" element={<ArticleDetailPage />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="chat" replace />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="mood" element={<MoodPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="billing" element={<BillingPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="articles" replace />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="articles" element={<AdminArticlesPage />} />
        <Route path="moderation" element={<AdminModerationPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
