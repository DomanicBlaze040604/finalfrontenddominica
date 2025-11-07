import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authorsApi } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Users, Mail, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthorsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    specialization: "",
    location: "",
    isActive: true,
  });

  // Fetch authors from API
  const { data: authorsData, isLoading } = useQuery({
    queryKey: ["authors"],
    queryFn: () => authorsApi.getAll({ limit: 100 }),
  });

  const apiAuthors = authorsData?.success ? authorsData.data : [];

  // Sample authors data as fallback
  const [localAuthors, setLocalAuthors] = useState([
    {
      id: 1,
      name: "Maria Rodriguez",
      email: "maria@dominicanews.com",
      bio: "Senior political correspondent with 10+ years of experience covering Caribbean politics.",
      specialization: ["Politics", "Government"],
      location: "Roseau, Dominica",
      isActive: true,
      articlesCount: 45,
      joinDate: "2023-01-15",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "James Thompson",
      email: "james@dominicanews.com",
      bio: "Weather specialist and environmental reporter focusing on climate change in the Caribbean.",
      specialization: ["Weather", "Environment"],
      location: "Portsmouth, Dominica",
      isActive: true,
      articlesCount: 32,
      joinDate: "2023-03-20",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Sarah Williams",
      email: "sarah@dominicanews.com",
      bio: "Sports journalist covering local and regional Caribbean sports events.",
      specialization: ["Sports", "Entertainment"],
      location: "Marigot, Dominica",
      isActive: false,
      articlesCount: 28,
      joinDate: "2023-05-10",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ]);

  // Use API authors if available, otherwise use local authors
  const authors = apiAuthors.length > 0 ? apiAuthors : localAuthors;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAuthor) {
      // Update existing author
      setLocalAuthors(prev => prev.map(author => 
        author.id === editingAuthor.id 
          ? { 
              ...author, 
              ...formData,
              specialization: formData.specialization.split(',').map(s => s.trim()).filter(Boolean)
            }
          : author
      ));
      toast({
        title: "Author Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      // Create new author
      const newAuthor = {
        id: Date.now(),
        ...formData,
        specialization: formData.specialization.split(',').map(s => s.trim()).filter(Boolean),
        articlesCount: 0,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&sig=${Date.now()}`
      };
      setLocalAuthors(prev => [...prev, newAuthor]);
      toast({
        title: "Author Created",
        description: `${formData.name} has been added successfully.`,
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      bio: "",
      specialization: "",
      location: "",
      isActive: true,
    });
    setEditingAuthor(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (author: any) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio,
      specialization: Array.isArray(author.specialization) ? author.specialization.join(', ') : author.specialization,
      location: author.location,
      isActive: author.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (authorId: number) => {
    setLocalAuthors(prev => prev.filter(author => author.id !== authorId));
    toast({
      title: "Author Deleted",
      description: "The author has been removed successfully.",
      variant: "destructive",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Authors
            </h1>
            <p className="text-muted-foreground">Manage writers and contributors</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={resetForm}>
                <PlusCircle className="h-4 w-4" />
                Add Author
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAuthor ? "Edit Author" : "Add New Author"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., Maria Rodriguez"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="author@dominicanews.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Brief professional background and expertise"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                      placeholder="Politics, Sports, Weather (comma-separated)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., Roseau, Dominica"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="isActive" className="text-base font-medium">
                      Active Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow this author to publish articles
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
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
                    {editingAuthor ? "Update Author" : "Add Author"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {authors.length > 0 ? (
            authors.map((author) => (
              <Card key={author.id} className="interactive-card hover-lift group transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {author.name}
                          </CardTitle>
                          <div className="flex gap-1">
                            {author.isActive ? (
                              <Badge variant="default" className="text-xs">Active</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Inactive</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {author.email}
                          </div>
                          {author.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {author.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(author.joinDate).toLocaleDateString()}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {author.bio || "No biography provided"}
                        </p>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {author.articlesCount} articles
                          </Badge>
                          {Array.isArray(author.specialization) && author.specialization.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(author)}
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
                            <AlertDialogTitle>Delete Author</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{author.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(author.id)}
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
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No authors added yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Add Your First Author
              </Button>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuthorsManager;