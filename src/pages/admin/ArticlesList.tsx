import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articlesApi } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const ArticlesList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: () => articlesApi.getAll({ limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: articlesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
      toast({
        title: "Article Deleted",
        description: "The article has been deleted successfully.",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete article",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (articleId: string, articleTitle: string) => {
    if (confirm(`Are you sure you want to delete "${articleTitle}"?`)) {
      deleteMutation.mutate(articleId);
    }
  };

  const articles = data?.success ? data.data : [];
  
  // Separate articles by status and sort by date (latest first)
  const publishedArticles = articles
    .filter((article: any) => article.status === 'published')
    .sort((a: any, b: any) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA; // Latest first
    });
    
  const draftArticles = articles
    .filter((article: any) => article.status === 'draft' || article.status === 'scheduled')
    .sort((a: any, b: any) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA; // Latest first
    });

  const renderArticleCard = (article: any) => (
    <Card key={article.id} className="interactive-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <CardTitle className="text-lg">{article.title}</CardTitle>
              <Badge variant={
                article.status === 'published' ? 'default' : 
                article.status === 'scheduled' ? 'outline' : 
                'secondary'
              }>
                {article.status}
              </Badge>
              {article.isPinned && <Badge variant="destructive">Pinned</Badge>}
              {article.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              {article.isBreaking && <Badge className="bg-red-600">Breaking</Badge>}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              <span>{article.author.name}</span>
              <span>•</span>
              <span>
                {article.status === 'scheduled' && article.scheduledAt
                  ? `Scheduled: ${new Date(article.scheduledAt).toLocaleDateString()}`
                  : new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
              </span>
              {article.views && article.views > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.views} views
                  </span>
                </>
              )}
              {article.embeds && article.embeds.length > 0 && (
                <>
                  <span>•</span>
                  <span>{article.embeds.length} embed{article.embeds.length > 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/admin/articles/edit/${article.id}`}>
              <Button variant="outline" size="sm" className="hover-scale">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover-scale"
              onClick={() => handleDelete(article.id, article.title)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {article.excerpt && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
        </CardContent>
      )}
    </Card>
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Articles</h1>
            <p className="text-muted-foreground">Manage all news articles</p>
          </div>
          <Link to="/admin/articles/new">
            <Button className="gap-2 hover-scale">
              <PlusCircle className="h-4 w-4" />
              Create Article
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No articles yet</p>
            <Link to="/admin/articles/new">
              <Button>Create Your First Article</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Published Articles Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Published Articles</h2>
                <Badge variant="default" className="text-sm">
                  {publishedArticles.length} {publishedArticles.length === 1 ? 'article' : 'articles'}
                </Badge>
              </div>
              
              {publishedArticles.length > 0 ? (
                <div className="space-y-4">
                  {publishedArticles.map(renderArticleCard)}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No published articles yet</p>
                </Card>
              )}
            </div>

            {/* Draft Articles Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Drafts & Scheduled</h2>
                <Badge variant="secondary" className="text-sm">
                  {draftArticles.length} {draftArticles.length === 1 ? 'article' : 'articles'}
                </Badge>
              </div>
              
              {draftArticles.length > 0 ? (
                <div className="space-y-4">
                  {draftArticles.map(renderArticleCard)}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No drafts or scheduled articles</p>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ArticlesList;
