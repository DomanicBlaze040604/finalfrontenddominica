import { Search } from "lucide-react";
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

  return <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar with centered logo */}
        <div className="flex items-center justify-between py-6 md:py-8">
          {/* Left spacer for balance */}
          <div className="flex items-center gap-2 w-32 md:w-48">
            <Button variant="ghost" size="icon" className="hover-scale">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          
          {/* Centered Logo */}
          <Link to="/" className="group flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Dominica News" 
              className="h-20 md:h-28 w-auto transition-all duration-300 group-hover:scale-105"
            />
          </Link>
          
          {/* Right buttons */}
          <div className="flex items-center gap-2 w-32 md:w-48 justify-end">
            <Link to="/register">
              <Button variant="default" size="sm" className="hidden sm:inline-flex hover-scale">
                Register
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover-scale">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center gap-1 border-t border-border overflow-x-auto">
          <Link 
            to="/" 
            className={`px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 ${
              location.pathname === '/' 
                ? 'border-primary' 
                : 'border-transparent hover:border-primary'
            } hover:bg-primary/5`}
          >
            Home
          </Link>
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.slug}`}
              className={`px-4 py-3 text-sm font-medium hover:text-primary transition-all duration-300 border-b-2 whitespace-nowrap ${
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