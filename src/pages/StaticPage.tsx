import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pagesApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "./NotFound";

const StaticPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["page", slug],
    queryFn: () => pagesApi.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data?.success || !data.data) {
    return <NotFound />;
  }

  const page = data.data;

  if (!page.isPublished) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              {page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-lg text-muted-foreground">
                {page.metaDescription}
              </p>
            )}
          </header>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
          
          <footer className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default StaticPage;