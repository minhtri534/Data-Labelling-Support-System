import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

// Manager Pages
import ManagerCreateProjectPage from './pages/manager/projects/ManagerCreateProjectPage';
import ManagerProjectListPage from './pages/manager/projects/ManagerProjectListPage';
import ManagerProjectDetailPage from './pages/manager/projects/ManagerProjectDetailPage';
import ManagerUploadDatasetPage from './pages/manager/datasets/ManagerUploadDatasetPage';
import ManagerDatasetListPage from './pages/manager/datasets/ManagerDatasetListPage';
import ManagerDatasetDetailPage from './pages/manager/datasets/ManagerDatasetDetailPage';
import ManagerLabelManagementPage from './pages/manager/labels/ManagerLabelManagementPage';
import ManagerGuidelinePage from './pages/manager/labels/ManagerGuidelinePage';
import ManagerCreateTaskPage from './pages/manager/tasks/ManagerCreateTaskPage';

// Reviewer Pages
import ReviewerDashboard from './pages/reviewer/ReviewerDashboard';
import ReviewQueuePage from './pages/reviewer/ReviewQueuePage';
import ReviewDetailPage from './pages/reviewer/ReviewDetailPage';
import QualityReportPage from './pages/reviewer/QualityReportPage';
import ReviewerEarningsPage from "./pages/reviewer/ReviewerEarningsPage";

// Annotator Pages
import AnnotatorReturnedTasksPage from "./pages/annotator/AnnotatorReturnedTasksPage";
import AnnotatorEarningsPage from "./pages/annotator/AnnotatorEarningsPage";
import AnnotatorAILabelPage from "./pages/annotator/AnnotatorAILabelPage";
import AnnotatorTaskListPage from "./pages/annotator/AnnotatorTaskListPage";
import AnnotatorTaskDetailPage from "./pages/annotator/AnnotatorTaskDetailPage";
import AnnotatorLabelingPage from "./pages/annotator/AnnotatorLabelingPage";

// Admin Pages
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminWorkforcePaymentPage from "./pages/admin/AdminWorkforcePaymentPage";
import AdminDisputePage from "./pages/admin/AdminDisputePage";
import AdminSystemConfigPage from "./pages/admin/AdminSystemConfigPage";
import AdminSystemHealthPage from "./pages/admin/AdminSystemHealthPage";
import AdminLogsPage from "./pages/admin/AdminLogsPage";
import AdminPaymentVerificationPage from "./pages/admin/AdminPaymentVerificationPage";
import AdminResetUserPasswordPage from "./pages/admin/AdminResetUserPasswordPage";

// Common Pages
import ProfilePage from './pages/common/ProfilePage';
import NotificationsPage from './pages/common/NotificationsPage';


import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Common Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

        {/* Manager Routes */}
        <Route path="/manager/projects" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerProjectListPage /></ProtectedRoute>} />
        <Route path="/manager/projects/create" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerCreateProjectPage /></ProtectedRoute>} />
        <Route path="/manager/projects/:projectId" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerProjectDetailPage /></ProtectedRoute>} />
        <Route path="/manager/datasets" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerDatasetListPage /></ProtectedRoute>} />
        <Route path="/manager/datasets/upload" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerUploadDatasetPage /></ProtectedRoute>} />
        <Route path="/manager/datasets/:datasetId" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerDatasetDetailPage /></ProtectedRoute>} />
        <Route path="/manager/label-config" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerLabelManagementPage /></ProtectedRoute>} />
        <Route path="/manager/guidelines" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerGuidelinePage /></ProtectedRoute>} />
        <Route path="/manager/tasks/create" element={<ProtectedRoute allowedRoles={['manager', 'admin']}><ManagerCreateTaskPage /></ProtectedRoute>} />
        
        {/* Reviewer Routes */}
        <Route path="/reviewer" element={<ProtectedRoute allowedRoles={['reviewer', 'admin']}><ReviewerDashboard /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute allowedRoles={['reviewer', 'admin']}><ReviewQueuePage /></ProtectedRoute>} />
        <Route path="/review/:id" element={<ProtectedRoute allowedRoles={['reviewer', 'admin']}><ReviewDetailPage /></ProtectedRoute>} />
        <Route path="/quality-report" element={<ProtectedRoute allowedRoles={['reviewer', 'admin']}><QualityReportPage /></ProtectedRoute>} />
        <Route path="/reviewer/earnings" element={<ProtectedRoute allowedRoles={['reviewer', 'admin']}><ReviewerEarningsPage /></ProtectedRoute>} />

        {/* Annotator Routes */}
        <Route path="/annotator/tasks" element={<ProtectedRoute allowedRoles={['annotator', 'admin']}><AnnotatorTaskListPage /></ProtectedRoute>} />
        <Route path="/annotator/task/:taskId" element={<ProtectedRoute allowedRoles={['annotator', 'admin']}><AnnotatorTaskDetailPage /></ProtectedRoute>} />
        <Route path="/annotator/task/:taskId/label" element={<ProtectedRoute allowedRoles={['annotator', 'admin']}><AnnotatorLabelingPage /></ProtectedRoute>} />
        <Route path="/annotator/ai-label" element={<ProtectedRoute allowedRoles={['annotator', 'admin']}><AnnotatorAILabelPage /></ProtectedRoute>} />
        <Route path="/annotator/ai-label/:id" element={<ProtectedRoute allowedRoles={['annotator', 'admin']}><AnnotatorAILabelPage /></ProtectedRoute>} />
        <Route path="/annotator/returned" element={<ProtectedRoute allowedRoles={['annotator', 'admin']}><AnnotatorReturnedTasksPage /></ProtectedRoute>} />
        <Route path="/annotator/rework/:id" element={<ProtectedRoute allowedRoles={['annotator', 'admin']}><AnnotatorAILabelPage /></ProtectedRoute>} />
        <Route path="/annotator/earnings" element={<ProtectedRoute allowedRoles={['annotator', 'admin']}><AnnotatorEarningsPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUserManagement /></ProtectedRoute>} />
        <Route path="/admin/users/reset-password" element={<ProtectedRoute allowedRoles={['admin']}><AdminResetUserPasswordPage /></ProtectedRoute>} />
        <Route path="/admin/workforce-payment" element={<ProtectedRoute allowedRoles={['admin']}><AdminWorkforcePaymentPage /></ProtectedRoute>} />
        <Route path="/admin/dispute" element={<ProtectedRoute allowedRoles={['admin']}><AdminDisputePage /></ProtectedRoute>} />
        <Route path="/admin/system-config" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemConfigPage /></ProtectedRoute>} />
        <Route path="/admin/system-health" element={<ProtectedRoute allowedRoles={['admin']}><AdminSystemHealthPage /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminLogsPage /></ProtectedRoute>} />
        <Route path="/admin/payment-verification" element={<ProtectedRoute allowedRoles={['admin']}><AdminPaymentVerificationPage /></ProtectedRoute>} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
