import { Navigate, useLocation } from "react-router-dom";
import { authService } from "@/lib/api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = authService.getToken();
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const canAccessAdmin = authService.canAccessAdmin();
  const userRole = authService.getUserRole();

  console.log('🔐 ProtectedRoute check:', { 
    path: location.pathname,
    token: token ? token.substring(0, 20) + '...' : 'missing',
    user: user ? user.email : 'missing',
    isAuthenticated, 
    isAdmin, 
    canAccessAdmin, 
    userRole,
    requireAdmin
  });

  if (!isAuthenticated) {
    console.log('🔐 Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // If route requires strict admin access (like User Management)
  if (requireAdmin && !isAdmin) {
    console.log('🔐 Requires admin but user is not admin, redirecting');
    return <Navigate to="/admin" replace />;
  }

  // For general admin panel access, allow both admin and editor
  if (!requireAdmin && !canAccessAdmin) {
    console.log('🔐 User cannot access admin panel, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('🔐 Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;