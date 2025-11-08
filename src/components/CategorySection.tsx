import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { articlesApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CategorySectionProps {
  categorySlug: string;
  categoryName: string;
  categoryColor?: string;
  limit?: number;
}

const CategorySection = ({ 
  categorySlug, 
  categoryName, 
  categoryColor = '#3B82F6',
  limit = 4 
}: CategorySectionProps) => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['categoryArticles', categorySlug, limit],
    queryFn: () => articlesApi.getByCategory(categorySlug, { limit, status: 'published' }),
  });

  const articles = data?.success ? data.data : [];

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            <h2 className="text-3xl font-bold">{categoryName}</h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate(`/category/${categorySlug}`)}
            className="gap-2"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
              onClick={() => navigate(`/article/${article.slug}`)}
            >
              {article.featuredImage && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge
                    className="absolute top-3 left-3"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {categoryName}
                  </Badge>
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {article.author && article.author.name && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author.name}
                    </span>
                  )}
                  {article.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {(() => {
                        try {
                          return formatDistanceToNow(new Date(article.publishedAt), {
                            addSuffix: true,
                          });
                        } catch (e) {
                          return new Date(article.publishedAt).toLocaleDateString();
                        }
                      })()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
