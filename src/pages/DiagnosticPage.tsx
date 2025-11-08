import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';

const DiagnosticPage = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [currentTest, setCurrentTest] = useState('Starting...');

  useEffect(() => {
    runDiagnostics();
  }, []);

  const addTest = (name: string, status: 'pass' | 'fail' | 'running', details?: any) => {
    setTests(prev => [...prev, { name, status, details, timestamp: new Date().toISOString() }]);
  };

  const runDiagnostics = async () => {
    try {
      // Test 1: Check if API client is configured
      setCurrentTest('Test 1: API Client Configuration');
      addTest('API Client Configuration', 'running');
      const apiUrl = import.meta.env.VITE_API_URL || 'https://web-production-af44.up.railway.app';
      addTest('API Client Configuration', 'pass', { apiUrl });

      // Test 2: Health check
      setCurrentTest('Test 2: Backend Health Check');
      addTest('Backend Health Check', 'running');
      try {
        const health = await apiClient.get('/api/health');
        addTest('Backend Health Check', 'pass', health);
      } catch (error: any) {
        addTest('Backend Health Check', 'fail', { 
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }

      // Test 3: Categories API
      setCurrentTest('Test 3: Categories API');
      addTest('Categories API', 'running');
      try {
        const categories = await apiClient.get('/api/categories');
        addTest('Categories API', 'pass', { count: categories.data?.length });
      } catch (error: any) {
        addTest('Categories API', 'fail', { 
          message: error.message,
          response: error.response?.data
        });
      }

      // Test 4: Articles API
      setCurrentTest('Test 4: Articles API');
      addTest('Articles API', 'running');
      try {
        const articles = await apiClient.get('/api/articles?limit=5&status=published');
        addTest('Articles API', 'pass', { count: articles.data?.length });
      } catch (error: any) {
        addTest('Articles API', 'fail', { 
          message: error.message,
          response: error.response?.data
        });
      }

      // Test 5: LocalStorage
      setCurrentTest('Test 5: LocalStorage');
      addTest('LocalStorage', 'running');
      try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        addTest('LocalStorage', value === 'value' ? 'pass' : 'fail');
      } catch (error: any) {
        addTest('LocalStorage', 'fail', { message: error.message });
      }

      // Test 6: Check for stored auth
      setCurrentTest('Test 6: Authentication State');
      addTest('Authentication State', 'running');
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      addTest('Authentication State', 'pass', { 
        hasToken: !!token,
        hasUser: !!user,
        tokenLength: token?.length || 0
      });

      setCurrentTest('All tests complete!');
    } catch (error: any) {
      addTest('Diagnostic Error', 'fail', { message: error.message, stack: error.stack });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🔍 Diagnostic Page</h1>
        <p className="text-gray-600 mb-8">Current Test: {currentTest}</p>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 ${
                test.status === 'pass' ? 'bg-green-50 border-green-500' :
                test.status === 'fail' ? 'bg-red-50 border-red-500' :
                'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{test.name}</h3>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  test.status === 'pass' ? 'bg-green-500 text-white' :
                  test.status === 'fail' ? 'bg-red-500 text-white' :
                  'bg-yellow-500 text-white'
                }`}>
                  {test.status.toUpperCase()}
                </span>
              </div>
              {test.details && (
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(test.details, null, 2)}
                </pre>
              )}
              <p className="text-xs text-gray-500 mt-2">{test.timestamp}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
          <h3 className="font-bold mb-2">Environment Info</h3>
          <pre className="text-xs">
            {JSON.stringify({
              userAgent: navigator.userAgent,
              language: navigator.language,
              online: navigator.onLine,
              cookieEnabled: navigator.cookieEnabled,
              url: window.location.href,
              origin: window.location.origin,
            }, null, 2)}
          </pre>
        </div>

        <div className="mt-4 flex gap-4">
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
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
