import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { useAuth } from "./contexts/AuthContext";
import ChatButton from "components/ChatButton";
import ChatbotWidget from "components/ChatbotWidget";

// Lazy-loaded components
const AuthenticationLoginRegister = lazy(() => import("pages/authentication-login-register"));
const PropertyListingsSearch = lazy(() => import("pages/property-listings-search"));
const PropertyDetailView = lazy(() => import("pages/property-detail-view"));
const HomeLandingPage = lazy(() => import("pages/home-landing-page"));
const SellerDashboard = lazy(() => import("pages/seller-dashboard"));
const BuyerDashboard = lazy(() => import("pages/buyer-dashboard"));
const AboutUsPage = lazy(() => import("pages/about-us"));
const ContactUsPage = lazy(() => import("pages/contact-us"));
const NotFound = lazy(() => import("pages/NotFound"));

// Footer Pages
const PrivacyPolicy = lazy(() => import("pages/privacy-policy"));
const TermsOfService = lazy(() => import("pages/terms-of-service"));
const CookiePolicy = lazy(() => import("pages/cookie-policy"));
const Disclaimer = lazy(() => import("pages/disclaimer"));
const HelpCenter = lazy(() => import("pages/help-center"));
const FAQPage = lazy(() => import("pages/faq"));
const LegalSupport = lazy(() => import("pages/legal-support"));
const CareersPage = lazy(() => import("pages/careers"));
const PressReleasesPage = lazy(() => import("pages/press-releases"));

// Legal Support Service Pages
const DocumentVerification = lazy(() => import("pages/legal-support/services/document-verification"));
const TitleSearch = lazy(() => import("pages/legal-support/services/title-search"));
const LegalConsultation = lazy(() => import("pages/legal-support/services/legal-consultation"));
const ContractReview = lazy(() => import("pages/legal-support/services/contract-review"));
const DisputeResolution = lazy(() => import("pages/legal-support/services/dispute-resolution"));
const ComplianceAssistance = lazy(() => import("pages/legal-support/services/compliance-assistance"));

// Seller Dashboard Sub-pages
const SellerProperties = lazy(() => import("pages/seller-dashboard/pages/Properties"));
const SellerAddProperty = lazy(() => import("pages/seller-dashboard/pages/AddProperty"));
const SellerAnalytics = lazy(() => import("pages/seller-dashboard/pages/Analytics"));
const SellerInquiries = lazy(() => import("pages/seller-dashboard/pages/Inquiries"));
const SellerProfile = lazy(() => import("pages/seller-dashboard/pages/Profile"));
const SellerSettings = lazy(() => import("pages/seller-dashboard/pages/Settings"));

// Admin Dashboard Pages
const AdminDashboard = lazy(() => import("pages/admin-dashboard"));
const AdminProperties = lazy(() => import("pages/admin-dashboard/pages/Properties"));
const AdminMessages = lazy(() => import("pages/admin-dashboard/pages/Messages"));
const AdminUsers = lazy(() => import("pages/admin-dashboard/pages/Users"));
const AdminApprovals = lazy(() => import("pages/admin-dashboard/pages/Approvals"));
const AdminAnalytics = lazy(() => import("pages/admin-dashboard/pages/Analytics"));
const AdminPressReleases = lazy(() => import("pages/admin-dashboard/pages/PressReleases"));
const AdminCareers = lazy(() => import("pages/admin-dashboard/pages/Careers"));
const AdminSettings = lazy(() => import("pages/admin-dashboard/pages/Settings"));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="text-muted-foreground font-medium animate-pulse text-sm uppercase tracking-widest">Agroland Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/authentication-login-register?mode=login" state={{ from: location }} replace />;
  }

  const storedRole = localStorage.getItem('userRole');
  const resolvedRole = userProfile?.role || user.user_metadata?.role || storedRole || null;

  if (allowedRoles.length > 0 && !allowedRoles.includes(resolvedRole)) {
    if (resolvedRole === 'buyer') return <Navigate to="/buyer-dashboard" replace />;
    if (resolvedRole === 'seller') return <Navigate to="/seller-dashboard" replace />;
    if (resolvedRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/home-landing-page" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, userProfile, loading, isPasswordRecovery } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode');

  if (isPasswordRecovery || mode === 'reset') return children;

  if (loading) return <PageLoader />;

  if (user) {
    const resolvedRole = userProfile?.role || user.user_metadata?.role || user.app_metadata?.role || localStorage.getItem('userRole') || 'buyer';
    if (resolvedRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (resolvedRole === 'buyer') return <Navigate to="/buyer-dashboard" replace />;
    if (resolvedRole === 'seller') return <Navigate to="/seller-dashboard" replace />;
    return <Navigate to="/home-landing-page" replace />;
  }

  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <RouterRoutes>
            <Route path="/" element={<Navigate to="/authentication-login-register" replace />} />
            <Route path="/home-landing-page" element={<HomeLandingPage />} />
            <Route path="/property-listings-search" element={<PropertyListingsSearch />} />
            <Route path="/property-detail-view" element={<PropertyDetailView />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/legal-support" element={<LegalSupport />} />
            <Route path="/legal-support/document-verification" element={<DocumentVerification />} />
            <Route path="/legal-support/title-search" element={<TitleSearch />} />
            <Route path="/legal-support/legal-consultation" element={<LegalConsultation />} />
            <Route path="/legal-support/contract-review" element={<ContractReview />} />
            <Route path="/legal-support/dispute-resolution" element={<DisputeResolution />} />
            <Route path="/legal-support/compliance-assistance" element={<ComplianceAssistance />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/press-releases" element={<PressReleasesPage />} />

            <Route
              path="/authentication-login-register"
              element={
                <PublicRoute>
                  <AuthenticationLoginRegister />
                </PublicRoute>
              }
            />

            <Route path="/seller-dashboard" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            }>
              <Route index element={<SellerProperties />} />
              <Route path="properties" element={<SellerProperties />} />
              <Route path="add-property" element={<SellerAddProperty />} />
              <Route path="analytics" element={<SellerAnalytics />} />
              <Route path="inquiries" element={<SellerInquiries />} />
              <Route path="profile" element={<SellerProfile />} />
              <Route path="settings" element={<SellerSettings />} />
            </Route>

            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }>
              <Route index element={<AdminProperties />} />
              <Route path="careers" element={<AdminCareers />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="approvals" element={<AdminApprovals />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="press-releases" element={<AdminPressReleases />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route
              path="/buyer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
        <ChatButton />
        <ChatbotWidget />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;