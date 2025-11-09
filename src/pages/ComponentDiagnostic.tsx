import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Import all homepage components
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import LatestNews from "@/components/LatestNews";
import FeaturedStory from "@/components/FeaturedStory";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import { BreakingNewsBanner } from "@/components/BreakingNewsBanner";

const ComponentDiagnostic = () => {
  const [currentTest] = useState('Rendering all components...');

  const ErrorFallback = ({ error, componentName }: any) => {
    return (
      <div className="p-4 bg-red-50 border-2 border-red-500 rounded">
        <h3 className="font-bold text-red-700">❌ {componentName} Failed</h3>
        <p className="text-sm text-red-600">{error.message}</p>
        <pre className="text-xs mt-2 overflow-auto">{error.stack}</pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🔍 Component Diagnostic</h1>
        <p className="text-gray-600 mb-8">Testing: {currentTest}</p>

        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Live Component Renders</h2>
            <p className="text-sm text-gray-600 mb-6">
              Each component is wrapped in an error boundary. If a component crashes, you'll see a red error box.
            </p>

            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold mb-2">1. BreakingNewsBanner</h3>
              <ErrorBoundary
                FallbackComponent={(props) => <ErrorFallback {...props} componentName="BreakingNewsBanner" />}
              >
                <div className="scale-75 origin-top-left">
                  <BreakingNewsBanner />
                </div>
              </ErrorBoundary>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold mb-2">2. Header</h3>
              <ErrorBoundary
                FallbackComponent={(props) => <ErrorFallback {...props} componentName="Header" />}
              >
                <div className="scale-75 origin-top-left">
                  <Header />
                </div>
              </ErrorBoundary>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold mb-2">3. SearchBar</h3>
              <ErrorBoundary
                FallbackComponent={(props) => <ErrorFallback {...props} componentName="SearchBar" />}
              >
                <div className="scale-75 origin-top-left">
                  <SearchBar />
                </div>
              </ErrorBoundary>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold mb-2">4. LatestNews</h3>
              <ErrorBoundary
                FallbackComponent={(props) => <ErrorFallback {...props} componentName="LatestNews" />}
              >
                <div className="scale-50 origin-top-left h-64 overflow-hidden">
                  <LatestNews />
                </div>
              </ErrorBoundary>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold mb-2">5. FeaturedStory</h3>
              <ErrorBoundary
                FallbackComponent={(props) => <ErrorFallback {...props} componentName="FeaturedStory" />}
              >
                <div className="scale-50 origin-top-left h-64 overflow-hidden">
                  <FeaturedStory />
                </div>
              </ErrorBoundary>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold mb-2">6. CategorySection (News)</h3>
              <ErrorBoundary
                FallbackComponent={(props) => <ErrorFallback {...props} componentName="CategorySection" />}
              >
                <div className="scale-50 origin-top-left h-64 overflow-hidden">
                  <CategorySection 
                    categorySlug="news"
                    categoryName="News"
                    categoryColor="#3B82F6"
                    limit={4}
                  />
                </div>
              </ErrorBoundary>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold mb-2">7. Footer</h3>
              <ErrorBoundary
                FallbackComponent={(props) => <ErrorFallback {...props} componentName="Footer" />}
              >
                <div className="scale-75 origin-top-left">
                  <Footer />
                </div>
              </ErrorBoundary>
            </div>
          </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Homepage
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reload Tests
          </button>
          <button 
            onClick={() => window.location.href = '/diagnostic'}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            API Diagnostic
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentDiagnostic;
