import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { liveUpdatesApi, authorsApi, categoriesApi } from '@/lib/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Play, Pause, StopCircle, Trash2, Eye, MessageSquare, X } from 'lucide-react';

const LiveUpdatesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const [newUpdateContent, setNewUpdateContent] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general' as 'breaking' | 'sports' | 'weather' | 'traffic' | 'election' | 'general',
    priority: 3,
    authorId: '',
    categoryId: '',
    tags: '',
    score: '',
    location: '',
    temperature: '',
    autoRefresh: true,
    refreshInterval: 30,
    isSticky: false,
    showOnHomepage: true,
  });

  const { data: liveUpdatesData } = useQuery({
    queryKey: ['admin', 'liveUpdates'],
    queryFn: () => liveUpdatesApi.getAll(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: authorsData } = useQuery({
    queryKey: ['authors'],
    queryFn: () => authorsApi.getAll({ limit: 50 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => liveUpdatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'liveUpdates'] });
      toast({ title: 'Live update created successfully!' });
      setShowCreateForm(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Create live update error:', error);
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      if (status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to create live updates',
          variant: 'destructive',
        });
      } else if (status === 404) {
        toast({
          title: 'Backend Not Ready',
          description: 'Live Updates API endpoint not found. Please ensure backend is deployed with Live Updates feature.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error Creating Live Update',
          description: message || 'Failed to create live update. Check console for details.',
          variant: 'destructive',
        });
      }
    },
  });

  const addUpdateMutation = useMutation({
    mutationFn: ({ id, content, authorId }: { id: string; content: string; authorId: string }) =>
      liveUpdatesApi.addUpdate(id, { content, authorId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'liveUpdates'] });
      toast({ title: 'Update added successfully!' });
      setSelectedUpdate(null);
      setNewUpdateContent('');
    },
  });

  const endLiveMutation = useMutation({
    mutationFn: (id: string) => liveUpdatesApi.endLive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'liveUpdates'] });
      toast({ title: 'Live update ended' });
    },
  });

  const pauseLiveMutation = useMutation({
    mutationFn: (id: string) => liveUpdatesApi.pauseLive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'liveUpdates'] });
      toast({ title: 'Live update paused' });
    },
  });

  const resumeLiveMutation = useMutation({
    mutationFn: (id: string) => liveUpdatesApi.resumeLive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'liveUpdates'] });
      toast({ title: 'Live update resumed' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => liveUpdatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'liveUpdates'] });
      toast({ title: 'Live update deleted' });
    },
  });

  const liveUpdates = liveUpdatesData?.success ? liveUpdatesData.data : [];
  const authors = authorsData?.success ? authorsData.data : [];
  const categories = categoriesData?.success ? categoriesData.data : [];

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 3,
      authorId: '',
      categoryId: '',
      tags: '',
      score: '',
      location: '',
      temperature: '',
      autoRefresh: true,
      refreshInterval: 30,
      isSticky: false,
      showOnHomepage: true,
    });
  };

  const handleCreate = () => {
    if (!formData.title || !formData.content || !formData.authorId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const metadata: any = {};
    if (formData.score) metadata.score = formData.score;
    if (formData.location) metadata.location = formData.location;
    if (formData.temperature) metadata.temperature = formData.temperature;

    createMutation.mutate({
      title: formData.title,
      content: formData.content,
      type: formData.type,
      priority: formData.priority,
      authorId: formData.authorId,
      categoryId: formData.categoryId || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      autoRefresh: formData.autoRefresh,
      refreshInterval: formData.refreshInterval,
      isSticky: formData.isSticky,
      showOnHomepage: formData.showOnHomepage,
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      breaking: 'bg-red-600',
      sports: 'bg-green-600',
      weather: 'bg-blue-600',
      traffic: 'bg-yellow-600',
      election: 'bg-purple-600',
      general: 'bg-gray-600',
    };
    return colors[type as keyof typeof colors] || colors.general;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-600',
      paused: 'bg-yellow-600',
      ended: 'bg-gray-600',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-600';
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              Live Updates Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage real-time updates for breaking news, sports, weather, and more
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Live Update
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{liveUpdates.filter((u: any) => u.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">Active Live Updates</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{liveUpdates.filter((u: any) => u.status === 'paused').length}</div>
              <p className="text-xs text-muted-foreground">Paused</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{liveUpdates.filter((u: any) => u.status === 'ended').length}</div>
              <p className="text-xs text-muted-foreground">Ended</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {liveUpdates.reduce((sum: number, u: any) => sum + (u.viewCount || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>
        </div>

        {/* Live Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveUpdates.map((update: any) => (
            <Card key={update.id} className="border-l-4 border-l-red-600">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${getStatusColor(update.status)} text-white text-xs`}>
                    {update.status.toUpperCase()}
                  </Badge>
                  <Badge className={`${getTypeColor(update.type)} text-white text-xs`}>
                    {update.type.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{update.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {update.metadata?.score && (
                  <div className="bg-gray-100 rounded p-2 text-center font-semibold text-sm">
                    {update.metadata.score}
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{update.updateCount || 0} updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{update.viewCount || 0} views</span>
                  </div>
                  <div className="text-xs">
                    Started: {new Date(update.startedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'America/Dominica'
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUpdate(update)}
                    disabled={update.status !== 'active'}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Add Update
                  </Button>
                  
                  {update.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => pauseLiveMutation.mutate(update.id)}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {update.status === 'paused' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resumeLiveMutation.mutate(update.id)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('End this live update?')) {
                        endLiveMutation.mutate(update.id);
                      }
                    }}
                    disabled={update.status === 'ended'}
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm('Delete this live update permanently?')) {
                        deleteMutation.mutate(update.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {liveUpdates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <p className="text-lg mb-2">No live updates yet</p>
                <p className="text-sm">Create your first live update to get started</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <Card className="w-full max-w-2xl my-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create Live Update</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    placeholder="Live: Cricket Match - Team A vs Team B"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Initial Content *</Label>
                  <Textarea
                    placeholder="Match starting soon..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type *</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breaking">🔴 Breaking News</SelectItem>
                        <SelectItem value="sports">⚽ Sports</SelectItem>
                        <SelectItem value="weather">🌤️ Weather</SelectItem>
                        <SelectItem value="traffic">🚗 Traffic</SelectItem>
                        <SelectItem value="election">🗳️ Election</SelectItem>
                        <SelectItem value="general">📰 General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Priority (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Author *</Label>
                    <Select value={formData.authorId} onValueChange={(value) => setFormData({ ...formData, authorId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map((author: any) => (
                          <SelectItem key={author.id} value={author.id}>
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Category (Optional)</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Score (for sports)</Label>
                  <Input
                    placeholder="Team A 2 - 1 Team B"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <Input
                      placeholder="Windsor Park, Roseau"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Temperature (for weather)</Label>
                    <Input
                      placeholder="28°C"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    placeholder="cricket, sports, live"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <Label>Auto-refresh</Label>
                    <Switch
                      checked={formData.autoRefresh}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoRefresh: checked })}
                    />
                  </div>

                  <div>
                    <Label>Refresh Interval (seconds)</Label>
                    <Input
                      type="number"
                      min="10"
                      max="300"
                      value={formData.refreshInterval}
                      onChange={(e) => setFormData({ ...formData, refreshInterval: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <Label>Pin to top</Label>
                    <Switch
                      checked={formData.isSticky}
                      onCheckedChange={(checked) => setFormData({ ...formData, isSticky: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <Label>Show on homepage</Label>
                    <Switch
                      checked={formData.showOnHomepage}
                      onCheckedChange={(checked) => setFormData({ ...formData, showOnHomepage: checked })}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="flex-1"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Live Update'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Update Modal */}
        {selectedUpdate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Add Update</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedUpdate(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{selectedUpdate.title}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's happening now?"
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  rows={4}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (newUpdateContent.trim() && formData.authorId) {
                        addUpdateMutation.mutate({
                          id: selectedUpdate.id,
                          content: newUpdateContent,
                          authorId: formData.authorId || authors[0]?.id,
                        });
                      }
                    }}
                    disabled={!newUpdateContent.trim() || addUpdateMutation.isPending}
                    className="flex-1"
                  >
                    {addUpdateMutation.isPending ? 'Posting...' : 'Post Update'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedUpdate(null);
                      setNewUpdateContent('');
                    }}
                  >
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

export default LiveUpdatesManager;
