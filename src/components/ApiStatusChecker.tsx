import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

export function ApiStatusChecker({ children }: { children: React.ReactNode }) {
  const [showError, setShowError] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/health');
        return response;
      } catch (err) {
        console.error('API health check failed:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: 2000,
    refetchInterval: 60000, // Check every minute
  });

  useEffect(() => {
    if (error) {
      setShowError(true);
    } else if (data) {
      setShowError(false);
    }
  }, [error, data]);

  // Show loading state only on initial load
  if (isLoading && !data && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error banner if API is down but allow app to continue
  if (showError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Backend Connection Issue</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Unable to connect to the backend server. Some features may not work properly.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowError(false);
                refetch();
              }}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  // API is healthy
  return <>{children}</>;
}
