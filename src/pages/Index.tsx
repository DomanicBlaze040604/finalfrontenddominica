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
  const { data: categoriesData, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    retry: 3,
    retryDelay: 1000,
  });

  // Handle errors gracefully
  if (categoriesError) {
    console.error('Failed to load categories:', categoriesError);
  }

  const categories = categoriesData?.success && Array.isArray(categoriesData.data) ? categoriesData.data : [];
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
        {topCategories.map((category) => (
          <CategorySection
            key={category.id}
            categorySlug={category.slug}
            categoryName={category.name}
            categoryColor={category.color}
            limit={4}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
