import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { articlesApi, categoriesApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { SafeComponent } from "@/components/SafeComponent";

const CategoryPage = () => {
  return (
    <SafeComponent componentName="CategoryPage">
      <CategoryPageContent />
    </SafeComponent>
  );
};

const CategoryPageContent = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: categoryData } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ["articles", "category", slug],
    queryFn: async () => {
      try {
        // Try the category-specific endpoint first
        return await articlesApi.getByCategory(slug!, { limit: 20, status: "published" });
      } catch (error) {
        console.log('Category endpoint failed, trying fallback with category filter');
        // Fallback to regular articles endpoint with category filter
        return await articlesApi.getAll({ category: slug, limit: 20, status: "published" });
      }
    },
    enabled: !!slug,
    retry: 1,
  });

  const categoryName = categoryData?.success ? categoryData.data.name : (slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Category');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-12 w-64 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[350px] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !articlesData?.success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">No articles found in this category.</p>
            <Link to="/">
              <Button>Return to Homepage</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const articles = articlesData.data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">{categoryName}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            {categoryName}
          </h1>
          {categoryData?.success && categoryData.data.description && (
            <p className="text-lg text-muted-foreground">{categoryData.data.description}</p>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              title={article.title}
              excerpt={article.excerpt || ""}
              imageUrl={article.featuredImage || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop"}
              category={article.category?.name || categoryName}
              date={new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              author={article.author.name}
            />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No articles found in this category yet.</p>
            <Link to="/" className="mt-4 inline-block">
              <Button variant="outline">Browse All Articles</Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
