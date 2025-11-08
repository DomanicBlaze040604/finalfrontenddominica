import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FeaturedStory from "@/components/FeaturedStory";
import LatestNews from "@/components/LatestNews";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import { BreakingNewsBanner } from "@/components/BreakingNewsBanner";

const Index = () => {
  const latestNewsObserver = useIntersectionObserver({ threshold: 0.2 });
  const featuredObserver = useIntersectionObserver({ threshold: 0.2 });

  // Fetch categories to display sections
  const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    retry: 1,
    retryDelay: 1000,
  });

  // Handle errors gracefully
  if (categoriesError) {
    console.error('Failed to load categories:', categoriesError);
  }

  // Safely extract categories with fallback
  let categories: any[] = [];
  try {
    if (categoriesData && typeof categoriesData === 'object') {
      if ('success' in categoriesData && categoriesData.success && 'data' in categoriesData) {
        categories = Array.isArray(categoriesData.data) ? categoriesData.data : [];
      } else if (Array.isArray(categoriesData)) {
        categories = categoriesData;
      }
    }
  } catch (error) {
    console.error('Error parsing categories:', error);
    categories = [];
  }
  
  // Show top 3 categories on homepage
  const topCategories = categories.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <BreakingNewsBanner />
      <Header />
      <main className="flex-1">
        <SearchBar />
        
        <div 
          ref={latestNewsObserver.ref}
          className={`section-fade-in ${latestNewsObserver.isVisible ? 'visible' : ''}`}
        >
          <LatestNews />
        </div>
        
        <div 
          ref={featuredObserver.ref}
          className={`section-fade-in ${featuredObserver.isVisible ? 'visible' : ''}`}
        >
          <FeaturedStory />
        </div>

        {/* Category Sections */}
        {topCategories && topCategories.length > 0 && topCategories.map((category) => {
          if (!category || !category.id || !category.slug) {
            console.warn('Invalid category data:', category);
            return null;
          }
          return (
            <CategorySection
              key={category.id}
              categorySlug={category.slug}
              categoryName={category.name || 'Uncategorized'}
              categoryColor={category.color || '#000000'}
              limit={4}
            />
          );
        })}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
