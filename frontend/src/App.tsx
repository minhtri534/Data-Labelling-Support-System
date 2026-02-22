import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ReviewerDashboard from './pages/ReviewerDashboard';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AdminUserManagement from './pages/AdminUserManagement';
import ReviewQueuePage from './pages/ReviewQueuePage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import QualityReportPage from './pages/QualityReportPage';
import AnnotatorReturnedTasksPage from "./pages/AnnotatorReturnedTasksPage";
import AnnotatorReworkPage from "./pages/AnnotatorReworkPage";
import ManagerProjectBudgetPage from "./pages/ManagerProjectBudgetPage";
import ManagerCostApprovalPage from "./pages/ManagerCostApprovalPage";
import ManagerExpenseReportPage from "./pages/ManagerExpenseReportPage";
import ManagerPaymentPage from "./pages/ManagerPaymentPage";
import AnnotatorEarningsPage from "./pages/AnnotatorEarningsPage";
import ReviewerEarningsPage from "./pages/ReviewerEarningsPage";
import AdminWorkforcePaymentPage from "./pages/AdminWorkforcePaymentPage";
import AdminDisputePage from "./pages/AdminDisputePage";
import AdminSystemConfigPage from "./pages/AdminSystemConfigPage";
import AdminSystemHealthPage from "./pages/AdminSystemHealthPage";
import AdminLogsPage from "./pages/AdminLogsPage";
import AdminPaymentVerificationPage from "./pages/AdminPaymentVerificationPage";
import AnnotatorAILabelPage from "./pages/AnnotatorAILabelPage";

import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reviewer" element={<ReviewerDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
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

      </Routes>
    </Router>
  );
}

export default App;
