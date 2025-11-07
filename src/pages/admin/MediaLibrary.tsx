import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaApi } from "@/lib/api";
import { useDropzone } from "react-dropzone";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Upload, Image, Search, Trash2, Download, Copy, Eye, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MediaLibrary = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch media from API
  const { data, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: () => mediaApi.getAll(),
  });

  const mediaFiles = data?.success ? data.data : [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: mediaApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast({
        title: "Media Deleted",
        description: "The media file has been deleted successfully.",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete media",
        variant: "destructive",
      });
    },
  });



  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    
    try {
      // Upload files to API
      for (const file of acceptedFiles) {
        try {
          await mediaApi.upload(file);
        } catch (error) {
          console.error('Upload error:', error);
        }
      }
      
      // Refresh media list
      queryClient.invalidateQueries({ queryKey: ["media"] });
      
      toast({
        title: "Upload Complete",
        description: `${acceptedFiles.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Some files failed to upload. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast, queryClient]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    multiple: true
  });

  const handleDelete = (mediaId: string) => {
    deleteMutation.mutate(mediaId);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Media URL copied to clipboard.",
    });
  };

  const filteredMedia = mediaFiles.filter(media => {
    const matchesSearch = media.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         media.alt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || media.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
              <Image className="h-8 w-8 text-primary" />
              Media Library
            </h1>
            <p className="text-muted-foreground">Manage images and media files</p>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? "scale-105 text-primary" : ""
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {isDragActive ? "Drop files here" : isUploading ? "Uploading..." : "Upload Media Files"}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop images here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF, WebP, SVG (Max 10MB each)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-sm"
            >
              <option value="all">All Files</option>
              <option value="image">Images</option>
              <option value="file">Other Files</option>
            </select>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredMedia.map((media) => (
            <Card key={media.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                  src={media.url}
                  alt={media.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedImage(media)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCopyUrl(media.url)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Media</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{media.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(media.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate" title={media.name}>
                  {media.name}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{media.size}</span>
                  <span className="text-xs text-muted-foreground">{media.dimensions}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <Card className="p-12 text-center">
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No media files match your search" : "No media files uploaded yet"}
            </p>
            {!searchQuery && (
              <p className="text-sm text-muted-foreground">
                Upload your first media file using the upload area above
              </p>
            )}
          </Card>
        )}

        {/* Media Detail Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Media Details</DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    className="w-full rounded-lg border"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">File Name</label>
                    <p className="text-sm text-muted-foreground">{selectedImage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Alt Text</label>
                    <p className="text-sm text-muted-foreground">{selectedImage.alt}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Dimensions</label>
                    <p className="text-sm text-muted-foreground">{selectedImage.dimensions}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">File Size</label>
                    <p className="text-sm text-muted-foreground">{selectedImage.size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Upload Date</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={selectedImage.url}
                        readOnly
                        className="text-xs font-mono"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleCopyUrl(selectedImage.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => window.open(selectedImage.url, '_blank')}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex-1">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Media</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{selectedImage.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDelete(selectedImage.id);
                              setSelectedImage(null);
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default MediaLibrary;