import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Import all homepage components
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import LatestNews from "@/components/LatestNews";
import FeaturedStory from "@/components/FeaturedStory";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import { BreakingNewsBanner } from "@/components/BreakingNewsBanner";

interface TestResult {
  component: string;
  status: 'pass' | 'fail' | 'testing';
  error?: string;
  timestamp: string;
}

const ComponentDiagnostic = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState('');

  const addResult = (component: string, status: 'pass' | 'fail' | 'testing', error?: string) => {
    setResults(prev => [...prev, {
      component,
      status,
      error,
      timestamp: new Date().toISOString()
    }]);
  };

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    // Test each component individually
    const components = [
      { name: 'BreakingNewsBanner', component: BreakingNewsBanner },
      { name: 'Header', component: Header },
      { name: 'SearchBar', component: SearchBar },
      { name: 'LatestNews', component: LatestNews },
      { name: 'FeaturedStory', component: FeaturedStory },
      { name: 'Footer', component: Footer },
    ];

    for (const comp of components) {
      setCurrentTest(comp.name);
      addResult(comp.name, 'testing');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setCurrentTest('All tests complete!');
  };

  const ErrorFallback = ({ error, componentName }: any) => {
    addResult(componentName, 'fail', error.message);
    return (
      <div className="p-4 bg-red-50 border-2 border-red-500 rounded">
        <h3 className="font-bold text-red-700">❌ {componentName} Failed</h3>
        <p className="text-sm text-red-600">{error.message}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🔍 Component Diagnostic</h1>
        <p className="text-gray-600 mb-8">Testing: {currentTest}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Test Results</h2>
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.status === 'pass' ? 'bg-green-50 border-green-500' :
                  result.status === 'fail' ? 'bg-red-50 border-red-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{result.component}</h3>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    result.status === 'pass' ? 'bg-green-500 text-white' :
                    result.status === 'fail' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                {result.error && (
                  <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto">
                    {result.error}
                  </pre>
                )}
              </div>
            ))}
          </div>

          {/* Live Component Tests */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Live Component Renders</h2>

            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold mb-2">1. BreakingNewsBanner</h3>
              <ErrorBoundary
                FallbackComponent={(props) => <ErrorFallback {...props} componentName="BreakingNewsBanner" />}
                onError={(error) => addResult('BreakingNewsBanner', 'fail', error.message)}
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
                onError={(error) => addResult('Header', 'fail', error.message)}
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
                onError={(error) => addResult('SearchBar', 'fail', error.message)}
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
                onError={(error) => addResult('LatestNews', 'fail', error.message)}
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
                onError={(error) => addResult('FeaturedStory', 'fail', error.message)}
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
                onError={(error) => addResult('CategorySection', 'fail', error.message)}
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
                onError={(error) => addResult('Footer', 'fail', error.message)}
              >
                <div className="scale-75 origin-top-left">
                  <Footer />
                </div>
              </ErrorBoundary>
            </div>
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
