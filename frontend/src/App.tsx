import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
import ManagerProjectBudgetPage from "./pages/manager/finance/ManagerProjectBudgetPage";
import ManagerCostApprovalPage from "./pages/manager/finance/ManagerCostApprovalPage";
import ManagerExpenseReportPage from "./pages/manager/finance/ManagerExpenseReportPage";
import ManagerPaymentPage from "./pages/manager/finance/ManagerPaymentPage";

// Reviewer Pages
import ReviewerDashboard from './pages/reviewer/ReviewerDashboard';
import ReviewQueuePage from './pages/reviewer/ReviewQueuePage';
import ReviewDetailPage from './pages/reviewer/ReviewDetailPage';
import QualityReportPage from './pages/reviewer/QualityReportPage';
import ReviewerEarningsPage from "./pages/reviewer/ReviewerEarningsPage";

// Annotator Pages
import AnnotatorReturnedTasksPage from "./pages/annotator/AnnotatorReturnedTasksPage";
import AnnotatorReworkPage from "./pages/annotator/AnnotatorReworkPage";
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/manager/projects/create" element={<ManagerCreateProjectPage />} />
        <Route path="/manager/projects" element={<ManagerProjectListPage />} />
        <Route path="/manager/projects/:projectId" element={<ManagerProjectDetailPage />} />
        <Route path="/manager/datasets" element={<ManagerDatasetListPage />} />
        <Route path="/manager/datasets/upload" element={<ManagerUploadDatasetPage />} />
        <Route path="/manager/datasets/:datasetId" element={<ManagerDatasetDetailPage />} />
        <Route path="/manager/label-config" element={<ManagerLabelManagementPage />} />
        <Route path="/manager/guidelines" element={<ManagerGuidelinePage />} />
        <Route path="/manager/tasks/create" element={<ManagerCreateTaskPage />} />
        <Route path="/reviewer" element={<ReviewerDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/admin/users/reset-password" element={<AdminResetUserPasswordPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/review" element={<ReviewQueuePage />} />
        <Route path="/review/:id" element={<ReviewDetailPage />} />
        <Route path="/quality-report" element={<QualityReportPage />} />
        <Route path="/annotator/returned" element={<AnnotatorReturnedTasksPage />} />
        <Route path="/annotator/rework/:id" element={<AnnotatorReworkPage />} />
        <Route path="/manager/budget" element={<ManagerProjectBudgetPage />} />
        <Route path="/manager/approve-cost" element={<ManagerCostApprovalPage />} />
        <Route path="/manager/expense-report" element={<ManagerExpenseReportPage />} />
        <Route path="/manager/payment" element={<ManagerPaymentPage />} />
        <Route path="/annotator/earnings" element={<AnnotatorEarningsPage />} />
        <Route path="/reviewer/earnings" element={<ReviewerEarningsPage />} />
        <Route path="/admin/workforce-payment" element={<AdminWorkforcePaymentPage />} />
        <Route path="/admin/dispute" element={<AdminDisputePage />} />
        <Route path="/admin/system-config" element={<AdminSystemConfigPage />} />
        <Route path="/admin/system-health" element={<AdminSystemHealthPage />} />
        <Route path="/admin/logs" element={<AdminLogsPage />} />
        <Route path="/admin/payment-verification" element={<AdminPaymentVerificationPage />} />
        <Route path="/annotator/ai-label" element={<AnnotatorAILabelPage />} />
        <Route path="/annotator/ai-label/:id" element={<AnnotatorAILabelPage />} />
        <Route path="/annotator/tasks" element={<AnnotatorTaskListPage />} />
        <Route path="/annotator/task/:taskId" element={<AnnotatorTaskDetailPage />} />
        <Route path="/annotator/task/:taskId/label" element={<AnnotatorLabelingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
