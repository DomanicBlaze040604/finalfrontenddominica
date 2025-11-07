import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi, articlesApi } from '@/lib/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Edit, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CategoryArticles = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['categoryArticles', slug],
    queryFn: () => articlesApi.getByCategory(slug!, { limit: 100 }),
    enabled: !!slug,
  });

  const category = categoryData?.success ? categoryData.data : null;
  const articles = articlesData?.success ? articlesData.data : [];

  if (categoryLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading category...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Category Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The category you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate('/admin/categories')}>
                Back to Categories
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/admin/categories')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {category.name}
                </h1>
                <Badge style={{ backgroundColor: category.color }}>
                  {category.icon}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {category.description || 'No description'}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/admin/articles/new')}>
            Create Article
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {articles.filter(a => a.status === 'published').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Drafts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {articles.filter(a => a.status === 'draft').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Articles in {category.name}</CardTitle>
            <CardDescription>
              All articles published in this category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {articlesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No articles in this category yet.
                </p>
                <Button onClick={() => navigate('/admin/articles/new')}>
                  Create First Article
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {article.featuredImage && (
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-32 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">
                                {article.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {article.author?.name || 'Unknown'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {article.publishedAt
                                    ? formatDistanceToNow(new Date(article.publishedAt), {
                                        addSuffix: true,
                                      })
                                    : 'Not published'}
                                </span>
                                {article.views !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {article.views} views
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  article.status === 'published' ? 'default' : 'secondary'
                                }
                              >
                                {article.status}
                              </Badge>
                              {article.isPinned && (
                                <Badge variant="outline">Pinned</Badge>
                              )}
                              {article.isFeatured && (
                                <Badge variant="outline">Featured</Badge>
                              )}
                            </div>
                          </div>
                          {article.excerpt && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/article/${article.slug}`)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CategoryArticles;
