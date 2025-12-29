// src/router/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ========================================================================
   LAYOUTS
   ======================================================================== */
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

/* ========================================================================
   ROUTE GUARDS
   ======================================================================== */
import ProtectedRoute from "../components/UI/ProtectedRoute";
import AdminRoute from "../components/UI/AdminRoute";

/* ========================================================================
   AUTH PAGES
   ======================================================================== */
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordOTP from "../pages/auth/ForgotPasswordOTP";
import ResetPasswordOTP from "../pages/auth/ResetPasswordOTP";

/* ========================================================================
   USER DASHBOARD + USER PAGES
   ======================================================================== */
import UserDashboard from "../pages/user/UserDashboard";
import TicketPage from "../pages/user/TicketPage";
import CreateTicket from "../pages/user/CreateTicket";
import EditTicket from "../pages/user/EditTicket";
import TicketDetailsPage from "../pages/user/TicketDetailsPage";

// User account settings
import ChangePassword from "../pages/user/ChangePassword";
import ProfileSettings from "../pages/user/ProfileSettings";

/* ========================================================================
   ADMIN PAGES
   ======================================================================== */
import AdminDashboard from "../pages/admin/AdminDashboard";
import TicketsManagement from "../pages/admin/TicketsManagement";
import AdminTicketDetailsPage from "../pages/admin/AdminTicketDetailsPage";
import AdminEditTicket from "../pages/admin/AdminEditTicket";
import DepartmentsManagement from "../pages/admin/DepartmentsManagement";
import PrioritiesManagement from "../pages/admin/PrioritiesManagement";
import UserManagement from "../pages/admin/UserManagement";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminPanel from "../pages/admin/AdminPanel";


export default function AppRouter() {
  if (import.meta.env.DEV) {
    console.log("🚀 AppRouter loaded (DEV MODE)");
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================================
                              PUBLIC AUTH ROUTES
           ================================================================== */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* OTP Password Reset */}
          <Route path="/forgot-password" element={<ForgotPasswordOTP />} />
          <Route path="/reset-password" element={<ResetPasswordOTP />} />
        </Route>


        {/* ==================================================================
                         USER PROTECTED ROUTES (AUTH REQUIRED)
           ================================================================== */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Home */}
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Ticket Routes */}
          <Route path="/tickets" element={<TicketPage />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />
          <Route path="/tickets/:id/edit" element={<EditTicket />} />

          {/* User Settings */}
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
        </Route>


        {/* ==================================================================
                         ADMIN ROUTES (ADMIN PERMISSIONS ONLY)
           ================================================================== */}
        <Route
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          {/* Home / Summary */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Config & System Pages */}
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Ticket Management */}
          <Route path="/admin/tickets" element={<TicketsManagement />} />
          <Route path="/admin/tickets/:id" element={<AdminTicketDetailsPage />} />
          <Route path="/admin/tickets/:id/edit" element={<AdminEditTicket />} />

          {/* Admin Data Controls */}
          <Route path="/admin/departments" element={<DepartmentsManagement />} />
          <Route path="/admin/priorities" element={<PrioritiesManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>


        {/* ==================================================================
                               FALLBACK ROUTE
           ================================================================== */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
