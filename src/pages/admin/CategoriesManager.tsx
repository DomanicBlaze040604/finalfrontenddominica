import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Layers, FileText, Pin, PinOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CategoriesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
    icon: "layers",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const categories = data?.success ? data.data : [];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category Created",
        description: `"${formData.name}" has been created successfully.`,
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category Updated",
        description: `"${formData.name}" has been updated successfully.`,
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update category",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category Deleted",
        description: "The category has been deleted successfully.",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) => 
      categoriesApi.update(id, { isPinned: !isPinned }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: variables.isPinned ? "Category Unpinned" : "Category Pinned",
        description: variables.isPinned 
          ? "Category removed from header navigation" 
          : "Category added to header navigation",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update category",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      icon: "layers",
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      color: category.color || "#3B82F6",
      icon: category.icon || "layers",
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Categories</h1>
            <p className="text-muted-foreground">Manage article categories</p>
          </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={resetForm}>
                  <PlusCircle className="h-4 w-4" />
                  New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Create New Category"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., Breaking News"
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
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Brief description of this category"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color"
                          type="color"
                          value={formData.color}
                          onChange={(e) => handleInputChange("color", e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData.color}
                          onChange={(e) => handleInputChange("color", e.target.value)}
                          placeholder="#3B82F6"
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="icon">Icon</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => handleInputChange("icon", e.target.value)}
                        placeholder="layers"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCategory ? "Update" : "Create"} Category
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Loading categories...</p>
              </Card>
            ) : categories.length > 0 ? (
              categories.map((category: any) => (
                <Card 
                  key={category.id} 
                  className="interactive-card hover-lift group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                          style={{ 
                            backgroundColor: `${category.color}20`,
                            boxShadow: `0 0 0 1px ${category.color}30`
                          }}
                        >
                          <Layers 
                            className="h-6 w-6 transition-all duration-300" 
                            style={{ color: category.color }} 
                          />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
                            {category.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description || "No description"}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs font-mono transition-all duration-300 group-hover:bg-muted"
                            >
                              /{category.slug}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs transition-all duration-300 group-hover:shadow-sm"
                              style={{ 
                                borderColor: category.color, 
                                color: category.color,
                                backgroundColor: `${category.color}10`
                              }}
                            >
                              {category.color}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {Math.floor(Math.random() * 50) + 1} articles
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <Button
                          variant={category.isPinned ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinMutation.mutate({ 
                              id: category.id, 
                              isPinned: category.isPinned || false 
                            });
                          }}
                          className={category.isPinned 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-primary hover:text-primary-foreground"
                          }
                          title={category.isPinned ? "Unpin from header" : "Pin to header"}
                        >
                          {category.isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/categories/${category.slug}/articles`);
                          }}
                          className="hover:bg-blue-500 hover:text-white transition-all duration-200"
                          title="View articles in this category"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(category);
                          }}
                          className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                              deleteMutation.mutate(category.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No categories yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Create Your First Category
                </Button>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  };

export default CategoriesManager;
