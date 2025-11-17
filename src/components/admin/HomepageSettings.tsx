import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, settingsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { GripVertical, Eye, EyeOff, Save, Radio, Zap, Star, Clock } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableCategoryProps {
  category: any;
  isVisible: boolean;
  onToggle: (id: string) => void;
}

interface SortableSectionProps {
  section: {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    bgColor: string;
  };
}

function SortableSection({ section }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = section.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 border rounded-lg ${section.bgColor} ${
        isDragging ? 'shadow-lg ring-2 ring-primary' : 'shadow-sm'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className={`p-2 ${section.color} rounded-lg`}>
        <IconComponent className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <div className="font-semibold">{section.name}</div>
        <div className="text-sm text-muted-foreground">{section.description}</div>
      </div>

      <Badge variant="secondary" className="text-xs">
        {section.id === 'live-news' && 'Live'}
        {section.id === 'breaking-news' && 'Breaking'}
        {section.id === 'featured' && 'Featured'}
        {section.id === 'latest' && 'Latest'}
      </Badge>
    </div>
  );
}

function SortableCategory({ category, isVisible, onToggle }: SortableCategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white border rounded-lg ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      } ${!isVisible ? 'opacity-50' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color || '#000' }}
          />
          <span className="font-medium">{category.name}</span>
          <Badge variant="outline" className="text-xs">
            {category.slug}
          </Badge>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle(category.id)}
        className="gap-2"
      >
        {isVisible ? (
          <>
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Visible</span>
          </>
        ) : (
          <>
            <EyeOff className="h-4 w-4" />
            <span className="hidden sm:inline">Hidden</span>
          </>
        )}
      </Button>
    </div>
  );
}

