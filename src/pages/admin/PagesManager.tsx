import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pagesApi } from '@/lib/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Eye, FileText, Calendar, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  isPublished: boolean;
}

const PagesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
    isPublished: false,
  });

  // Fetch pages
  const { data: pagesData, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: () => pagesApi.getAll(),
  });

  // Create page mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => pagesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast({ title: 'Page created successfully!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create page',
        variant: 'destructive',
      });
    },
  });

  // Update page mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => pagesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast({ title: 'Page updated successfully!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update page',
        variant: 'destructive',
      });
    },
  });

  // Delete page mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => pagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast({ title: 'Page deleted successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete page',
        variant: 'destructive',
      });
    },
  });

  const pages = pagesData?.success ? pagesData.data : [];

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      metaDescription: '',
      isPublished: false,
    });
    setEditingPage(null);
    setShowForm(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingPage ? formData.slug : generateSlug(title),
    });
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaDescription: page.metaDescription || '',
      isPublished: page.isPublished,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: 'Validation Error',
        description: 'Title, slug, and content are required',
        variant: 'destructive',
      });
      return;
    }

    const pageData = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      metaDescription: formData.metaDescription,
      isPublished: formData.isPublished,
    };

    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data: pageData });
    } else {
      createMutation.mutate(pageData);
    }
  };

  const handleDelete = (page: Page) => {
    if (confirm(`Are you sure you want to delete "${page.title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(page.id);
    }
  };

  const togglePublished = (page: Page) => {
    updateMutation.mutate({
      id: page.id,
      data: { ...page, isPublished: !page.isPublished }
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pages Manager</h1>
            <p className="text-muted-foreground">
              Create and manage static pages like About, Contact, Privacy Policy, etc.
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Page
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{pages.length}</div>
              <p className="text-xs text-muted-foreground">Total Pages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {pages.filter((p: Page) => p.isPublished).length}
              </div>
              <p className="text-xs text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {pages.filter((p: Page) => !p.isPublished).length}
              </div>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
        </div>

        {/* Pages List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {pages.map((page: Page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{page.title}</h3>
                        <Badge variant={page.isPublished ? 'default' : 'secondary'}>
                          {page.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                          /{page.slug}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Updated {new Date(page.updatedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {page.metaDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {page.metaDescription}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {page.isPublished && (
                        <Link to={`/page/${page.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(page)}
                        disabled={updateMutation.isPending}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(page)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {pages.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first page like About Us, Contact, or Privacy Policy
              </p>
              <Button onClick={() => setShowForm(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create First Page
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Page Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <Card className="w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {editingPage ? 'Edit Page' : 'Create New Page'}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Page Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="About Us"
                    />
                  </div>
                  <div>
                    <Label>URL Slug *</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="about-us"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      URL: /page/{formData.slug || 'your-slug'}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Meta Description</Label>
                  <Textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Brief description for search engines (150-160 characters)"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>

                {/* Content Editor */}
                <div>
                  <Label>Page Content *</Label>
                  <div className="mt-2 border rounded-lg">
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder="Write your page content here..."
                    />
                  </div>
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base">Publish Page</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this page visible to visitors
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingPage
                      ? 'Update Page'
                      : 'Create Page'
                    }
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PagesManager;
