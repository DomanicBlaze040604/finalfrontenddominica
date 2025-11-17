import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi, settingsApi } from "@/lib/api";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FeaturedStory from "@/components/FeaturedStory";
import LatestNews from "@/components/LatestNews";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import { BreakingNewsBanner } from "@/components/BreakingNewsBanner";
import BreakingNewsPanel from "@/components/BreakingNewsPanel";
import LiveUpdatesWidget from "@/components/LiveUpdatesWidget";
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

  // Fetch site settings for section ordering
  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get(),
    retry: 1,
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
  
  // Get homepage categories from settings (with order)
  const homepageCategories = settingsData?.success && settingsData.data?.homepageCategories
    ? settingsData.data.homepageCategories
    : categories.slice(0, 3).map((cat: any) => cat.id); // Default: first 3 categories

  console.log('🏠 Homepage settings:', {
    settingsLoaded: !!settingsData,
    settingsSuccess: settingsData?.success,
    homepageCategories: settingsData?.data?.homepageCategories,
    allCategories: categories.map((c: any) => ({ id: c.id, name: c.name })),
    selectedCategories: homepageCategories
  });

  // Filter and order categories based on settings
  const displayCategories = homepageCategories
    .map((catId: string) => categories.find((cat: any) => cat.id === catId))
    .filter((cat: any) => cat !== undefined);
  
  console.log('🏠 Display categories:', displayCategories.map((c: any) => c?.name));

  // Get section order from settings
  let sectionOrder: string[] = ['live-news', 'breaking-news', 'latest', 'featured'];
  if (settingsData?.success && settingsData.data?.homepageSectionOrder) {
    if (Array.isArray(settingsData.data.homepageSectionOrder)) {
      sectionOrder = settingsData.data.homepageSectionOrder;
    } else {
      // Handle old format
      const oldOrder = settingsData.data.homepageSectionOrder;
      if (oldOrder === 'latest-first') {
        sectionOrder = ['live-news', 'breaking-news', 'latest', 'featured'];
      } else {
        sectionOrder = ['live-news', 'breaking-news', 'featured', 'latest'];
      }
    }
  }

  // Get visibility settings (default: all visible)
  const showLiveNews = settingsData?.success && settingsData.data?.showLiveNewsOnHomepage !== undefined
    ? settingsData.data.showLiveNewsOnHomepage
    : true;
  const showBreakingNews = settingsData?.success && settingsData.data?.showBreakingNewsOnHomepage !== undefined
    ? settingsData.data.showBreakingNewsOnHomepage
    : true;
  const showFeaturedNews = settingsData?.success && settingsData.data?.showFeaturedNewsOnHomepage !== undefined
    ? settingsData.data.showFeaturedNewsOnHomepage
    : true;
  const showLatestNews = settingsData?.success && settingsData.data?.showLatestNewsOnHomepage !== undefined
    ? settingsData.data.showLatestNewsOnHomepage
    : true;

  // Define section components
  const sectionComponents: Record<string, JSX.Element | null> = {
    'live-news': showLiveNews ? (
      <SafeComponent componentName="LiveUpdatesWidget">
        <LiveUpdatesWidget />
      </SafeComponent>
    ) : null,
    'breaking-news': showBreakingNews ? (
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
          <SafeComponent componentName="BreakingNewsPanel">
            <BreakingNewsPanel />
          </SafeComponent>
        </div>
      </div>
    ) : null,
    'latest': showLatestNews ? (
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-3 md:px-4 py-8 md:py-12">
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
    ) : null,
    'featured': showFeaturedNews ? (
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-3 md:px-4 py-8 md:py-12">
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
    ) : null,
  };

  // Render sections based on order
  const renderMainSections = () => {
    return sectionOrder.map((sectionId) => {
      const section = sectionComponents[sectionId];
      return section ? <div key={sectionId}>{section}</div> : null;
    });
  };

  // Render category sections based on admin settings
  const renderCategorySections = () => {
    if (!displayCategories || displayCategories.length === 0) return null;

    return displayCategories.map((category: any, index: number) => {
      if (!category || !category.id || !category.slug) {
        console.warn('Invalid category data:', category);
        return null;
      }
      return (
        <div 
          key={category.id} 
          className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
        >
          <div className="container mx-auto px-3 md:px-4 py-8 md:py-12">
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
    });
  };

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
        <div className="bg-gray-50 border-b border-gray-200 py-4 md:py-6">
          <SafeComponent componentName="SearchBar">
            <SearchBar />
          </SafeComponent>
        </div>

        {/* All Sections - Order controlled by admin settings */}
        {renderMainSections()}

        {/* Category Sections - Controlled by admin settings */}
        {renderCategorySections()}
      </main>
      
      <SafeComponent componentName="Footer">
        <Footer />
      </SafeComponent>
    </div>
  );
};

export default Index;