export function HomepageSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sectionOrder, setSectionOrder] = useState<string[]>(['live-news', 'breaking-news', 'latest', 'featured']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [showLiveNews, setShowLiveNews] = useState(true);
  const [showBreakingNews, setShowBreakingNews] = useState(true);
  const [showFeaturedNews, setShowFeaturedNews] = useState(true);
  const [showLatestNews, setShowLatestNews] = useState(true);

  // Define available sections
  const availableSections = [
    {
      id: 'live-news',
      name: 'Live News',
      description: 'Real-time updates and breaking stories',
      icon: Radio,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-gradient-to-r from-red-50 to-white',
    },
    {
      id: 'breaking-news',
      name: 'Breaking News',
      description: 'Urgent news alerts and announcements',
      icon: Zap,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-50 to-white',
    },
    {
      id: 'latest',
      name: 'Latest News',
      description: 'Most recent articles across all categories',
      icon: Clock,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-gradient-to-r from-green-50 to-white',
    },
    {
      id: 'featured',
      name: 'Featured Story',
      description: 'Hero section with main featured article',
      icon: Star,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-50 to-white',
    },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  // Fetch settings
  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get(),
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => settingsApi.update(data),
    onSuccess: async () => {
      // DON'T refetch - it causes the state to reset
      // Just invalidate so next load will be fresh
      await queryClient.invalidateQueries({ queryKey: ['settings'] });
      
      toast({
        title: 'Settings saved!',
        description: 'Homepage settings have been updated successfully. Refresh the homepage to see changes.',
      });
    },
    onError: (error: any) => {
      console.error('❌ Settings update error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error message:', error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save settings';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Initialize categories
  useEffect(() => {
    if (categoriesData?.success) {
      const cats = categoriesData.data || [];
      setAllCategories(cats);
    }
  }, [categoriesData]);

  // Initialize selected categories from settings (only once when settings load)
  useEffect(() => {
    if (settingsData?.success && allCategories.length > 0 && selectedCategories.length === 0) {
      if (settingsData.data?.homepageCategories && settingsData.data.homepageCategories.length > 0) {
        console.log('📥 Loading categories from settings:', settingsData.data.homepageCategories);
        setSelectedCategories(settingsData.data.homepageCategories);
      } else {
        console.log('📥 Using default categories (first 3)');
        setSelectedCategories(allCategories.slice(0, 3).map((c: any) => c.id));
      }
    }
  }, [settingsData, allCategories]);

  // Initialize section order and visibility settings
  useEffect(() => {
    if (settingsData?.success && settingsData.data) {
      if (settingsData.data.homepageSectionOrder) {
        // Handle both old format (string) and new format (array)
        if (Array.isArray(settingsData.data.homepageSectionOrder)) {
          setSectionOrder(settingsData.data.homepageSectionOrder);
        } else {
          // Convert old format to new format
          const oldOrder = settingsData.data.homepageSectionOrder;
          if (oldOrder === 'latest-first') {
            setSectionOrder(['live-news', 'breaking-news', 'latest', 'featured']);
          } else {
            setSectionOrder(['live-news', 'breaking-news', 'featured', 'latest']);
          }
        }
      }
      if (settingsData.data.showLiveNewsOnHomepage !== undefined) {
        setShowLiveNews(settingsData.data.showLiveNewsOnHomepage);
      }
      if (settingsData.data.showBreakingNewsOnHomepage !== undefined) {
        setShowBreakingNews(settingsData.data.showBreakingNewsOnHomepage);
      }
      if (settingsData.data.showFeaturedNewsOnHomepage !== undefined) {
        setShowFeaturedNews(settingsData.data.showFeaturedNewsOnHomepage);
      }
      if (settingsData.data.showLatestNewsOnHomepage !== undefined) {
        setShowLatestNews(settingsData.data.showLatestNewsOnHomepage);
      }
    }
  }, [settingsData]);

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedCategories((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      console.log('👁️ Toggle category:', categoryId, 'New selection:', newSelection);
      return newSelection;
    });
  };

  const handleSave = () => {
    console.log('💾 Current state before save:');
    console.log('  - sectionOrder:', sectionOrder);
    console.log('  - selectedCategories:', selectedCategories);
    console.log('  - selectedCategories.length:', selectedCategories.length);
    console.log('  - showLiveNews:', showLiveNews);
    console.log('  - showBreakingNews:', showBreakingNews);
    console.log('  - showFeaturedNews:', showFeaturedNews);
    console.log('  - showLatestNews:', showLatestNews);
    
    const dataToSend = {
      homepageSectionOrder: sectionOrder,
      homepageCategories: selectedCategories,
      showLiveNewsOnHomepage: showLiveNews,
      showBreakingNewsOnHomepage: showBreakingNews,
      showFeaturedNewsOnHomepage: showFeaturedNews,
      showLatestNewsOnHomepage: showLatestNews,
    };
    console.log('💾 Saving homepage settings:', JSON.stringify(dataToSend, null, 2));
    updateSettingsMutation.mutate(dataToSend);
  };

  // Get ordered categories for display
  const orderedCategories = allCategories.sort((a, b) => {
    const aIndex = selectedCategories.indexOf(a.id);
    const bIndex = selectedCategories.indexOf(b.id);
    
    // If both are selected, sort by their position in selectedCategories
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // Selected categories come first
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    // Unselected categories maintain their original order
    return 0;
  });

  const visibleCategories = orderedCategories.filter((cat) =>
    selectedCategories.includes(cat.id)
  );

  return (
    <div className="space-y-6">
      {/* Homepage Sections Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Sections Visibility</CardTitle>
          <p className="text-sm text-muted-foreground">
            Control which sections appear on your homepage
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Live News Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-red-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Radio className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <Label className="text-base font-semibold cursor-pointer">Live News</Label>
                <p className="text-sm text-muted-foreground">
                  Real-time updates and breaking stories
                </p>
              </div>
            </div>
            <Switch
              checked={showLiveNews}
              onCheckedChange={setShowLiveNews}
            />
          </div>

          {/* Breaking News Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <Label className="text-base font-semibold cursor-pointer">Breaking News</Label>
                <p className="text-sm text-muted-foreground">
                  Urgent news alerts and announcements
                </p>
              </div>
            </div>
            <Switch
              checked={showBreakingNews}
              onCheckedChange={setShowBreakingNews}
            />
          </div>

          {/* Featured News Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <Label className="text-base font-semibold cursor-pointer">Featured Story</Label>
                <p className="text-sm text-muted-foreground">
                  Hero section with main featured article
                </p>
              </div>
            </div>
            <Switch
              checked={showFeaturedNews}
              onCheckedChange={setShowFeaturedNews}
            />
          </div>

          {/* Latest News Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-green-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <Label className="text-base font-semibold cursor-pointer">Latest News</Label>
                <p className="text-sm text-muted-foreground">
                  Most recent articles across all categories
                </p>
              </div>
            </div>
            <Switch
              checked={showLatestNews}
              onCheckedChange={setShowLatestNews}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section Order */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Section Order</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag sections to change their order on the homepage. Sections will appear in this order from top to bottom.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {sectionOrder.map((sectionId, index) => {
                  const section = availableSections.find(s => s.id === sectionId);
                  if (!section) return null;
                  return (
                    <div key={section.id} className="relative">
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <SortableSection section={section} />
                    </div>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-2">
              <div className="text-amber-600">⚡</div>
              <div className="flex-1 text-sm text-amber-900">
                <p className="font-medium mb-1">Section Order:</p>
                <p className="text-amber-800">
                  Drag sections up or down to change their display order. The top section will appear first on your homepage.
                  Category sections will appear after these main sections.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Category Sections</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag to reorder categories. Click the eye icon to show/hide categories on the homepage.
            These sections will appear below Latest News and Featured Story.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="text-2xl font-bold">{selectedCategories.length}</div>
              <div className="text-xs text-muted-foreground">Visible</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-2xl font-bold">{allCategories.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                Drag categories to change their order on the homepage
              </div>
            </div>
          </div>

          {/* Visible Categories (Draggable) */}
          {visibleCategories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base">Visible Categories (Drag to Reorder)</Label>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleCategoryDragEnd}
              >
                <SortableContext
                  items={visibleCategories.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {visibleCategories.map((category) => (
                      <SortableCategory
                        key={category.id}
                        category={category}
                        isVisible={true}
                        onToggle={toggleCategoryVisibility}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Hidden Categories */}
          {orderedCategories.filter((cat) => !selectedCategories.includes(cat.id)).length > 0 && (
            <div className="space-y-2">
              <Label className="text-base">Hidden Categories</Label>
              <div className="space-y-2">
                {orderedCategories
                  .filter((cat) => !selectedCategories.includes(cat.id))
                  .map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-3 p-3 bg-muted/30 border border-dashed rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color || '#000' }}
                          />
                          <span className="font-medium text-muted-foreground">
                            {category.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {category.slug}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCategoryVisibility(category.id)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Show</span>
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <div className="text-blue-600">💡</div>
              <div className="flex-1 text-sm text-blue-900">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Drag categories to change their display order</li>
                  <li>Click the eye icon to show/hide categories</li>
                  <li>Hidden categories won't appear on the homepage</li>
                  <li>Changes take effect immediately after saving</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            className="w-full gap-2"
            size="lg"
          >
            <Save className="h-4 w-4" />
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Homepage Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
