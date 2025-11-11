import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";

const Header = () => {
  const location = useLocation();
  
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