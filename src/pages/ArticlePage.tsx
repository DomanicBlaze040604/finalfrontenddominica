import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "@/lib/api";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UniversalEmbed } from "@/components/UniversalEmbed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Share2 } from "lucide-react";
import { SafeComponent } from "@/components/SafeComponent";

const ArticlePage = () => {
  return (
    <SafeComponent componentName="ArticlePage">
      <ArticlePageContent />
    </SafeComponent>
  );
};

const ArticlePageContent = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => articlesApi.getBySlug(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (slug && data?.success) {
      articlesApi.incrementViews(slug).catch(console.error);
    }
  }, [slug, data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-12 w-full bg-muted animate-pulse rounded" />
            <div className="aspect-video bg-muted animate-pulse rounded-lg" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button>Return to Homepage</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const article = data.data;
  const publishedDate = new Date(article.publishedAt || article.createdAt);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            {article.category && (
              <>
                <Link to={`/category/${article.category.slug}`} className="hover:text-foreground">
                  {article.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground truncate max-w-xs">{article.title.slice(0, 40)}...</span>
          </nav>

          {/* Category Badge */}
          {article.category && (
            <Badge className="mb-4 bg-primary text-primary-foreground">
              {article.category.name}
            </Badge>
          )}

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-6 pb-6 border-b border-border">
            <span className="font-medium">{article.author.name}</span>
            <span>•</span>
            <time dateTime={publishedDate.toISOString()}>
              {publishedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | {publishedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} AST
            </time>
            {article.views && article.views > 0 && (
              <>
                <span>•</span>
                <span>{article.views} views</span>
              </>
            )}
            {article.readingTime && (
              <>
                <span>•</span>
                <span>{article.readingTime} min read</span>
              </>
            )}
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-8">
              <img
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                className="w-full h-auto rounded-lg"
                loading="eager"
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center gap-2 mb-8 pb-8 border-b border-border">
            <span className="text-sm font-medium mr-2">Share:</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Social Media Embeds */}
          {article.embeds && article.embeds.length > 0 && (
            <div className="my-8 space-y-6">
              {article.embeds.map((embed, index) => (
                <UniversalEmbed key={index} embed={embed} />
              ))}
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author Info */}
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-display font-bold text-lg mb-2">About the Author</h3>
            <p className="font-medium mb-1">{article.author.name}</p>
            {article.author.bio && (
              <p className="text-sm text-muted-foreground">{article.author.bio}</p>
            )}
            {article.author.specialization && article.author.specialization.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {article.author.specialization.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
