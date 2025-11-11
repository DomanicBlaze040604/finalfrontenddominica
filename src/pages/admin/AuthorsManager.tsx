import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authorsApi, uploadsApi } from '@/lib/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Upload, User, Mail, Calendar, FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
  articleCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthorFormData {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  website: string;
}

const AuthorsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<AuthorFormData>({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    website: '',
  });

  // Fetch authors
  const { data: authorsData, isLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: () => authorsApi.getAll({ limit: 100 }),
  });

  // Create author mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => authorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({ title: 'Author created successfully!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create author',
        variant: 'destructive',
      });
    },
  });

  // Update author mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => authorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({ title: 'Author updated successfully!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update author',
        variant: 'destructive',
      });
    },
  });

  // Delete author mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => authorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({ title: 'Author deleted successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete author',
        variant: 'destructive',
      });
    },
  });

  const authors = authorsData?.success ? authorsData.data : [];

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      bio: '',
      avatar: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      website: '',
    });
    setEditingAuthor(null);
    setShowForm(false);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio || '',
      avatar: author.avatar || '',
      twitter: author.socialLinks?.twitter || '',
      facebook: author.socialLinks?.facebook || '',
      linkedin: author.socialLinks?.linkedin || '',
      website: author.socialLinks?.website || '',
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Name and email are required',
        variant: 'destructive',
      });
      return;
    }

    const authorData = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      avatar: formData.avatar,
      socialLinks: {
        twitter: formData.twitter,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        website: formData.website,
      },
    };

    if (editingAuthor) {
      updateMutation.mutate({ id: editingAuthor.id, data: authorData });
    } else {
      createMutation.mutate(authorData);
    }
  };

  const handleDelete = (author: Author) => {
    if (confirm(`Are you sure you want to delete ${author.name}? This action cannot be undone.`)) {
      deleteMutation.mutate(author.id);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 'avatar');

      const response = await uploadsApi.upload(uploadData);
      if (response.success) {
        setFormData({ ...formData, avatar: response.data.url });
        toast({ title: 'Avatar uploaded successfully!' });
      }
    } catch (error: any) {
      toast({
        title: 'Upload Error',
        description: error.message || 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (imageFile) {
      handleAvatarUpload(imageFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Authors Manager</h1>
            <p className="text-muted-foreground">
              Manage authors, their profiles, and social links
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Author
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{authors.length}</div>
              <p className="text-xs text-muted-foreground">Total Authors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {authors.filter((a: Author) => a.avatar).length}
              </div>
              <p className="text-xs text-muted-foreground">With Avatars</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {authors.reduce((sum: number, a: Author) => sum + (a.articleCount || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total Articles</p>
            </CardContent>
          </Card>
        </div>

        {/* Authors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-muted rounded mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author: Author) => (
              <Card key={author.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={author.avatar} alt={author.name} />
                      <AvatarFallback>
                        {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{author.name}</h3>
                      <p className="text-sm text-muted-foreground">{author.email}</p>
                      {author.bio && (
                        <p className="text-sm mt-2 line-clamp-2">{author.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {author.articleCount || 0} articles
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(author.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/author/${author.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <User className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(author)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(author)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {authors.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No authors yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first author to start managing content creators
              </p>
              <Button onClick={() => setShowForm(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add First Author
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Author Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <Card className="w-full max-w-2xl my-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {editingAuthor ? 'Edit Author' : 'Add New Author'}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="text-center">
                  <Label className="text-base font-medium">Profile Picture</Label>
                  <div
                    className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    {formData.avatar ? (
                      <div className="space-y-2">
                        <Avatar className="h-20 w-20 mx-auto">
                          <AvatarImage src={formData.avatar} />
                          <AvatarFallback>
                            {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">
                          Click or drag to change avatar
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {uploading ? 'Uploading...' : 'Click or drag to upload avatar'}
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                  />
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief description about the author..."
                    rows={3}
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Social Links (Optional)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Twitter</Label>
                      <Input
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <Label>Facebook</Label>
                      <Input
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingAuthor
                      ? 'Update Author'
                      : 'Create Author'
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

export default AuthorsManager;
