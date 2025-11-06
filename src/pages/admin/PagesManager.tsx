import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, FileText, Trash2, Eye, ExternalLink, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PagesManager = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaDescription: "",
    isPublished: true,
    showInFooter: true,
  });

  // Sample static pages - in production, fetch from API
  const [pages, setPages] = useState([
    { 
      id: 1, 
      title: "About Us", 
      slug: "about", 
      content: "<h2>About Dominica News</h2><p>Your trusted source for news and information about Dominica and the Caribbean region.</p>",
      metaDescription: "Learn about Dominica News, your trusted source for Caribbean news.",
      isPublished: true,
      showInFooter: true,
      updatedAt: "2025-11-05",
      createdAt: "2025-10-01"
    },
    { 
      id: 2, 
      title: "Contact Us", 
      slug: "contact", 
      content: "<h2>Get in Touch</h2><p>Contact our editorial team for news tips, feedback, or inquiries.</p><p><strong>Email:</strong> news@dominicanews.com<br><strong>Phone:</strong> +1-767-XXX-XXXX</p>",
      metaDescription: "Contact Dominica News editorial team for news tips and inquiries.",
      isPublished: true,
      showInFooter: true,
      updatedAt: "2025-11-04",
      createdAt: "2025-10-01"
    },
    { 
      id: 3, 
      title: "Privacy Policy", 
      slug: "privacy", 
      content: "<h2>Privacy Policy</h2><p>This privacy policy explains how we collect, use, and protect your personal information.</p>",
      metaDescription: "Dominica News privacy policy and data protection information.",
      isPublished: true,
      showInFooter: true,
      updatedAt: "2025-11-03",
      createdAt: "2025-10-01"
    },
    { 
      id: 4, 
      title: "Terms of Service", 
      slug: "terms", 
      content: "<h2>Terms of Service</h2><p>By using our website, you agree to these terms and conditions.</p>",
      metaDescription: "Dominica News terms of service and usage conditions.",
      isPublished: true,
      showInFooter: true,
      updatedAt: "2025-11-03",
      createdAt: "2025-10-01"
    },
    { 
      id: 5, 
      title: "Editorial Team", 
      slug: "editorial-team", 
      content: "<h2>Our Editorial Team</h2><p>Meet the dedicated journalists and editors who bring you the latest news from Dominica.</p>",
      metaDescription: "Meet the Dominica News editorial team and journalists.",
      isPublished: true,
      showInFooter: false,
      updatedAt: "2025-11-02",
      createdAt: "2025-10-01"
    },
  ]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "title" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPage) {
      // Update existing page
      setPages(prev => prev.map(page => 
        page.id === editingPage.id 
          ? { ...page, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : page
      ));
      toast({
        title: "Page Updated",
        description: `"${formData.title}" has been updated successfully.`,
      });
    } else {
      // Create new page
      const newPage = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setPages(prev => [...prev, newPage]);
      toast({
        title: "Page Created",
        description: `"${formData.title}" has been created successfully.`,
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      metaDescription: "",
      isPublished: true,
      showInFooter: true,
    });
    setEditingPage(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaDescription: page.metaDescription,
      isPublished: page.isPublished,
      showInFooter: page.showInFooter,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (pageId: number) => {
    setPages(prev => prev.filter(page => page.id !== pageId));
    toast({
      title: "Page Deleted",
      description: "The page has been deleted successfully.",
      variant: "destructive",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
              <Globe className="h-8 w-8 text-primary" />
              Static Pages
            </h1>
            <p className="text-muted-foreground">Create and manage static website pages that appear in the footer and navigation</p>
          </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={resetForm}>
                  <PlusCircle className="h-4 w-4" />
                  New Page
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPage ? "Edit Page" : "Create New Page"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Page Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., About Us"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      placeholder="auto-generated"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Page will be available at: /{formData.slug || "page-slug"}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <div className="mt-2">
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => handleInputChange("content", content)}
                        placeholder="Write your page content here..."
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use the rich text editor to format your content
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                      placeholder="Brief description for search engines"
                      rows={2}
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="isPublished" className="text-base font-medium">
                          Published
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Make this page publicly accessible
                        </p>
                      </div>
                      <Switch
                        id="isPublished"
                        checked={formData.isPublished}
                        onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="showInFooter" className="text-base font-medium">
                          Show in Footer
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Display link in website footer
                        </p>
                      </div>
                      <Switch
                        id="showInFooter"
                        checked={formData.showInFooter}
                        onCheckedChange={(checked) => handleInputChange("showInFooter", checked)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingPage ? "Update Page" : "Create Page"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {pages.length > 0 ? (
              pages.map((page) => (
                <Card key={page.id} className="interactive-card hover-lift group transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {page.title}
                            </CardTitle>
                            <div className="flex gap-1">
                              {page.isPublished ? (
                                <Badge variant="default" className="text-xs">Published</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">Draft</Badge>
                              )}
                              {page.showInFooter && (
                                <Badge variant="outline" className="text-xs">Footer</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="font-mono bg-muted px-2 py-1 rounded">/{page.slug}</span>
                            <span>•</span>
                            <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {page.metaDescription || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/${page.slug}`, '_blank')}
                          className="hover:bg-primary hover:text-primary-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(page)}
                          className="hover:bg-primary hover:text-primary-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Page</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{page.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(page.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No pages created yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Create Your First Page
                </Button>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  };

export default PagesManager;
