import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { authorsApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SafeComponent } from '@/components/SafeComponent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Mail, Globe, Twitter, Facebook, Linkedin, Users } from 'lucide-react';

const EditorialPage = () => {
  const { data: authorsData, isLoading } = useQuery({
    queryKey: ['authors', 'all'],
    queryFn: () => authorsApi.getAll({ limit: 100 }),
  });

  const authors = authorsData?.success ? authorsData.data : [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SafeComponent componentName="Header">
        <Header />
      </SafeComponent>
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-3 md:px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Editorial Team</h1>
              <p className="text-lg md:text-xl opacity-90">
                Meet the talented journalists and writers bringing you the latest news from Dominica and the Caribbean
              </p>
            </div>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="container mx-auto px-3 md:px-4 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-muted mb-4" />
                      <div className="h-6 bg-muted rounded w-32 mb-2" />
                      <div className="h-4 bg-muted rounded w-24 mb-4" />
                      <div className="h-3 bg-muted rounded w-full mb-2" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : authors.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {authors.length} {authors.length === 1 ? 'Author' : 'Authors'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authors.map((author: any) => (
                  <Card key={author.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={author.avatar} alt={author.name} />
                          <AvatarFallback className="text-xl">
                            {author.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {/* Name & Title */}
                        <h3 className="text-xl font-bold mb-1">{author.name}</h3>
                        {author.title && (
                          <p className="text-sm text-muted-foreground mb-3">{author.title}</p>
                        )}

                        {/* Specializations */}
                        {author.specialization && author.specialization.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center mb-4">
                            {author.specialization.slice(0, 3).map((spec: string) => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Bio */}
                        {author.bio && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {author.bio}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{author.articlesCount || 0} articles</span>
                          </div>
                        </div>

                        {/* Social Links */}
                        {author.socialMedia && Object.values(author.socialMedia).some((url: any) => url) && (
                          <div className="flex gap-2 mb-4">
                            {author.socialMedia.twitter && (
                              <a
                                href={author.socialMedia.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                              >
                                <Twitter className="h-4 w-4" />
                              </a>
                            )}
                            {author.socialMedia.facebook && (
                              <a
                                href={author.socialMedia.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                              >
                                <Facebook className="h-4 w-4" />
                              </a>
                            )}
                            {author.socialMedia.linkedin && (
                              <a
                                href={author.socialMedia.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                              >
                                <Linkedin className="h-4 w-4" />
                              </a>
                            )}
                            {author.website && (
                              <a
                                href={author.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                              >
                                <Globe className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* View Profile Button */}
                        <Link to={`/author/${author.id}`} className="w-full">
                          <Button className="w-full">
                            View Profile & Articles
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Authors Yet</h3>
                <p className="text-muted-foreground">
                  Our editorial team will be listed here soon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <SafeComponent componentName="Footer">
        <Footer />
      </SafeComponent>
    </div>
  );
};

export default EditorialPage;
