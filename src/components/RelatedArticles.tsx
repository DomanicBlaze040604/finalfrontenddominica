import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedArticlesProps {
  articleId: string;
  limit?: number;
}

const RelatedArticles = ({ articleId, limit = 6 }: RelatedArticlesProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['related-articles', articleId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/articles/${articleId}/related?limit=${limit}`) as any;
        return response;
      } catch (error) {
        console.error('Error fetching related articles:', error);
        return { success: false, data: [] };
      }
    },
    enabled: !!articleId,
  });

  if (isLoading) {
    return (
      <section className="related-articles-section mt-16 pt-12 border-t-2 border-border">
        <h2 className="text-3xl font-display font-bold mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full" />
          ))}
        </div>
      </section>
    );
  }

  const articles = (data as any)?.success ? (data as any).data : [];

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="related-articles-section mt-16 pt-12 border-t-2 border-border">
      <h2 className="text-3xl font-display font-bold mb-8 text-foreground">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: any) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            className="group"
          >
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              {article.featuredImage && (
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              <CardContent className="p-5 flex flex-col gap-3">
                {article.category && (
                  <Badge
                    className="w-fit text-xs"
                    style={{
                      backgroundColor: article.category.color,
                      color: '#fff',
                    }}
                  >
                    {article.category.name}
                  </Badge>
                )}
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t">
                  {article.author && (
                    <div className="flex items-center gap-2">
                      {article.author.avatar && (
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span>{article.author.name}</span>
                    </div>
                  )}
                  {article.publishedAt && (
                    <>
                      <span>•</span>
                      <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </time>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
