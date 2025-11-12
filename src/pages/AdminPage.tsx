import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { articlesApi, authorsApi, categoriesApi, uploadsApi } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { EmbedManager } from "@/components/admin/EmbedManager";
import ApiStatus from "@/components/ApiStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Save, Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Embed } from "@/lib/api/types";

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    imageAlt: "",
    metaTitle: "",
    metaDescription: "",
    author: "",
    status: "draft",
    scheduledAt: "",
    pinned: false,
    featured: false,
    breaking: false
  });
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [primaryCategory, setPrimaryCategory] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch categories and authors from API
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: authorsData } = useQuery({
    queryKey: ["authors"],
    queryFn: () => authorsApi.getAll({ limit: 50 }),
  });

  // Fetch existing article data when editing
  const { data: articleData, isLoading: isLoadingArticle } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      try {
        // Try to get by ID first (for editing from admin panel)
        const result = await articlesApi.getById(id!);
        return result;
      } catch (error) {
        console.log('Failed to fetch by ID, trying by slug:', error);
        // Fallback to slug if ID doesn't work
        try {
          const result = await articlesApi.getBySlug(id!);
          return result;
        } catch (slugError) {
          console.error('Failed to fetch article by slug:', slugError);
          throw slugError;
        }
      }
    },
    enabled: isEditing && !!id,
  });

  const categories = categoriesData?.success ? categoriesData.data : [];
  const authors = authorsData?.success ? authorsData.data : [];

  // Populate form when editing existing article
  useEffect(() => {
    if (articleData?.success && articleData.data) {
      const article = articleData.data;
      setFormData({
        title: article.title || "",
        slug: article.slug || "",
        excerpt: article.excerpt || "",
        body: article.content || "", // ✅ Fixed: Load article content
        imageAlt: article.featuredImageAlt || "",
        metaTitle: article.seo?.metaTitle || "",
        metaDescription: article.seo?.metaDescription || article.excerpt || "",
        author: article.author?.id || "",
        status: article.status || "draft",
        scheduledAt: article.scheduledAt ? new Date(article.scheduledAt).toISOString().slice(0, 16) : "",
        pinned: article.isPinned || false,
        featured: article.isFeatured || false,
        breaking: article.isBreaking || false,
      });
      
      if (article.featuredImage) {
        setUploadedImageUrl(article.featuredImage);
        setImagePreview(article.featuredImage);
      }
      
      // Set primary category
      if (article.category?.id) {
        setPrimaryCategory(article.category.id);
        setSelectedCategories([article.category.id]);
      }

      // Add additional categories if they exist
      if (article.categories && article.categories.length > 0) {
        const categoryIds = article.categories.map((cat: any) => cat.id);
        setSelectedCategories(categoryIds);
        // If no primary category set, use first from categories
        if (!article.category?.id && categoryIds.length > 0) {
          setPrimaryCategory(categoryIds[0]);
        }
      }

      if (article.embeds && article.embeds.length > 0) {
        setEmbeds(article.embeds);
      }
    }
  }, [articleData]);

  // Mutation for creating/updating article
  const saveArticleMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing && id) {
        return await articlesApi.update(id, data);
      } else {
        return await articlesApi.create(data);
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: `Article "${formData.title}" has been ${isEditing ? "updated" : formData.status === "published" ? "published" : "saved as draft"}.`,
      });
      // Navigate to articles list instead of the article page to avoid errors
      setTimeout(() => {
        navigate('/admin/articles');
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to ${isEditing ? "update" : "create"} article`,
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Auto-upload the image
      setIsUploading(true);
      try {
        const result = await uploadsApi.uploadFile(file);
        console.log('Upload result:', result);
        
        // Handle different response formats
        let imageUrl = '';
        if (result) {
          if (typeof result === 'string') {
            imageUrl = result;
          } else if (result.url) {
            imageUrl = result.url;
          } else if ((result as any).data?.url) {
            imageUrl = (result as any).data.url;
          }
        }
        
        if (imageUrl) {
          setUploadedImageUrl(imageUrl);
          toast({
            title: "Image Uploaded",
            description: "Cover image uploaded successfully!",
          });
        } else {
          throw new Error('No URL in response');
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        
        // Use the preview URL as fallback (base64)
        const previewUrl = reader.result as string;
        if (previewUrl) {
          setUploadedImageUrl(previewUrl);
          toast({
            title: "Using Local Preview",
            description: "Image will be embedded in the article. For better performance, configure image upload on backend.",
          });
        } else {
          toast({
            title: "Upload Failed",
            description: error.response?.data?.message || "Failed to upload image. You can still submit the article with text only.",
            variant: "destructive",
          });
        }
      } finally {
        setIsUploading(false);
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === "title" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.excerpt || !formData.body || !formData.author) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Excerpt, Body, Author)",
        variant: "destructive"
      });
      return;
    }
    
    if (!primaryCategory) {
      toast({
        title: "Validation Error",
        description: "Please select a primary category",
        variant: "destructive"
      });
      return;
    }

    if (selectedCategories.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one category",
        variant: "destructive"
      });
      return;
    }

    if (formData.status === 'scheduled' && !formData.scheduledAt) {
      toast({
        title: "Validation Error",
        description: "Please select a date and time for scheduled publishing",
        variant: "destructive"
      });
      return;
    }

    // Prepare article data
    const articleData = {
      title: formData.title,
      slug: formData.slug || undefined,
      excerpt: formData.excerpt,
      content: formData.body,
      featuredImage: uploadedImageUrl || undefined,
      featuredImageAlt: formData.imageAlt,
      authorId: formData.author,
      categoryId: primaryCategory, // Primary category
      categoryIds: selectedCategories, // All selected categories (for multiple categories support)
      status: formData.status as 'draft' | 'published' | 'scheduled',
      scheduledAt: formData.status === 'scheduled' && formData.scheduledAt 
        ? new Date(formData.scheduledAt).toISOString() 
        : undefined,
      isPinned: formData.pinned,
      isFeatured: formData.featured,
      isBreaking: formData.breaking,
      embeds: embeds.length > 0 ? embeds : undefined,
      seoTitle: formData.metaTitle,
      seoDescription: formData.metaDescription,
    };

    saveArticleMutation.mutate(articleData);
  };

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Article preview would open in a new tab",
    });
  };

  // Show loading state when fetching article for editing
  if (isEditing && isLoadingArticle) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              {isEditing ? "Edit Article" : "Create New Article"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your news story" : "Write and publish your news story to Dominica News"}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Back to Dashboard
          </Button>
        </div>

        {/* API Status Indicator */}
        <ApiStatus />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image Upload */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
                <CardDescription>
                  Upload a high-quality image for your article (recommended: 1200x600px)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? "border-primary bg-primary/5 scale-105" 
                      : "border-border hover:border-primary hover:bg-muted"
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Cover preview" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverImage(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive ? "Drop your image here" : isUploading ? "Uploading..." : "Drag & Drop your files or Browse"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Supports: JPG, PNG, GIF, WebP (Max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="imageAlt">Image Alt Text (for SEO & Accessibility)</Label>
                  <Input
                    id="imageAlt"
                    placeholder="Describe the image for screen readers and SEO"
                    value={formData.imageAlt}
                    onChange={(e) => handleInputChange("imageAlt", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Article Details */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-base">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter article title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="mt-2 text-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-base">URL Slug</Label>
                  <Input
                    id="slug"
                    placeholder="article-url-slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="mt-2 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-generated from title, but you can customize it
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-base">
                    Excerpt / Summary <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the article (shown in cards and previews)"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    className="mt-2 min-h-[80px]"
                    maxLength={300}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.excerpt.length}/300 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="body" className="text-base">
                    Article Body <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-2">
                    <RichTextEditor
                      content={formData.body}
                      onChange={(content) => handleInputChange("body", content)}
                      placeholder="Write your article content here..."
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use the toolbar above for rich text formatting, images, and more
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Author & Categories */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>Author & Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author" className="text-base">
                    Author <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.author}
                    onValueChange={(value) => handleInputChange("author", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                      {authors.length === 0 && (
                        <SelectItem value="loading" disabled>
                          Loading authors...
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base">
                    Primary Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={primaryCategory}
                    onValueChange={(value) => {
                      setPrimaryCategory(value);
                      // Ensure primary category is in selected categories
                      if (!selectedCategories.includes(value)) {
                        setSelectedCategories([...selectedCategories, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select primary category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      {categories.length === 0 && (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Main category for this article
                  </p>
                </div>

                <div>
                  <Label className="text-base">
                    Additional Categories (Optional)
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Article will appear in all selected categories
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((category) => {
                      const isSelected = selectedCategories.includes(category.id);
                      const isPrimary = category.id === primaryCategory;
                      return (
                        <Badge
                          key={category.id}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer transition-all hover:scale-105 ${
                            isPrimary ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          onClick={() => {
                            if (isPrimary) return; // Can't unselect primary
                            toggleCategory(category.id);
                          }}
                        >
                          {isPrimary && '⭐ '}
                          {category.name}
                          {isSelected && !isPrimary && (
                            <X className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                  {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">Loading categories...</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Media Embeds */}
            <EmbedManager embeds={embeds} onChange={setEmbeds} />

            {/* SEO Settings */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your article for search engines and social sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    placeholder="SEO-optimized title (defaults to article title)"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                    className="mt-2"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.metaTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="Brief description for search results"
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                    className="mt-2 min-h-[80px]"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base mb-3 block">Publication Status</Label>
                  <RadioGroup
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="draft" id="draft" />
                      <Label htmlFor="draft" className="flex-1 cursor-pointer">
                        <div className="font-medium">Save as Draft</div>
                        <div className="text-sm text-muted-foreground">
                          Keep this article private and unpublished
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="published" id="published" />
                      <Label htmlFor="published" className="flex-1 cursor-pointer">
                        <div className="font-medium">Publish Now</div>
                        <div className="text-sm text-muted-foreground">
                          Make this article live immediately
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                        <div className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Schedule for Later
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Set a future date and time to publish
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.status === 'scheduled' && (
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <Label htmlFor="scheduledAt" className="text-base">
                      Schedule Date & Time <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => handleInputChange("scheduledAt", e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="mt-2"
                      required={formData.status === 'scheduled'}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Article will be automatically published at the scheduled time
                    </p>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="pinned" className="text-base font-medium">
                        Pin Article
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pin this article to the top of article lists
                      </p>
                    </div>
                    <Switch
                      id="pinned"
                      checked={formData.pinned}
                      onCheckedChange={(checked) => handleInputChange("pinned", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="featured" className="text-base font-medium">
                        Featured Story
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Show in the Featured Story section on homepage
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange("featured", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="breaking" className="text-base font-medium">
                        Breaking News
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mark as breaking news with special badge
                      </p>
                    </div>
                    <Switch
                      id="breaking"
                      checked={formData.breaking}
                      onCheckedChange={(checked) => handleInputChange("breaking", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePreview}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                type="submit"
                size="lg"
                className="gap-2 hover-scale"
                disabled={saveArticleMutation.isPending || isUploading}
              >
                <Save className="h-4 w-4" />
                {saveArticleMutation.isPending 
                  ? "Saving..." 
                  : isEditing 
                    ? "Update Article"
                    : formData.status === "published" ? "Publish Article" : "Save Draft"}
              </Button>
            </div>
          </form>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
