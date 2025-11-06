import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
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
import ProtectedRoute from "./components/admin/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          
          {/* Static Pages */}
          <Route path="/about" element={<StaticPage />} />
          <Route path="/contact" element={<StaticPage />} />
          <Route path="/privacy" element={<StaticPage />} />
          <Route path="/terms" element={<StaticPage />} />
          <Route path="/:slug" element={<StaticPage />} />
          
          {/* Auth Routes */}
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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
