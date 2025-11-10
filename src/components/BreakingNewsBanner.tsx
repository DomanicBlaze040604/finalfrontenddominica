import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { breakingNewsApi } from "@/lib/api";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BreakingNews {
  id: string;
  title: string;
  link?: string;
  priority: "high" | "medium" | "low";
}

export function BreakingNewsBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch active breaking news from API
  const { data, error } = useQuery({
    queryKey: ["breaking-news", "active"],
    queryFn: () => breakingNewsApi.getActive(),
    refetchInterval: 60000, // Refetch every minute
    retry: 1,
    retryDelay: 1000,
  });

  // Log errors but don't crash
  if (error) {
    console.warn('Failed to load breaking news:', error);
  }

  // Handle both single object and array responses
  let breakingNews: BreakingNews[] = [];
  if (data?.success && data.data) {
    if (Array.isArray(data.data)) {
      breakingNews = data.data;
    } else if (typeof data.data === 'object') {
      // Single breaking news item
      breakingNews = [data.data as BreakingNews];
    }
  }

  useEffect(() => {
    if (breakingNews.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  // Early return if no breaking news
  if (!isVisible || !breakingNews || breakingNews.length === 0) return null;

  const currentNews = breakingNews[currentIndex];
  
  // Safety check - if currentNews is undefined, return null
  if (!currentNews) return null;
  
  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-orange-500 text-white",
    low: "bg-yellow-500 text-black",
  };

  return (
    <div
      className={`sticky top-0 z-50 ${priorityColors[currentNews.priority]} border-b border-black/10`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 py-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="font-bold text-xs uppercase tracking-wider">Breaking News</span>
            <span className="hidden sm:inline text-sm">•</span>
            {currentNews.link ? (
              <Link
                to={currentNews.link}
                className="font-medium text-sm hover:underline truncate"
              >
                {currentNews.title}
              </Link>
            ) : (
              <span className="font-medium text-sm truncate">{currentNews.title}</span>
            )}
          </div>

          {breakingNews.length > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
              {breakingNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === currentIndex ? "w-4 bg-current" : "w-1 bg-current/40"
                  }`}
                  aria-label={`Go to news ${index + 1}`}
                />
              ))}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 flex-shrink-0 hover:bg-black/10"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
