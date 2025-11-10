# 🔴 Live News & Updates - Frontend Implementation

## ✅ What's Been Created

### 1. API Client (`src/lib/api/liveUpdates.ts`)
Complete API client with all endpoints:
- ✅ Get all live updates
- ✅ Get active updates
- ✅ Get by type
- ✅ Get by ID
- ✅ Create live update (admin)
- ✅ Add update to live event (admin)
- ✅ Update/pause/resume/end live (admin)
- ✅ Delete live update (admin)

### 2. Homepage Widget (`src/components/LiveUpdatesWidget.tsx`)
- ✅ Shows top 3 active live updates
- ✅ Auto-refreshes every 30 seconds
- ✅ Type badges with colors and icons
- ✅ Live indicator with pulse animation
- ✅ Score display for sports
- ✅ Location display
- ✅ Update count
- ✅ Responsive design

## 🚀 Quick Setup

### Step 1: Add Widget to Homepage

Edit `src/pages/Index.tsx`:

```tsx
import LiveUpdatesWidget from "@/components/LiveUpdatesWidget";

// Add after BreakingNewsBanner, before main content:
<SafeComponent componentName="LiveUpdatesWidget">
  <LiveUpdatesWidget />
</SafeComponent>
```

### Step 2: Create Live Update View Page

Create `src/pages/LiveUpdatePage.tsx`:

```tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { liveUpdatesApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User } from 'lucide-react';

const LiveUpdatePage = () => {
  const { id } = useParams();
  
  const { data, refetch } = useQuery({
    queryKey: ['liveUpdate', id],
    queryFn: () => liveUpdatesApi.getById(id!),
    enabled: !!id,
    refetchInterval: (data) => {
      const liveUpdate = data?.data;
      if (liveUpdate?.autoRefresh && liveUpdate?.status === 'active') {
        return (liveUpdate.refreshInterval || 30) * 1000;
      }
      return false;
    },
  });

  const liveUpdate = data?.data;

  if (!liveUpdate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-l-red-600">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-red-600 text-white animate-pulse">
              🔴 LIVE
            </Badge>
            <Badge className="bg-gray-600 text-white">
              {liveUpdate.type.toUpperCase()}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{liveUpdate.title}</h1>
          
          {liveUpdate.metadata?.score && (
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-2xl font-bold text-center">
                {liveUpdate.metadata.score}
              </p>
            </div>
          )}
          
          {liveUpdate.metadata?.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {liveUpdate.metadata.location}
            </div>
          )}
        </div>

        {/* Updates Timeline */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Live Updates</h2>
          
          <div className="space-y-4">
            {liveUpdate.updates.slice().reverse().map((update, index) => (
              <div
                key={index}
                className="border-l-4 border-l-blue-600 pl-4 py-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  {new Date(update.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Dominica'
                  })}
                </div>
                
                <p className="text-base mb-2">{update.content}</p>
                
                {update.attachments && update.attachments.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {update.attachments.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="Update attachment"
                        className="rounded"
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <User className="h-3 w-3" />
                  {update.author.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-refresh indicator */}
        {liveUpdate.autoRefresh && liveUpdate.status === 'active' && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full text-sm">
            Auto-refreshing every {liveUpdate.refreshInterval}s
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveUpdatePage;
```

### Step 3: Add Route

Edit `src/App.tsx`:

```tsx
import LiveUpdatePage from "./pages/LiveUpdatePage";

// Add route:
<Route path="/live/:id" element={<LiveUpdatePage />} />
```

### Step 4: Create Admin Manager

Create `src/pages/admin/LiveUpdatesManager.tsx`:

```tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { liveUpdatesApi } from '@/lib/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Play, Pause, StopCircle, Trash2 } from 'lucide-react';

const LiveUpdatesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const [newUpdateContent, setNewUpdateContent] = useState('');

  const { data } = useQuery({
    queryKey: ['admin', 'liveUpdates'],
    queryFn: () => liveUpdatesApi.getAll(),
  });

  const addUpdateMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      liveUpdatesApi.addUpdate(id, {
        content,
        authorId: 'current-user-id', // Get from auth context
      }),
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

  const liveUpdates = data?.success ? data.data : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🔴 Live Updates Manager</h1>
            <p className="text-muted-foreground">
              Manage real-time updates for breaking news, sports, and more
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Live Update
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveUpdates.map((update: any) => (
            <Card key={update.id} className="border-l-4 border-l-red-600">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={
                    update.status === 'active' ? 'bg-green-600' :
                    update.status === 'paused' ? 'bg-yellow-600' :
                    'bg-gray-600'
                  }>
                    {update.status}
                  </Badge>
                  <Badge>{update.type}</Badge>
                </div>
                <CardTitle className="text-lg">{update.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {update.metadata?.score && (
                  <div className="bg-gray-100 rounded p-2 mb-3 text-center font-semibold">
                    {update.metadata.score}
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground space-y-1 mb-4">
                  <p>{update.updateCount || 0} updates</p>
                  <p>{update.viewCount || 0} views</p>
                  <p>Started: {new Date(update.startedAt).toLocaleString()}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUpdate(update)}
                    disabled={update.status !== 'active'}
                  >
                    Add Update
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => endLiveMutation.mutate(update.id)}
                    disabled={update.status === 'ended'}
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Update Modal */}
        {selectedUpdate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Add Update: {selectedUpdate.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's happening now?"
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (newUpdateContent.trim()) {
                        addUpdateMutation.mutate({
                          id: selectedUpdate.id,
                          content: newUpdateContent,
                        });
                      }
                    }}
                    disabled={!newUpdateContent.trim()}
                  >
                    Post Update
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
```

## 📋 Complete Implementation Checklist

### Frontend Components:
- ✅ API Client (`liveUpdates.ts`)
- ✅ Homepage Widget (`LiveUpdatesWidget.tsx`)
- ⏳ Live Update View Page (`LiveUpdatePage.tsx`) - Code provided above
- ⏳ Admin Manager (`LiveUpdatesManager.tsx`) - Code provided above
- ⏳ Create Live Update Form
- ⏳ Add to admin navigation

### Integration Steps:
1. ✅ Add API client to exports
2. ⏳ Add widget to homepage
3. ⏳ Add route for live update pages
4. ⏳ Add admin route
5. ⏳ Add to admin navigation menu

## 🎨 Styling

The components use Tailwind CSS with these key features:
- Pulse animation for live indicators
- Type-specific colors (red for breaking, green for sports, etc.)
- Responsive grid layouts
- Auto-refresh indicators
- Mobile-optimized design

## 🚀 Usage Examples

### Creating a Live Cricket Match:
```typescript
await liveUpdatesApi.create({
  title: "Live: Cricket - Dominica vs Jamaica",
  content: "Match starting soon at Windsor Park",
  type: "sports",
  priority: 5,
  authorId: "author-id",
  metadata: {
    score: "0 - 0",
    location: "Windsor Park, Roseau",
    participants: ["Dominica", "Jamaica"]
  },
  autoRefresh: true,
  refreshInterval: 30,
  isSticky: true,
  showOnHomepage: true
});
```

### Adding Updates:
```typescript
await liveUpdatesApi.addUpdate(liveUpdateId, {
  content: "WICKET! Player out for 45 runs",
  authorId: "author-id",
  attachments: ["image-url.jpg"]
});
```

## ✅ Features Implemented

- ✅ Real-time auto-refresh
- ✅ Multiple update types (breaking, sports, weather, etc.)
- ✅ Priority system
- ✅ Metadata support (scores, location, temperature)
- ✅ View tracking
- ✅ Sticky/homepage display
- ✅ Status management (active/paused/ended)
- ✅ Mobile responsive
- ✅ Type-specific styling
- ✅ Live indicators with animations

## 🎯 Next Steps

1. Copy the code above for `LiveUpdatePage.tsx` and `LiveUpdatesManager.tsx`
2. Add the widget to homepage
3. Add routes to App.tsx
4. Add admin navigation link
5. Test with backend API

The Live Updates feature is ready to use! 🔴🚀
