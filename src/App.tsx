import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary";
import { GoogleIntegration } from "./components/GoogleIntegration";
import Index from "./pages/Index";
import SafeIndex from "./pages/SafeIndex";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import StaticPage from "./pages/StaticPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPage from "./pages/AdminPage";
import ArticlesList from "./pages/admin/ArticlesList";
import CategoriesManager from "./pages/admin/CategoriesManager";
import PagesManager from "./pages/admin/PagesManager";
import BreakingNewsManager from "./pages/admin/BreakingNewsManager";
import SocialMediaManager from "./pages/admin/SocialMediaManager";
import AuthorsManager from "./pages/admin/AuthorsManager";
import TagsManager from "./pages/admin/TagsManager";
import MediaLibrary from "./pages/admin/MediaLibrary";
import ScheduleManager from "./pages/admin/ScheduleManager";
import SiteSettings from "./pages/admin/SiteSettings";
import Analytics from "./pages/admin/Analytics";
import RecycleBin from "./pages/admin/RecycleBin";
import CategoryArticles from "./pages/admin/CategoryArticles";
import LiveUpdatesManager from "./pages/admin/LiveUpdatesManager";
import LiveUpdatePage from "./pages/LiveUpdatePage";
import AuthorPage from "./pages/AuthorPage";
import EditorialPage from "./pages/EditorialPage";
import AuthTest from "./pages/admin/AuthTest";
import UsersManager from "./pages/admin/UsersManager";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { ApiStatusChecker } from "./components/ApiStatusChecker";
import DiagnosticPage from "./pages/DiagnosticPage";
import ComponentDiagnostic from "./pages/ComponentDiagnostic";
import { ScrollToTop } from "./components/ScrollToTop";

// Configure QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
    },
  },
});

// Google Analytics and Search Console IDs (these should come from settings API)
const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '';
const GOOGLE_SEARCH_CONSOLE_ID = import.meta.env.VITE_GOOGLE_SEARCH_CONSOLE_ID || '';

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GoogleIntegration 
            googleAnalyticsId={GOOGLE_ANALYTICS_ID}
            googleSearchConsoleId={GOOGLE_SEARCH_CONSOLE_ID}
          />
          <ApiStatusChecker>
            <BrowserRouter>
              <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/safe" element={<SafeIndex />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/component-test" element={<ComponentDiagnostic />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/author/:id" element={<AuthorPage />} />
          <Route path="/editorial" element={<EditorialPage />} />
          <Route path="/live/:id" element={<LiveUpdatePage />} />
          
          {/* Auth Routes - MUST BE BEFORE CATCH-ALL */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/articles" element={
            <ProtectedRoute>
              <ArticlesList />
            </ProtectedRoute>
          } />
          <Route path="/admin/articles/new" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/articles/edit/:id" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute>
              <CategoriesManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories/:slug/articles" element={
            <ProtectedRoute>
              <CategoryArticles />
            </ProtectedRoute>
          } />
          <Route path="/admin/pages" element={
            <ProtectedRoute>
              <PagesManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/breaking-news" element={
            <ProtectedRoute>
              <BreakingNewsManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/social-media" element={
            <ProtectedRoute>
              <SocialMediaManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/authors" element={
            <ProtectedRoute>
              <AuthorsManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/tags" element={
            <ProtectedRoute>
              <TagsManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/media" element={
            <ProtectedRoute>
              <MediaLibrary />
            </ProtectedRoute>
          } />
          <Route path="/admin/schedule" element={
            <ProtectedRoute>
              <ScheduleManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <SiteSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/recycle-bin" element={
            <ProtectedRoute>
              <RecycleBin />
            </ProtectedRoute>
          } />
          <Route path="/admin/live-updates" element={
            <ProtectedRoute>
              <LiveUpdatesManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/auth-test" element={
            <ProtectedRoute>
              <AuthTest />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UsersManager />
            </ProtectedRoute>
          } />
          
          {/* Static Pages - MUST BE AFTER ALL SPECIFIC ROUTES */}
          <Route path="/about" element={<StaticPage />} />
          <Route path="/contact" element={<StaticPage />} />
          <Route path="/privacy" element={<StaticPage />} />
          <Route path="/terms" element={<StaticPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "/:slug" AND "*" ROUTES */}
          <Route path="/:slug" element={<StaticPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
            </BrowserRouter>
          </ApiStatusChecker>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
