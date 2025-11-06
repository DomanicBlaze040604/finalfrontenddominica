import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileText } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => articlesApi.getAll({ search: query, limit: 20 }),
    enabled: !!query,
  });

  const articles = data?.success ? data.data : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-6 w-6 text-primary" />
              <h1 className="font-display text-3xl font-bold">Search Results</h1>
            </div>
            {query && (
              <p className="text-muted-foreground">
                Showing results for: <span className="font-semibold">"{query}"</span>
              </p>
            )}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Search Error</h2>
              <p className="text-muted-foreground">
                Unable to perform search. Please try again later.
              </p>
            </div>
          ) : articles.length > 0 ? (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground mb-6">
                Found {articles.length} result{articles.length !== 1 ? 's' : ''}
              </p>
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt || ""}
                  imageUrl={article.featuredImage || "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1200&h=600&fit=crop"}
                  category={article.category?.name || "News"}
                  date={new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                  author={article.author.name}
                />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
              <p className="text-muted-foreground mb-4">
                No articles found for "{query}". Try different keywords or check your spelling.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Search tips:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Try broader keywords</li>
                  <li>Check spelling and try again</li>
                  <li>Use different words with similar meaning</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Enter Search Terms</h2>
              <p className="text-muted-foreground">
                Please enter keywords to search for articles.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;