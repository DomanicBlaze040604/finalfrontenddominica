import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authorsApi, articlesApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeComponent } from '@/components/SafeComponent';
import { Calendar, FileText, Globe, Twitter, Facebook, Linkedin, Mail, ArrowLeft } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';

const AuthorPage = () => {
  const { id } = useParams();

  // Fetch author details
  const { data: authorData, isLoading: authorLoading } = useQuery({
    queryKey: ['author', id],
    queryFn: () => authorsApi.getById(id!),
    enabled: !!id,
  });

  // Fetch author's articles
  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['articles', 'author', id],
    queryFn: () => articlesApi.getAll({ authorId: id, limit: 20 }),
    enabled: !!id,
  });

  const author = authorData?.success ? authorData.data : null;
  const articles = articlesData?.success ? articlesData.data : [];

  if (authorLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <SafeComponent componentName="Header">
          <Header />
        </SafeComponent>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading author profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <SafeComponent componentName="Header">
          <Header />
        </SafeComponent>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Author Not Found</h1>
            <p className="text-muted-foreground mb-4">The author you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getSocialLabel = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'Twitter';
      case 'facebook':
        return 'Facebook';
      case 'linkedin':
        return 'LinkedIn';
      case 'website':
        return 'Website';
      default:
        return 'Link';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SafeComponent componentName="Header">
        <Header />
      </SafeComponent>
      
      <main className="flex-1 bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-3 md:px-4 py-4">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-3 md:px-4 py-8">
          {/* Author Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="h-32 w-32 mx-auto md:mx-0">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback className="text-2xl">
                      {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Author Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{author.name}</h1>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{author.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{articles.length} articles</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Joined {new Date(author.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {author.bio && (
                    <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                      {author.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  {author.socialLinks && Object.entries(author.socialLinks).some(([_, url]) => url) && (
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {Object.entries(author.socialLinks).map(([platform, url]) => {
                        if (!url) return null;
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm transition-colors"
                          >
                            {getSocialIcon(platform)}
                            {getSocialLabel(platform)}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold">
                Articles by {author.name}
              </h2>
              <Badge variant="secondary" className="text-sm">
                {articles.length} {articles.length === 1 ? 'article' : 'articles'}
              </Badge>
            </div>

            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-3 bg-muted rounded mb-2" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article: any) => (
                  <ArticleCard
                    key={article.id}
                    slug={article.slug}
                    title={article.title}
                    excerpt={article.excerpt || ""}
                    imageUrl={article.featuredImage || `https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop`}
                    category={article.category?.name || "News"}
                    date={new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'America/Dominica'
                    })}
                    author={author.name}
                    authorId={author.id}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
                  <p className="text-muted-foreground">
                    {author.name} hasn't published any articles yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <SafeComponent componentName="Footer">
        <Footer />
      </SafeComponent>
    </div>
  );
};

export default AuthorPage;
