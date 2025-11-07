import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recycleBinApi } from '@/lib/api/recycleBin';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, RotateCcw, AlertTriangle, FileText, FolderOpen, Tag, FileCode, Megaphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const RecycleBin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<'all' | 'article' | 'category' | 'tag' | 'page' | 'breaking-news'>('all');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; title: string } | null>(null);
  const [showEmptyDialog, setShowEmptyDialog] = useState(false);

  // Fetch recycle bin items
  const { data: recycleBinData, isLoading } = useQuery({
    queryKey: ['recycleBin', selectedTab],
    queryFn: () => selectedTab === 'all' 
      ? recycleBinApi.getAll() 
      : recycleBinApi.getByType(selectedTab),
  });

  const items = recycleBinData?.success ? recycleBinData.data : [];

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: string }) => 
      recycleBinApi.restore(id, type as any),
    onSuccess: (_, variables) => {
      toast({
        title: 'Item Restored',
        description: 'The item has been successfully restored.',
      });
      queryClient.invalidateQueries({ queryKey: ['recycleBin'] });
      queryClient.invalidateQueries({ queryKey: [variables.type] });
    },
    onError: () => {
      toast({
        title: 'Restore Failed',
        description: 'Failed to restore the item. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Permanent delete mutation
  const deleteMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: string }) => 
      recycleBinApi.permanentDelete(id, type as any),
    onSuccess: () => {
      toast({
        title: 'Item Deleted',
        description: 'The item has been permanently deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['recycleBin'] });
      setItemToDelete(null);
    },
    onError: () => {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete the item. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Empty bin mutation
  const emptyBinMutation = useMutation({
    mutationFn: () => selectedTab === 'all' 
      ? recycleBinApi.emptyBin() 
      : recycleBinApi.emptyByType(selectedTab),
    onSuccess: () => {
      toast({
        title: 'Recycle Bin Emptied',
        description: 'All items have been permanently deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['recycleBin'] });
      setShowEmptyDialog(false);
    },
    onError: () => {
      toast({
        title: 'Empty Failed',
        description: 'Failed to empty recycle bin. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'category': return <FolderOpen className="h-4 w-4" />;
      case 'tag': return <Tag className="h-4 w-4" />;
      case 'page': return <FileCode className="h-4 w-4" />;
      case 'breaking-news': return <Megaphone className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'category': return 'bg-green-100 text-green-800';
      case 'tag': return 'bg-purple-100 text-purple-800';
      case 'page': return 'bg-orange-100 text-orange-800';
      case 'breaking-news': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Recycle Bin
            </h1>
            <p className="text-muted-foreground">
              Restore or permanently delete items
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowEmptyDialog(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Empty Recycle Bin
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
            <TabsTrigger value="category">Categories</TabsTrigger>
            <TabsTrigger value="tag">Tags</TabsTrigger>
            <TabsTrigger value="page">Pages</TabsTrigger>
            <TabsTrigger value="breaking-news">Breaking News</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            {isLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading recycle bin...</p>
                </CardContent>
              </Card>
            ) : items.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Trash2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Recycle Bin is Empty</h3>
                  <p className="text-muted-foreground">
                    Deleted items will appear here and can be restored within 30 days.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(item.type)}>
                              <span className="flex items-center gap-1">
                                {getTypeIcon(item.type)}
                                {item.type.replace('-', ' ')}
                              </span>
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <CardDescription className="mt-2">
                            Deleted {formatDistanceToNow(new Date(item.deletedAt), { addSuffix: true })}
                            {item.deletedBy && ` by ${item.deletedBy}`}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => restoreMutation.mutate({ id: item.id, type: item.type })}
                            disabled={restoreMutation.isPending}
                            className="gap-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setItemToDelete({ id: item.id, type: item.type, title: item.title })}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Forever
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Permanent Delete Confirmation Dialog */}
        <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Permanently Delete Item?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete "{itemToDelete?.title}"? 
                This action cannot be undone and the item will be lost forever.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (itemToDelete) {
                    deleteMutation.mutate({ id: itemToDelete.id, type: itemToDelete.type });
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Empty Bin Confirmation Dialog */}
        <AlertDialog open={showEmptyDialog} onOpenChange={setShowEmptyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Empty Recycle Bin?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete all {items.length} item(s) in the recycle bin? 
                This action cannot be undone and all items will be lost forever.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => emptyBinMutation.mutate()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Empty Recycle Bin
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default RecycleBin;
