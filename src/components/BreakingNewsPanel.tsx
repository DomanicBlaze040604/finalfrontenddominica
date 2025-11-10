import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

const BreakingNewsPanel = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['breaking-news'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/articles/breaking') as any;
        return response;
      } catch (error) {
        console.error('Error fetching breaking news:', error);
        return { success: false, data: [] };
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  if (isLoading) return null;

  const articles = (data as any)?.success ? (data as any).data : [];

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="breaking-news-panel">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-red-600">
        <Flame className="h-5 w-5 text-red-600" />
        <h2 className="text-xl font-display font-bold text-gray-900 uppercase tracking-wide">
          Breaking News
        </h2>
      </div>
      <div className="space-y-6">
        {articles.slice(0, 2).map((article: any) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            className="group block"
          >
            <div className="flex gap-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
              {article.featuredImage && (
                <div className="relative w-40 h-28 flex-shrink-0 overflow-hidden bg-gray-100">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive" className="text-xs font-semibold uppercase">
                    Breaking
                  </Badge>
                  {article.publishedAt && (
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(article.publishedAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} AST
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors text-gray-900">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BreakingNewsPanel;
