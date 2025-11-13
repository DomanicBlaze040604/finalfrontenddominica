import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";
import { authService } from "@/lib/api/auth";
import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const userData = authService.getUser();
      setIsAuthenticated(authenticated);
      setUser(userData);
    };
    
    checkAuth();
    
    // Check every second for auth changes
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };
  
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const categories = categoriesData?.success ? categoriesData.data : [];
  
  // Filter to show only pinned categories
  const pinnedCategories = categories.filter((cat: any) => cat.isPinned);

  return <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar with centered logo */}
        <div className="flex items-center justify-between py-3 sm:py-4 md:py-6 lg:py-8">
          {/* Left spacer for balance */}
          <div className="w-16 sm:w-24 md:w-32 lg:w-48"></div>
          
          {/* Centered Logo */}
          <Link to="/" className="group flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Dominica News" 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto transition-all duration-300 group-hover:scale-105"
            />
          </Link>
          
          {/* Right buttons */}
          <div className="flex items-center gap-1 sm:gap-2 w-16 sm:w-24 md:w-32 lg:w-48 justify-end">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover-scale">
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">{user.fullName || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {authService.canAccessAdmin() && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/register" className="hidden sm:inline-flex">
                  <Button variant="default" size="sm" className="hover-scale text-xs sm:text-sm">
                    Register
                  </Button>
                </Link>
                <Link to="/admin/login" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm" className="hover-scale text-xs sm:text-sm">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5 sm:gap-1 border-t border-border overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
          <Link 
            to="/" 
            className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 whitespace-nowrap flex-shrink-0 ${
              location.pathname === '/' 
                ? 'border-primary' 
                : 'border-transparent hover:border-primary'
            } hover:bg-primary/5`}
          >
            Home
          </Link>
          {pinnedCategories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.slug}`}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 whitespace-nowrap flex-shrink-0 ${
                location.pathname === `/category/${category.slug}` 
                  ? 'border-primary' 
                  : 'border-transparent hover:border-primary'
              } hover:bg-primary/5`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>;
};
export default Header;