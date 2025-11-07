import { useState, useEffect } from 'react';
import { articlesApi } from '@/lib/api/articles';
import type { Article, ArticlesParams } from '@/lib/api/types';

export function useArticles(params?: ArticlesParams) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await articlesApi.getAll(params);
        if (response.success) {
          setArticles(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [JSON.stringify(params)]);

  return { articles, loading, error };
}
