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
import BreakingNewsPanel from "@/components/BreakingNewsPanel";
import { SafeComponent } from "@/components/SafeComponent";

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
    <div className="min-h-screen flex flex-col bg-white">
      <SafeComponent componentName="BreakingNewsBanner">
        <BreakingNewsBanner />
      </SafeComponent>
      
      <SafeComponent componentName="Header">
        <Header />
      </SafeComponent>
      
      <main className="flex-1">
        {/* Search Bar - Minimal and Clean */}
        <div className="bg-gray-50 border-b border-gray-200 py-6">
          <SafeComponent componentName="SearchBar">
            <SearchBar />
          </SafeComponent>
        </div>

        {/* Breaking News Panel - Prominent but Clean */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <SafeComponent componentName="BreakingNewsPanel">
              <BreakingNewsPanel />
            </SafeComponent>
          </div>
        </div>
        
        {/* Latest News - Grid Layout */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <div 
              ref={latestNewsObserver.ref}
              className={`section-fade-in ${latestNewsObserver.isVisible ? 'visible' : ''}`}
            >
              <SafeComponent componentName="LatestNews">
                <LatestNews />
              </SafeComponent>
            </div>
          </div>
        </div>

        {/* Featured Story - Hero Section */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <div 
              ref={featuredObserver.ref}
              className={`section-fade-in ${featuredObserver.isVisible ? 'visible' : ''}`}
            >
              <SafeComponent componentName="FeaturedStory">
                <FeaturedStory />
              </SafeComponent>
            </div>
          </div>
        </div>

        {/* Category Sections - Clean Separation */}
        {topCategories && topCategories.length > 0 && topCategories.map((category, index) => {
          if (!category || !category.id || !category.slug) {
            console.warn('Invalid category data:', category);
            return null;
          }
          return (
            <div 
              key={category.id} 
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
            >
              <div className="container mx-auto px-4 py-12">
                <SafeComponent componentName={`CategorySection-${category.slug}`}>
                  <CategorySection
                    categorySlug={category.slug}
                    categoryName={category.name || 'Uncategorized'}
                    categoryColor={category.color || '#000000'}
                    limit={4}
                  />
                </SafeComponent>
              </div>
            </div>
          );
        })}
      </main>
      
      <SafeComponent componentName="Footer">
        <Footer />
      </SafeComponent>
    </div>
  );
};

export default Index;
