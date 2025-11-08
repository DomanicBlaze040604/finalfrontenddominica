import { Suspense } from 'react';
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import { BreakingNewsBanner } from "@/components/BreakingNewsBanner";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components
import { lazy } from 'react';

const LatestNews = lazy(() => import("@/components/LatestNews"));
const FeaturedStory = lazy(() => import("@/components/FeaturedStory"));

const SafeIndex = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BreakingNewsBanner />
      <Header />
      <main className="flex-1">
        <SearchBar />
        
        <Suspense fallback={
          <section className="container mx-auto px-4 py-8">
            <Skeleton className="w-48 h-8 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="w-full h-[350px] rounded-lg" />
              ))}
            </div>
          </section>
        }>
          <LatestNews />
        </Suspense>
        
        <Suspense fallback={
          <section className="container mx-auto px-4 py-8">
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </section>
        }>
          <FeaturedStory />
        </Suspense>

        {/* Removed category sections temporarily to isolate crash */}
      </main>
      <Footer />
    </div>
  );
};

export default SafeIndex;
