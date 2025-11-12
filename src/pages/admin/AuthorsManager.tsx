import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authorsApi } from '@/lib/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  Mail, 
  FileText,
  Globe,
  Twitter,
  Facebook,
  Linkedin,
  Search,
  Upload,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface AuthorFormData {
  name: string;
  email: string;
  bio: string;
  title: string;
  avatar: string;
  location: string;
  phone: string;
  website: string;
  professionalBackground: string;
  expertise: string;
  specialization: string;
  socialMedia: {
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
  };
}

const AuthorsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formData, setFormData] = useState<AuthorFormData>({
    name: '',
    email: '',
    bio: '',
    title: '',
    avatar: '',
    location: '',
    phone: '',
    website: '',
    professionalBackground: '',
    expertise: '',
    specialization: '',
    socialMedia: {
      twitter: '',
      facebook: '',
      linkedin: '',
      instagram: '',
    },
  });

  // Fetch authors
  const { data: authorsData, isLoading } = useQuery({
    queryKey: ['authors', 'admin'],
    queryFn: () => authorsApi.getAll({ limit: 100 }),
  });

  const authors = authorsData?.success ? authorsData.data : [];

  // Filter authors based on search
  const filteredAuthors = authors.filter((author: any) =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => authorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({
        title: 'Success',
        description: 'Author created successfully',
      });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create author',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      authorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({
        title: 'Success',
        description: 'Author updated successfully',
      });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update author',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => authorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({
        title: 'Success',
        description: 'Author deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete author',
        variant: 'destructive',
      });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => authorsApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({
        title: 'Success',
        description: 'Author status updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        variant: 'destructive',
      });
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenDialog = (author?: any) => {
    if (author) {
      setEditingAuthor(author);
      setFormData({
        name: author.name || '',
        email: author.email || '',
        bio: author.bio || '',
        title: author.title || '',
        avatar: author.avatar || '',
        location: author.location || '',
        phone: author.phone || '',
        website: author.website || '',
        professionalBackground: author.professionalBackground || '',
        expertise: author.expertise?.join(', ') || '',
        specialization: author.specialization?.join(', ') || '',
        socialMedia: {
          twitter: author.socialMedia?.twitter || '',
          facebook: author.socialMedia?.facebook || '',
          linkedin: author.socialMedia?.linkedin || '',
          instagram: author.socialMedia?.instagram || '',
        },
      });
    } else {
      setEditingAuthor(null);
      setFormData({
        name: '',
        email: '',
        bio: '',
        title: '',
        avatar: '',
        location: '',
        phone: '',
        website: '',
        professionalBackground: '',
        expertise: '',
        specialization: '',
        socialMedia: {
          twitter: '',
          facebook: '',
          linkedin: '',
          instagram: '',
        },
      });
    }
    setAvatarFile(null);
    setAvatarPreview('');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAuthor(null);
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      title: formData.title,
      avatar: formData.avatar || undefined,
      location: formData.location || undefined,
      phone: formData.phone || undefined,
      website: formData.website || undefined,
      professionalBackground: formData.professionalBackground || undefined,
      expertise: formData.expertise ? formData.expertise.split(',').map(e => e.trim()).filter(Boolean) : [],
      specialization: formData.specialization ? formData.specialization.split(',').map(s => s.trim()).filter(Boolean) : [],
      socialMedia: {
        twitter: formData.socialMedia.twitter || undefined,
        facebook: formData.socialMedia.facebook || undefined,
        linkedin: formData.socialMedia.linkedin || undefined,
        instagram: formData.socialMedia.instagram || undefined,
      },
    } as any;

    if (editingAuthor) {
      updateMutation.mutate({ id: editingAuthor.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Authors Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your editorial team and author profiles
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Author
          </Button>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Authors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Authors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {authors.filter((a: any) => a.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {authors.reduce((sum: number, a: any) => sum + (a.articlesCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Authors Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredAuthors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuthors.map((author: any) => (
                  <TableRow key={author.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={author.avatar} alt={author.name} />
                          <AvatarFallback>
                            {author.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{author.name}</div>
                          {author.title && (
                            <div className="text-sm text-muted-foreground">{author.title}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {author.email}
                      </div>
                      {author.socialMedia && (
                        <div className="flex gap-1 mt-1">
                          {author.socialMedia.twitter && (
                            <Twitter className="h-3 w-3 text-muted-foreground" />
                          )}
                          {author.socialMedia.facebook && (
                            <Facebook className="h-3 w-3 text-muted-foreground" />
                          )}
                          {author.socialMedia.linkedin && (
                            <Linkedin className="h-3 w-3 text-muted-foreground" />
                          )}
                          {author.website && (
                            <Globe className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {author.articlesCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={author.isActive ? 'default' : 'secondary'}>
                        {author.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatusMutation.mutate(author.id)}
                          title={author.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {author.isActive ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(author)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(author.id, author.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No authors found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAuthor ? 'Edit Author' : 'Add New Author'}
            </DialogTitle>
            <DialogDescription>
              {editingAuthor
                ? 'Update author information and profile details'
                : 'Create a new author profile for your editorial team'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Reporter"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Roseau, Dominica"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Brief biography..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalBackground">Professional Background</Label>
              <Textarea
                id="professionalBackground"
                placeholder="Detailed professional background..."
                value={formData.professionalBackground}
                onChange={(e) => setFormData({ ...formData, professionalBackground: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expertise">Expertise (comma-separated)</Label>
                <Input
                  id="expertise"
                  placeholder="e.g., Politics, Economics"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization (comma-separated)</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Politics, Sports"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar Image</Label>
              <div className="flex items-center gap-4">
                {(avatarPreview || formData.avatar) && (
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarPreview || formData.avatar} alt="Preview" />
                    <AvatarFallback>Preview</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="avatar-file"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('avatar-file')?.click()}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="Or paste image URL"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <Label>Social Media</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Twitter URL"
                  value={formData.socialMedia.twitter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, twitter: e.target.value },
                    })
                  }
                />
                <Input
                  placeholder="Facebook URL"
                  value={formData.socialMedia.facebook}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, facebook: e.target.value },
                    })
                  }
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, linkedin: e.target.value },
                    })
                  }
                />
                <Input
                  placeholder="Instagram URL"
                  value={formData.socialMedia.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, instagram: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : editingAuthor
                  ? 'Update Author'
                  : 'Create Author'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AuthorsManager;
