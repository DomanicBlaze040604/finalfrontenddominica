import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FeaturedStory from "@/components/FeaturedStory";
import LatestNews from "@/components/LatestNews";
import Footer from "@/components/Footer";
import { BreakingNewsBanner } from "@/components/BreakingNewsBanner";

const Index = () => {
  const latestNewsObserver = useIntersectionObserver({ threshold: 0.2 });
  const featuredObserver = useIntersectionObserver({ threshold: 0.2 });

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
