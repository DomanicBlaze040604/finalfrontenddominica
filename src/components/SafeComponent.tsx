import { Component, ReactNode, ErrorInfo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * SafeComponent - Wraps any component with error boundary protection
 * Prevents crashes from propagating and shows user-friendly error messages
 */
export class SafeComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.componentName || 'component'}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive mb-1">
                  {this.props.componentName || 'Component'} Error
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This section couldn't load properly. You can try refreshing the page.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground">
                      Show error details
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="mt-3 gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh Page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Safe date formatter that never crashes
 */
export const safeFormatDate = (date: any, formatter: (d: Date) => string, fallback?: string): string => {
  try {
    if (!date) return fallback || 'N/A';
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return fallback || 'Invalid date';
    return formatter(dateObj);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return fallback || 'N/A';
  }
};

/**
 * Safe array accessor that never crashes
 */
export const safeArray = <T,>(data: any, fallback: T[] = []): T[] => {
  try {
    if (!data) return fallback;
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.success && data.data && Array.isArray(data.data)) return data.data;
    return fallback;
  } catch (error) {
    console.warn('Array access error:', error);
    return fallback;
  }
};

/**
 * Safe object accessor that never crashes
 */
export const safeGet = <T,>(obj: any, path: string, fallback?: T): T | undefined => {
  try {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result === null || result === undefined) return fallback;
      result = result[key];
    }
    return result ?? fallback;
  } catch (error) {
    console.warn('Object access error:', error);
    return fallback;
  }
};
